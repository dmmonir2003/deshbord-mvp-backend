/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { DOCUMENT_SEARCHABLE_FIELDS } from './Document.constant';
import mongoose from 'mongoose';
import { TDocument } from './Document.interface';
import { Document } from './Document.model';

const createDocumentIntoDB = async (
  payload: TDocument,
) => {

  const result = await Document.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Document');
  }

  return result;
};

const getAllDocumentsFromDB = async (query: Record<string, unknown>) => {
  const DocumentQuery = new QueryBuilder(
    Document.find(),
    query,
  )
    .search(DOCUMENT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await DocumentQuery.modelQuery;
  const meta = await DocumentQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleDocumentFromDB = async (id: string) => {
  const result = await Document.findById(id);

  return result;
};

const updateDocumentIntoDB = async (id: string, payload: any) => {


  const isDeletedService = await mongoose.connection
    .collection('documents')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      // { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService) {
    throw new Error('Document not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Document');
  }

  const updatedData = await Document.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Document not found after update');
  }

 console.log('updatedData',updatedData);

  return updatedData;
};

const deleteDocumentFromDB = async (id: string) => {
  const deletedService = await Document.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Document');
  }

  return deletedService;
};

export const DocumentServices = {
  createDocumentIntoDB,
  getAllDocumentsFromDB,
  getSingleDocumentFromDB,
  updateDocumentIntoDB,
  deleteDocumentFromDB,
};
