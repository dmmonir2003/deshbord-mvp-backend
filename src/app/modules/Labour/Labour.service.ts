/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { LABOUR_SEARCHABLE_FIELDS } from './Labour.constant';
import mongoose from 'mongoose';
import { TLabour } from './Labour.interface';
import { Labour } from './Labour.model';
import { NotificationServices } from '../Notification/Notification.service';

const createLabourIntoDB = async (
  payload: TLabour,
  file?: any
) => {

  if(file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  }

  const result = await Labour.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Labour');
  }

 
    const ndata = {
    title: 'Labour Creation',
    message: "A Labour created",
    // projectId:payload?.projectId,
    readBy: []
  }

  const createdData = await NotificationServices.createNotificationIntoDB(ndata)
  
  if(!createdData) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Labour');
  return result;
};

const getAllLaboursFromDB = async (query: Record<string, unknown>) => {
  const LabourQuery = new QueryBuilder(
    Labour.find(),
    query,
  )
    .search(LABOUR_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await LabourQuery.modelQuery;
  const meta = await LabourQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleLabourFromDB = async (id: string) => {
  const result = await Labour.findById(id);

  return result;
};

const updateLabourIntoDB = async (id: string, payload: any, file?: any) => {


  if (file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  } 

  const isDeletedService = await mongoose.connection
    .collection('labour')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('Labour not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Labour');
  }

  const updatedData = await Labour.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Labour not found after update');
  }

  return updatedData;
};

const deleteLabourFromDB = async (id: string) => {
  const deletedService = await Labour.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Labour');
  }

  return deletedService;
};

export const LabourServices = {
  createLabourIntoDB,
  getAllLaboursFromDB,
  getSingleLabourFromDB,
  updateLabourIntoDB,
  deleteLabourFromDB,
};
