/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DOCUMENTSUBFOLDER_SEARCHABLE_FIELDS } from './DocumentSubfolder.constant';
import mongoose from 'mongoose';
import { TDocumentSubfolder } from './DocumentSubfolder.interface';
import { DocumentSubfolder } from './DocumentSubfolder.model';

const createDocumentSubfolderIntoDB = async (
  payload: TDocumentSubfolder,
) => {

  console.log('payload', payload);

  const result = await DocumentSubfolder.create(payload);
   console.log('result', result);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create DocumentSubfolder');
  }

  return result;
};

const getAllDocumentSubfoldersFromDB = async (query: Record<string, unknown>) => {
  const DocumentSubfolderQuery = new QueryBuilder(
    DocumentSubfolder.find(),
    query,
  )
    .search(DOCUMENTSUBFOLDER_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DocumentSubfolderQuery.modelQuery;
  const meta = await DocumentSubfolderQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleDocumentSubfolderFromDB = async (id: string) => {
  const result = await DocumentSubfolder.findById(id);

  return result;
};

const updateDocumentSubfolderIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('documentsubfolders')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('DocumentSubfolder not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted DocumentSubfolder');
  }

  const updatedData = await DocumentSubfolder.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('DocumentSubfolder not found after update');
  }

  return updatedData;
};

const deleteDocumentSubfolderFromDB = async (id: string) => {
  const deletedService = await DocumentSubfolder.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete DocumentSubfolder');
  }

  return deletedService;
};

export const DocumentSubfolderServices = {
  createDocumentSubfolderIntoDB,
  getAllDocumentSubfoldersFromDB,
  getSingleDocumentSubfolderFromDB,
  updateDocumentSubfolderIntoDB,
  deleteDocumentSubfolderFromDB,
};
