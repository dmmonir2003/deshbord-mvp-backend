/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DOCUMENTFILE_SEARCHABLE_FIELDS } from './DocumentFile.constant';
import mongoose,{ Types } from 'mongoose';
import { TDocumentFile } from './DocumentFile.interface';
import { DocumentFile } from './DocumentFile.model';
import { User } from '../User/user.model';
import { NotificationServices } from '../Notification/Notification.service';

const createDocumentFileIntoDB = async (
  payload: TDocumentFile,
  file?: any
) => {

  if(file){
    payload.file = file.location as string;
  } 

  const result = await DocumentFile.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DocumentFile');
  }

  const ndata = {
    title: 'Document Creation',
    message: "A Document created",
    projectId:payload?.projectId,
    readBy: []
  }

  const createdData = await NotificationServices.createNotificationIntoDB(ndata)
  
  if(!createdData) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Document');

  return result;
};


const shareDocumentFileIntoDB = async (
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

  const project = await DocumentFile.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('DocumentFile not found or update failed');
  }

  return project;
};
const unShareDocumentFileIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await DocumentFile.findByIdAndUpdate(
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


const getAllDocumentFilesFromDB = async (query: Record<string, unknown>) => {
  const DocumentFileQuery = new QueryBuilder(
    DocumentFile.find(),
    query,
  )
    .search(DOCUMENTFILE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DocumentFileQuery.modelQuery;
  const meta = await DocumentFileQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleDocumentFileFromDB = async (id: string) => {
  const result = await DocumentFile.findById(id).populate({
      path: "sharedWith.userId",
      select: "name profileImg role" // only fetch name and image
    });
// 68b517b014f25a7a54c58385
// 68b51a5414f25a7a54c583d4
// 68b51e2414f25a7a54c58414
//  console.log("🚀 ~ file: DocumentFile.service.ts:147 ~ getSingleDocumentFileFromDB ~ result:", result)

  return result;
};

const updateDocumentFileIntoDB = async (id: string, payload: any, file?: any) => {

  if(file){
    payload.file = file.location as string;
  } 

  const isDeletedService = await mongoose.connection
    .collection('documentfiles')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      // { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService) {
    throw new Error('DocumentFile not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted DocumentFile');
  }

  const updatedData = await DocumentFile.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('DocumentFile not found after update');
  }

  return updatedData;
};

const deleteDocumentFileFromDB = async (id: string) => {
  const deletedService = await DocumentFile.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete DocumentFile');
  }

  return deletedService;
};

export const DocumentFileServices = {
  createDocumentFileIntoDB,
  getAllDocumentFilesFromDB,
  getSingleDocumentFileFromDB,
  updateDocumentFileIntoDB,
  deleteDocumentFileFromDB,
  unShareDocumentFileIntoDB,
  shareDocumentFileIntoDB
};
