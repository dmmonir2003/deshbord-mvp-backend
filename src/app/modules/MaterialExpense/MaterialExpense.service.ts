/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { MATERIALEXPENSE_SEARCHABLE_FIELDS } from './MaterialExpense.constant';
import mongoose from 'mongoose';
import { TMaterialExpense } from './MaterialExpense.interface';
import { MaterialExpense } from './MaterialExpense.model';

const createMaterialExpenseIntoDB = async (
  payload: TMaterialExpense,
  file: any
) => {

  if (file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  }

  if (payload.unitPrice && payload.quantity) { 
    const baseAmount = payload.quantity * payload.unitPrice;
    const vatAmount = baseAmount * 0.2;

    payload.vat = vatAmount;
    payload.amount = baseAmount + vatAmount;
  }


  const result = await MaterialExpense.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create MaterialExpense');
  }

  return result;
};

const getAllMaterialExpensesFromDB = async (query: Record<string, unknown>) => {
  const MaterialExpenseQuery = new QueryBuilder(
    MaterialExpense.find(),
    query,
  )
    .search(MATERIALEXPENSE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await MaterialExpenseQuery.modelQuery;
  const meta = await MaterialExpenseQuery.countTotal();
  return {
    result,
    meta,
  };
};
const getAllMaterialCostsFromDB = async (query: Record<string, unknown>) => {

  // Ensure projectId is ObjectId
  if (query.projectId) {
    query.projectId = new mongoose.Types.ObjectId(query.projectId as string);
  }

    const totalData = await MaterialExpense.aggregate([
      { $match: query }, // filter same as main query
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
  
  
    return {
      totalAmount: totalData[0]?.totalAmount || 0,
    };
};

const getSingleMaterialExpenseFromDB = async (id: string) => {
  const result = await MaterialExpense.findById(id);

  return result;
};

const updateMaterialExpenseIntoDB = async (id: string, payload: any, file?: any) => {

if(file){
  payload.file = file.location; // Assuming file.location contains the S3 URL
}

  const isDeletedService = await mongoose.connection
    .collection('materialexpenses')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },

    );

  if (!isDeletedService) {
    throw new Error('MaterialExpense not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted MaterialExpense');
  }

  const updatedData = await MaterialExpense.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('MaterialExpense not found after update');
  }

  return updatedData;
};

const deleteMaterialExpenseFromDB = async (id: string) => {
  const deletedService = await MaterialExpense.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete MaterialExpense');
  }

  return deletedService;
};

export const MaterialExpenseServices = {
  createMaterialExpenseIntoDB,
  getAllMaterialExpensesFromDB,
  getSingleMaterialExpenseFromDB,
  updateMaterialExpenseIntoDB,
  deleteMaterialExpenseFromDB,
  getAllMaterialCostsFromDB
};
