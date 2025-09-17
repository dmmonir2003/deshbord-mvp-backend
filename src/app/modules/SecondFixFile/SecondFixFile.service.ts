/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SECONDFIXFILE_SEARCHABLE_FIELDS } from './SecondFixFile.constant';
import mongoose, { Types } from 'mongoose';
import { TSecondFixFile } from './SecondFixFile.interface';
import { SecondFixFile } from './SecondFixFile.model';
import { User } from '../User/user.model';
import { NotificationServices } from '../Notification/Notification.service';

const createSecondFixFileIntoDB = async (
  payload: TSecondFixFile,
  file?:any
) => {

  if(file){
    payload.file = file.location;
    // payload.fileKey = file.key;
    // payload.fileName = file.originalname;
    // payload.fileMimeType = file.mimetype;
    // payload.fileSize = file.size;
  }

  const result = await SecondFixFile.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SecondFixFile');
  }

  
      const ndata = {
    title: 'SecondFix File Creation',
    message: "A SecondFix File created",
    // projectId:payload?.projectId,
    readBy: []
  }

  const createdData = await NotificationServices.createNotificationIntoDB(ndata)
  
  if(!createdData) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Notification');

  return result;
};

const shareSecondFixFileIntoDB = async (
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

  const project = await SecondFixFile.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('DocumentFile not found or update failed');
  }

  return project;
};
const unShareSecondFixFileIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await SecondFixFile.findByIdAndUpdate(
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


const getAllSecondFixFilesFromDB = async (query: Record<string, unknown>) => {
  const SecondFixFileQuery = new QueryBuilder(
    SecondFixFile.find(),
    query,
  )
    .search(SECONDFIXFILE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SecondFixFileQuery.modelQuery;
  const meta = await SecondFixFileQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSecondFixFileFromDB = async (id: string) => {
  const result = await SecondFixFile.findById(id).populate({
      path: "sharedWith.userId", // field to populate
      select: "name profileImg role", // only return what you need
    });

  return result;
};

const updateSecondFixFileIntoDB = async (id: string, payload: any, file?:any) => {

  if(file){
    payload.file = file.location;
  }

  const isDeletedService = await mongoose.connection
    .collection('secondfixfiles')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('SecondFixFile not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SecondFixFile');
  }

  const updatedData = await SecondFixFile.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SecondFixFile not found after update');
  }

  return updatedData;
};

const deleteSecondFixFileFromDB = async (id: string) => {
  const deletedService = await SecondFixFile.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SecondFixFile');
  }

  return deletedService;
};

export const SecondFixFileServices = {
  createSecondFixFileIntoDB,
  getAllSecondFixFilesFromDB,
  getSingleSecondFixFileFromDB,
  updateSecondFixFileIntoDB,
  deleteSecondFixFileFromDB,
  unShareSecondFixFileIntoDB,
  shareSecondFixFileIntoDB
};
