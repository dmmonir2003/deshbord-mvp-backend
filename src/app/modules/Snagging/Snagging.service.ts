/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SNAGGING_SEARCHABLE_FIELDS } from './Snagging.constant';
import mongoose, { Types } from 'mongoose';
import { TSnagging } from './Snagging.interface';
import { Snagging } from './Snagging.model';
import { User } from '../User/user.model';
import { NotificationServices } from '../Notification/Notification.service';

const createSnaggingIntoDB = async (
  payload: TSnagging,
  files?:any
) => {

// Example: get overview files
const file = files['file']?.map((f:any) => f.location) || [];
const completeFile = files['completeFile']?.map((f:any) => f.location) || [];

    if(file.length > 0){
      payload.file = file; // Assuming file.location contains the S3 URL
    }
    if(completeFile.length > 0){
      payload.completeFile = completeFile; // Assuming file.location contains the S3 URL
    }


console.log("payload", payload);

  const result = await Snagging.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Snagging');
  }

       const ndata = {
    title: 'Snagging Creation',
    message: "A Snagging File created",
    // projectId:payload?.projectId,
    readBy: []
  }

  const createdData = await NotificationServices.createNotificationIntoDB(ndata)
  
  if(!createdData) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Notification');
  
  return result;
};

const shareSnaggingIntoDB = async (
  quoteId: string,
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

  const project = await Snagging.findByIdAndUpdate(
    quoteId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};

const unShareSnaggingIntoDB = async (
  projectId : string,
  userIds: string[],
) => {

 if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('No user IDs provided for unsharing');
  }

 const updatedProject = await Snagging.findByIdAndUpdate(
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

const getAllSnaggingsFromDB = async (query: Record<string, unknown>) => {
  const SnaggingQuery = new QueryBuilder(
    Snagging.find(),
    query,
  )
    .search(SNAGGING_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SnaggingQuery.modelQuery;
  const meta = await SnaggingQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSnaggingFromDB = async (id: string) => {
  const result = await Snagging.findById(id).populate({
      path: "sharedWith.userId", // field to populate
      select: "name profileImg email role", // only return what you need
    });

  return result;
};

const updateSnaggingIntoDB = async (id: string, payload: any, files?: any) => {


// Example: get overview files
const file = files['file']?.map((f:any) => f.location) || [];
const completeFile = files['completeFile']?.map((f:any) => f.location) || [];



    if(file.length > 0){
      payload.file = file; // Assuming file.location contains the S3 URL
    }
    if(completeFile.length > 0){
      payload.completeFile = completeFile; // Assuming file.location contains the S3 URL
    }


  const isDeletedService = await mongoose.connection
    .collection('snaggings')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('Snagging not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Snagging');
  }

  const updatedData = await Snagging.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Snagging not found after update');
  }

  return updatedData;
};

const deleteSnaggingFromDB = async (id: string) => {
  const deletedService = await Snagging.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Snagging');
  }

  return deletedService;
};

export const SnaggingServices = {
  createSnaggingIntoDB,
  getAllSnaggingsFromDB,
  getSingleSnaggingFromDB,
  updateSnaggingIntoDB,
  deleteSnaggingFromDB,
  shareSnaggingIntoDB, 
  unShareSnaggingIntoDB
};
