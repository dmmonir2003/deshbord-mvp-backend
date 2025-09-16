/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SUBCONTRACTOR_SEARCHABLE_FIELDS } from './SubContractor.constant';
import mongoose from 'mongoose';
import { TSubContractor } from './SubContractor.interface';
import { SubContractor } from './SubContractor.model';

const createSubContractorIntoDB = async (
  payload: TSubContractor,
  file?: any
) => {

  if (file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  }

if (payload.days && payload.ratePerDay) {
  const base = payload.days * payload.ratePerDay;
  payload.vat = base * 0.2;
  payload.amount = base + payload.vat;
}

  const result = await SubContractor.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SubContractor');
  }

  return result;
};

const getAllSubContractorsFromDB = async (query: Record<string, unknown>) => {
  const SubContractorQuery = new QueryBuilder(
    SubContractor.find(),
    query,
  )
    .search(SUBCONTRACTOR_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SubContractorQuery.modelQuery;
  const meta = await SubContractorQuery.countTotal();
  return {
    result,
    meta,
  };
};
// const getAllSubContractorCostsFromDB = async (query: Record<string, unknown>) => {
//   const SubContractorQuery = new QueryBuilder(
//     SubContractor.find(),
//     query,
//   )
//     .search(SUBCONTRACTOR_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await SubContractorQuery.modelQuery;
//   const meta = await SubContractorQuery.countTotal();


//   console.log(result, 'result');

//   return {
//     result,
//     meta,
//   };
// };
const getAllSubContractorCostsFromDB = async (query: Record<string, unknown>) => {
  // const SubContractorQuery = new QueryBuilder(
  //   SubContractor.find(),
  //   query,
  // )
  //   .search(SUBCONTRACTOR_SEARCHABLE_FIELDS)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .fields();

  // const result = await SubContractorQuery.modelQuery;
  // const meta = await SubContractorQuery.countTotal();

  // Ensure projectId is ObjectId
  if (query.projectId) {
    query.projectId = new mongoose.Types.ObjectId(query.projectId as string);
  }

  // Aggregation to get total amount from ALL matching documents
  const totalData = await SubContractor.aggregate([
    { $match: query }, // filter same as main query
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
  ]);


  return {
    // result,
    // meta,
    totalAmount: totalData[0]?.totalAmount || 0,
  };
};
// const getAllSubContractorCostsFromDB = async (query: Record<string, unknown>) => {
//   const SubContractorQuery = new QueryBuilder(
//     SubContractor.find(),
//     query,
//   )
//     .search(SUBCONTRACTOR_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await SubContractorQuery.modelQuery;
//   const meta = await SubContractorQuery.countTotal();

//   // Calculate total amount from all results
//   const totalAmount = result.reduce((sum, item) => sum + (item.amount || 0), 0);

// console.log(totalAmount, 'totalAmount');

//   return {
//     result,
//     meta,
//     totalAmount, // <-- total cost here
//   };
// };

const getSingleSubContractorFromDB = async (id: string) => {
  const result = await SubContractor.findById(id);

  return result;
};

const updateSubContractorIntoDB = async (id: string, payload: any, file?: any) => {

if(file) {
    payload.file = file.location; // Assuming file.location contains the S3 URL
  }

  const isDeletedService = await mongoose.connection
    .collection('SubContractorExpense')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );

  if (!isDeletedService) {
    throw new Error('SubContractor not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SubContractor');
  }

  const updatedData = await SubContractor.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SubContractor not found after update');
  }

  return updatedData;
};

const deleteSubContractorFromDB = async (id: string) => {
  const deletedService = await SubContractor.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SubContractor');
  }

  return deletedService;
};

export const SubContractorServices = {
  createSubContractorIntoDB,
  getAllSubContractorsFromDB,
  getSingleSubContractorFromDB,
  updateSubContractorIntoDB,
  deleteSubContractorFromDB,
  getAllSubContractorCostsFromDB
};
