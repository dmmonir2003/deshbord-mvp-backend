/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TIMESCHEDULE_SEARCHABLE_FIELDS } from './TimeSchedule.constant';
import mongoose, { Types } from 'mongoose';
import { TTimeSchedule } from './TimeSchedule.interface';
import { TimeSchedule } from './TimeSchedule.model';
import { User } from '../User/user.model';

const createTimeScheduleIntoDB = async (
  payload: TTimeSchedule,
  file?:any
) => {
  if(file){
    payload.file = file.location;
  }
  const result = await TimeSchedule.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create TimeSchedule');
  }

  return result;
};


const shareTimeScheduleIntoDB = async (
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

  const project = await TimeSchedule.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('DocumentFile not found or update failed');
  }

  return project;
};
const unShareTimeScheduleIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await TimeSchedule.findByIdAndUpdate(
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


const getAllTimeSchedulesFromDB = async (query: Record<string, unknown>) => {
  const TimeScheduleQuery = new QueryBuilder(
    TimeSchedule.find(),
    query,
  )
    .search(TIMESCHEDULE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TimeScheduleQuery.modelQuery;
  const meta = await TimeScheduleQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleTimeScheduleFromDB = async (id: string) => {
  const result = await TimeSchedule.findById(id).populate({
      path: "sharedWith.userId", // field to populate
      select: "name profileImg role", // only return what you need
    });

  return result;
};

const updateTimeScheduleIntoDB = async (id: string, payload: any, file?:any) => {

    if(file){
    payload.file = file.location;
  }

  const isDeletedService = await mongoose.connection
    .collection('timeschedules')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('TimeSchedule not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted TimeSchedule');
  }

  const updatedData = await TimeSchedule.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('TimeSchedule not found after update');
  }

  return updatedData;
};

const deleteTimeScheduleFromDB = async (id: string) => {
  const deletedService = await TimeSchedule.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete TimeSchedule');
  }

  return deletedService;
};

export const TimeScheduleServices = {
  createTimeScheduleIntoDB,
  getAllTimeSchedulesFromDB,
  getSingleTimeScheduleFromDB,
  updateTimeScheduleIntoDB,
  deleteTimeScheduleFromDB,
  shareTimeScheduleIntoDB, 
  unShareTimeScheduleIntoDB
};
