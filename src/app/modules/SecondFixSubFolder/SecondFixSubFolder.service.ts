/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SECONDFIXSUBFOLDER_SEARCHABLE_FIELDS } from './SecondFixSubFolder.constant';
import mongoose from 'mongoose';
import { TSecondFixSubFolder } from './SecondFixSubFolder.interface';
import { SecondFixSubFolder } from './SecondFixSubFolder.model';

const createSecondFixSubFolderIntoDB = async (
  payload: TSecondFixSubFolder,
) => {
  const result = await SecondFixSubFolder.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SecondFixSubFolder');
  }

  return result;
};

const getAllSecondFixSubFoldersFromDB = async (query: Record<string, unknown>) => {
  const SecondFixSubFolderQuery = new QueryBuilder(
    SecondFixSubFolder.find(),
    query,
  )
    .search(SECONDFIXSUBFOLDER_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SecondFixSubFolderQuery.modelQuery;
  const meta = await SecondFixSubFolderQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSecondFixSubFolderFromDB = async (id: string) => {
  const result = await SecondFixSubFolder.findById(id);

  return result;
};

const updateSecondFixSubFolderIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('secondfixsubfolders')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },

    );

  if (!isDeletedService) {
    throw new Error('SecondFixSubFolder not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SecondFixSubFolder');
  }

  const updatedData = await SecondFixSubFolder.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SecondFixSubFolder not found after update');
  }

  return updatedData;
};

const deleteSecondFixSubFolderFromDB = async (id: string) => {
  const deletedService = await SecondFixSubFolder.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SecondFixSubFolder');
  }

  return deletedService;
};

export const SecondFixSubFolderServices = {
  createSecondFixSubFolderIntoDB,
  getAllSecondFixSubFoldersFromDB,
  getSingleSecondFixSubFolderFromDB,
  updateSecondFixSubFolderIntoDB,
  deleteSecondFixSubFolderFromDB,
};
