/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { HANDOVER_SEARCHABLE_FIELDS } from './Handover.constant';
import mongoose, { Types } from 'mongoose';
import { THandover } from './Handover.interface';
import { Handover } from './Handover.model';
import { User } from '../User/user.model';

const createHandoverIntoDB = async (
  payload: THandover,
  file?:any
) => {

  if(file){
    payload.file = file.location;
  }

  const result = await Handover.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Handover');
  }

  return result;
};


const shareHandoverFileIntoDB = async (
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

  const project = await Handover.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('DocumentFile not found or update failed');
  }

  return project;
};
const unShareHandoverFileIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await Handover.findByIdAndUpdate(
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



const getAllHandoversFromDB = async (query: Record<string, unknown>) => {
  const HandoverQuery = new QueryBuilder(
    Handover.find(),
    query,
  )
    .search(HANDOVER_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HandoverQuery.modelQuery;
  const meta = await HandoverQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleHandoverFromDB = async (id: string) => {
  const result = await Handover.findById(id);

  return result;
};

const updateHandoverIntoDB = async (id: string, payload: any, file?:any) => {

    if(file){
    payload.file = file.location;
  }

  const isDeletedService = await mongoose.connection
    .collection('handovers')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
 
    );

  if (!isDeletedService) {
    throw new Error('Handover not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Handover');
  }

  const updatedData = await Handover.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Handover not found after update');
  }

  return updatedData;
};

const deleteHandoverFromDB = async (id: string) => {
  const deletedService = await Handover.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Handover');
  }

  return deletedService;
};

export const HandoverServices = {
  createHandoverIntoDB,
  getAllHandoversFromDB,
  getSingleHandoverFromDB,
  updateHandoverIntoDB,
  deleteHandoverFromDB,
  shareHandoverFileIntoDB, 
  unShareHandoverFileIntoDB
};
