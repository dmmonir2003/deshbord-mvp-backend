/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { HANDOVERCOMBINE_SEARCHABLE_FIELDS } from './HandoverCombine.constant';
import mongoose, { Types } from 'mongoose';
import { THandoverCombine } from './HandoverCombine.interface';
import { HandoverCombine } from './HandoverCombine.model';
import { User } from '../User/user.model';
import { Handover } from '../Handover/Handover.model';

const createHandoverCombineIntoDB = async (
  payload: THandoverCombine,
) => {
  const result = await HandoverCombine.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create HandoverCombine');
  }

  return result;
};


const shareHandoverCombineIntoDB = async (
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

  const project = await HandoverCombine.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('DocumentFile not found or update failed');
  }

  return project;
};
const unShareHandoverCombineIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await HandoverCombine.findByIdAndUpdate(
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


const getAllHandoverCombinesFromDB = async (query: Record<string, unknown>) => {
  const HandoverCombineQuery = new QueryBuilder(
    HandoverCombine.find(),
    query,
  )
    .search(HANDOVERCOMBINE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HandoverCombineQuery.modelQuery;
  const meta = await HandoverCombineQuery.countTotal();
  return {
    result,
    meta,
  };
};
const getAllHandoverCombinesDataFromDB = async (id:string, query: Record<string, unknown>) => {

  // const HandoverCombineData = await HandoverCombine.findById(id).populate({
  //   path: "sharedWith.userId",
  //   select: "name profileImg role" // only fetch name and image
  // });

  const HandoverCombineData = await HandoverCombine.findById(id);


  const HandoverCombineQuery = new QueryBuilder(
    Handover.find({
    _id: { $in: HandoverCombineData?.files.map(id => new Types.ObjectId(id)) }
  }),
    query,
  )
    .search(HANDOVERCOMBINE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HandoverCombineQuery.modelQuery;
  const meta = await HandoverCombineQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleHandoverCombineFromDB = async (id: string) => {
  const result = await HandoverCombine.findById(id).populate({
      path: "sharedWith.userId",
      select: "name profileImg role" // only fetch name and image
    });;

  return result;
};

const updateHandoverCombineIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('handovercombines')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('HandoverCombine not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted HandoverCombine');
  }

  const updatedData = await HandoverCombine.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('HandoverCombine not found after update');
  }

  return updatedData;
};

const deleteHandoverCombineFromDB = async (id: string) => {
  const deletedService = await HandoverCombine.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete HandoverCombine');
  }

  return deletedService;
};

export const HandoverCombineServices = {
  createHandoverCombineIntoDB,
  getAllHandoverCombinesFromDB,
  getSingleHandoverCombineFromDB,
  updateHandoverCombineIntoDB,
  deleteHandoverCombineFromDB,
  shareHandoverCombineIntoDB,
  unShareHandoverCombineIntoDB,
  getAllHandoverCombinesDataFromDB
};
