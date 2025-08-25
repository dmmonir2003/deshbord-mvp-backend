/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SecondFixFileSearchableFields } from './SecondFixFile.constant';
import mongoose from 'mongoose';
import { TSecondFixFile } from './SecondFixFile.interface';
import { SecondFixFile } from './SecondFixFile.model';

const createSecondFixFileIntoDB = async (
  payload: TSecondFixFile,
) => {
  const result = await SecondFixFile.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SecondFixFile');
  }

  return result;
};

const getAllSecondFixFilesFromDB = async (query: Record<string, unknown>) => {
  const SecondFixFileQuery = new QueryBuilder(
    SecondFixFile.find(),
    query,
  )
    .search(SecondFixFileSearchableFields)
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
  const result = await SecondFixFile.findById(id);

  return result;
};

const updateSecondFixFileIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('secondfixfiles')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
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
  const deletedService = await SecondFixFile.findByIdAndUpdate(
    id,
    { isDeleted: true },
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
};
