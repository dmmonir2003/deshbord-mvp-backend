/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { LABOUREXPENSE_SEARCHABLE_FIELDS } from './LabourExpense.constant';
import mongoose from 'mongoose';
import { TLabourExpense } from './LabourExpense.interface';
import { LabourExpense } from './LabourExpense.model';
import { Labour } from '../Labour/Labour.model';

const createLabourExpenseIntoDB = async (
  payload: TLabourExpense,
  file?: any
) => {

 if(file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  }

  const labour = await Labour.findById(payload.labourId);
  
  if (!labour) {
    throw new AppError(httpStatus.NOT_FOUND, 'Labour not found');
  }

payload.amount = payload.days * labour?.dayRate;

  const result = await LabourExpense.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create LabourExpense');
  }

  return result;
};

const getAllLabourExpensesFromDB = async (query: Record<string, unknown>) => {
  const LabourExpenseQuery = new QueryBuilder(
    LabourExpense.find(),
    query,
  )
    .search(LABOUREXPENSE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await LabourExpenseQuery.modelQuery;
  const meta = await LabourExpenseQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleLabourExpenseFromDB = async (id: string) => {
  const result = await LabourExpense.findById(id);

  return result;
};

const updateLabourExpenseIntoDB = async (id: string, payload: any, file?: any) => {

 if(file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  }


  const isDeletedService = await mongoose.connection
    .collection('labourexpenses')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('LabourExpense not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted LabourExpense');
  }

  const updatedData = await LabourExpense.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('LabourExpense not found after update');
  }

  return updatedData;
};

const deleteLabourExpenseFromDB = async (id: string) => {
  const deletedService = await LabourExpense.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete LabourExpense');
  }

  return deletedService;
};

export const LabourExpenseServices = {
  createLabourExpenseIntoDB,
  getAllLabourExpensesFromDB,
  getSingleLabourExpenseFromDB,
  updateLabourExpenseIntoDB,
  deleteLabourExpenseFromDB,
};
