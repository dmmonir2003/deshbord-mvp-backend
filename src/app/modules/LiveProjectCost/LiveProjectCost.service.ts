/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { LIVEPROJECTCOST_SEARCHABLE_FIELDS } from './LiveProjectCost.constant';
import mongoose from 'mongoose';
import { TLiveProjectCost } from './LiveProjectCost.interface';
import { LiveProjectCost } from './LiveProjectCost.model';
import { LabourExpenseServices } from '../LabourExpense/LabourExpense.service';
import { MaterialExpenseServices } from '../MaterialExpense/MaterialExpense.service';
import { SubContractorServices } from '../SubContractorExpense/SubContractor.service';

const createLiveProjectCostIntoDB = async (
  payload: TLiveProjectCost,
) => {
  const result = await LiveProjectCost.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create LiveProjectCost');
  }

  return result;
};

const getAllLiveProjectCostsFromDB = async (query: Record<string, unknown>) => {
  const LiveProjectCostQuery = new QueryBuilder(
    LiveProjectCost.find(),
    query,
  )
    .search(LIVEPROJECTCOST_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await LiveProjectCostQuery.modelQuery;
  const meta = await LiveProjectCostQuery.countTotal();
  return {
    result,
    meta,
  };
};
const getAllTypeLiveProjectCostsFromDB = async (query: Record<string, unknown>) => {

  const labourCost = await LabourExpenseServices.getAllLabourCostsFromDB(query);
 const materialCost = await MaterialExpenseServices.getAllMaterialCostsFromDB(query);
 const subContractorCost = await SubContractorServices.getAllSubContractorCostsFromDB(query);
 
 console.log(labourCost, 'labourCost');
 console.log(materialCost, 'materialCost');
 console.log(subContractorCost, 'subContractorCost');

 const totalProjectCost = labourCost.totalAmount + materialCost.totalAmount + subContractorCost.totalAmount;

  const result = [
    {
      name: 'Labour',
      amount: labourCost.totalAmount,
    },
    {
      name: 'Material',
      amount: materialCost.totalAmount,
    },
    {
      name: 'SubContractor',
      amount: subContractorCost.totalAmount,
    },
    {
      name: 'Total',
      amount: totalProjectCost,
    },
  ];

  return {
    result,
  };
};

const getSingleLiveProjectCostFromDB = async (id: string) => {
  const result = await LiveProjectCost.findById(id);

  return result;
};

const updateLiveProjectCostIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('liveprojectcosts')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('LiveProjectCost not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted LiveProjectCost');
  }

  const updatedData = await LiveProjectCost.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('LiveProjectCost not found after update');
  }

  return updatedData;
};

const deleteLiveProjectCostFromDB = async (id: string) => {
  const deletedService = await LiveProjectCost.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete LiveProjectCost');
  }

  return deletedService;
};

export const LiveProjectCostServices = {
  createLiveProjectCostIntoDB,
  getAllLiveProjectCostsFromDB,
  getAllTypeLiveProjectCostsFromDB,
  getSingleLiveProjectCostFromDB,
  updateLiveProjectCostIntoDB,
  deleteLiveProjectCostFromDB,
};
