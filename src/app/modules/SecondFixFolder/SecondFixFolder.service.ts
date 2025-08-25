/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SECONDFIXFOLDER_SEARCHABLE_FIELDS } from './SecondFixFolder.constant';
import mongoose from 'mongoose';
import { TSecondFixFolder } from './SecondFixFolder.interface';
import { SecondFixFolder } from './SecondFixFolder.model';

const createSecondFixFolderIntoDB = async (
  payload: TSecondFixFolder,
) => {
  const result = await SecondFixFolder.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SecondFixFolder');
  }

  return result;
};

const getAllSecondFixFoldersFromDB = async (query: Record<string, unknown>) => {
  const SecondFixFolderQuery = new QueryBuilder(
    SecondFixFolder.find(),
    query,
  )
    .search(SECONDFIXFOLDER_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SecondFixFolderQuery.modelQuery;
  const meta = await SecondFixFolderQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSecondFixFolderFromDB = async (id: string) => {
  const result = await SecondFixFolder.findById(id);

  return result;
};

const updateSecondFixFolderIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('secondfixfolders')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('SecondFixFolder not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SecondFixFolder');
  }

  const updatedData = await SecondFixFolder.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SecondFixFolder not found after update');
  }

  return updatedData;
};

const deleteSecondFixFolderFromDB = async (id: string) => {
  const deletedService = await SecondFixFolder.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SecondFixFolder');
  }

  return deletedService;
};

export const SecondFixFolderServices = {
  createSecondFixFolderIntoDB,
  getAllSecondFixFoldersFromDB,
  getSingleSecondFixFolderFromDB,
  updateSecondFixFolderIntoDB,
  deleteSecondFixFolderFromDB,
};
