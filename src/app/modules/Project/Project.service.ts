/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { PROJECT_SEARCHABLE_FIELDS } from './Project.constant';
// import mongoose, { Schema } from 'mongoose';
import { TProject } from './Project.interface';
import { Project } from './Project.model';
import { User } from '../User/user.model';
import mongoose, { Types } from 'mongoose';
import moment from 'moment';

const createProjectIntoDB = async (
  payload: TProject,
  file?: any
) => {
   if(file) {
    payload.contractFile = file.location;
  }

  const result = await Project.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Project');
  }

  return result;
};


const shareProjectIntoDB = async (
  projectId: string,
  sharedWith: { userId: string; role: 'client' | 'basicAdmin' }[],
  user?: any
) => {
  const { userEmail } = user;

  const sharedBy = await User.isUserExistsByCustomEmail(userEmail).then(
    (user: any) => user?._id
  );

  if (!sharedBy) {
    throw new Error('Shared by user not found');
  }

  const sharedEntries = sharedWith.map(entry => ({
    userId: new Types.ObjectId(entry.userId),
    role: entry.role,
    sharedBy: new Types.ObjectId(sharedBy),
  }));

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};
const unShareProjectIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await Project.findByIdAndUpdate(
     projectId,
     {
       $pull: {
         sharedWith: {
           userId: { $in: userIds.map(id => new Types.ObjectId(id)) } // 🔄 remove multiple
         }
       }
     },
     { new: true }
   );
 
   if (!updatedProject) {
     throw new Error('Project not found or unshare failed');
   }
 
   return updatedProject;
};
// const unShareProjectIntoDB = async (
//   projectId : string,
//   userId: string,
// ) => {
//  const updatedProject = await Project.findByIdAndUpdate(
//     projectId,
//     {
//       $pull: {
//         sharedWith: { userId: new Types.ObjectId(userId) }
//       }
//     },
//     { new: true }
//   );

//   if (!updatedProject) {
//     throw new Error('Project not found or unshare failed');
//   }

//   return updatedProject;
// };


const getAllProjectsFromDB = async (query: Record<string, unknown>, user?: any) => {

  if( user?.role === 'client' || user?.role === 'basicAdmin'  ) {
  const { userEmail } = user;
  const userId = await User.isUserExistsByCustomEmail(userEmail).then(
    (user: any) => user?._id
  );

  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }  

     const ProjectQuery = new QueryBuilder(
    Project.find({
        sharedWith: {
          $elemMatch: {
            userId: new Types.ObjectId(userId),
            role: user?.role
          }
        }
      }),
    query,
  )
    .search(PROJECT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ProjectQuery.modelQuery;
  const meta = await ProjectQuery.countTotal();
  return {
    result,
    meta,
  };
  
  }else{
  const ProjectQuery = new QueryBuilder(
    Project.find(),
    query,
  )
    .search(PROJECT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ProjectQuery.modelQuery;
  const meta = await ProjectQuery.countTotal();
  return {
    result,
    meta,
  };
  }
};

const getSingleProjectFromDB = async (id: string) => {
  const result = await Project.findById(id)
    .populate({
      path: "sharedWith.userId", // field to populate
      select: "name profileImg email role", // only return what you need
    });

  return result;
};


const updateProjectIntoDB = async (id: string, payload: any) => {
  
  if (payload.status === 'completed') {
    payload.completedDate = new Date().toISOString();
  }

  const isDeletedService = await mongoose.connection
    .collection('projects')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('Project not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Project');
  }

  const updatedData = await Project.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Project not found after update');
  }

  return updatedData;
};

const deleteProjectFromDB = async (id: string) => {
  const deletedService = await Project.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Project');
  }

  return deletedService;
};


// const getEarningForProjectsOfMonthFromDB = async (query: Record<string, unknown>, user?: any) => {

//   console.log("Musaaaaaaaaaaaaaaaaa")
//   console.log("query",query)

//   const ProjectQuery = new QueryBuilder(
//     Project.find(),
//     query,
//   )
//     .search(PROJECT_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await ProjectQuery.modelQuery;
//   const meta = await ProjectQuery.countTotal();
//   return {
//     result,
//     meta,
//   };
//   }
const getEarningForProjectsOfMonthFromDB = async (query: Record<string, unknown>) => {
  console.log("Musaaaaaaaaaaaaaaaaa");
  console.log("query", query);

  const currentMonth = moment(); // Get the current date
  const monthsToInclude = parseInt(query.month as string) || 3; // Default to 3 if no month is provided
  
  // We're just interested in the months, not the overall range for all projects
  const earningsByMonth = [];
  let meta;
  let totalEarnings = 0;

  // Loop over the selected months (3, 6, or 12 months)
  for (let i = 0; i < monthsToInclude; i++) {
    const monthStart = currentMonth.clone().subtract(i, 'months').startOf('month'); // Start of the month
    const monthEnd = monthStart.clone().endOf('month'); // End of the month

    console.log(`Evaluating earnings for: ${monthStart.format('MMMM YYYY')}`);

    // Filter for completed projects whose `completedDate` is within this month
    const ProjectQuery = new QueryBuilder(
      Project.find({
        status: 'completed',
        completedDate: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() }, // Only completed projects within the month
      }),
      query,
    )
      .search(PROJECT_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await ProjectQuery.modelQuery;
      meta = await ProjectQuery.countTotal();
    // Sum up the earnings for the filtered projects
    const monthlyEarnings = result.reduce((sum, project) => sum + project.value, 0);
    
    earningsByMonth.push({
      month: monthStart.format('MMMM YYYY'),
      earnings: monthlyEarnings,
    });

    totalEarnings += monthlyEarnings;
  }
  // const result = await ProjectQuery.modelQuery;



  return {
    earningsByMonth,
    totalEarnings,
    meta,
  };
};


export const ProjectServices = {
  createProjectIntoDB,
  getAllProjectsFromDB,
  getSingleProjectFromDB,
  updateProjectIntoDB,
  deleteProjectFromDB,
  shareProjectIntoDB,
  unShareProjectIntoDB,
  getEarningForProjectsOfMonthFromDB

};
