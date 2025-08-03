/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { QUOTE_SEARCHABLE_FIELDS } from './Quote.constant';
import mongoose from 'mongoose';
import { TQuote } from './Quote.interface';
import { Quote } from './Quote.model';

const createQuoteIntoDB = async (
  payload: TQuote,
  quoteFile: any,
) => {

  if(quoteFile){
    payload.file = quoteFile.location as string;
  }

  const result = await Quote.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Quote');
  }

  return result;
};

const getAllQuotesFromDB = async (query: Record<string, unknown>) => {
  const QuoteQuery = new QueryBuilder(
    Quote.find(),
    query,
  )
    .search(QUOTE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await QuoteQuery.modelQuery;
  const meta = await QuoteQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleQuoteFromDB = async (id: string) => {
  const result = await Quote.findById(id);

  return result;
};

const updateQuoteIntoDB = async (id: string, payload: any, files?: any) => {

  if(files){
    payload.file = files.location as string;
  }

  const isDeletedService = await mongoose.connection
    .collection('quotes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      // { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService) {
    throw new Error('Quote not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Quote');
  }

  const updatedData = await Quote.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Quote not found after update');
  }

  return updatedData;
};

const deleteQuoteFromDB = async (id: string) => {
  const deletedService = await Quote.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Quote');
  }

  return deletedService;
};

export const QuoteServices = {
  createQuoteIntoDB,
  getAllQuotesFromDB,
  getSingleQuoteFromDB,
  updateQuoteIntoDB,
  deleteQuoteFromDB,
};
