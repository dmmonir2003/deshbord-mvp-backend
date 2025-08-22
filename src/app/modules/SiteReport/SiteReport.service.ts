/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SITEREPORT_SEARCHABLE_FIELDS } from './SiteReport.constant';
import mongoose from 'mongoose';
import { TSiteReport } from './SiteReport.interface';
import { SiteReport } from './SiteReport.model';

const createSiteReportIntoDB = async (
  payload: TSiteReport,
  files: string[],
) => {

    if(files){
    payload.file = files; // Assuming file.location contains the S3 URL
  } 

  const result = await SiteReport.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SiteReport');
  }

  return result;
};

const getAllSiteReportsFromDB = async (query: Record<string, unknown>) => {
  const SiteReportQuery = new QueryBuilder(
    SiteReport.find(),
    query,
  )
    .search(SITEREPORT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SiteReportQuery.modelQuery;
  const meta = await SiteReportQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSiteReportFromDB = async (id: string) => {
  const result = await SiteReport.findById(id);

  return result;
};

const updateSiteReportIntoDB = async (id: string, payload: any, files?: any) => {

  if(files){
    payload.file = files; // Assuming file.location contains the S3 URL
  } 

  const isDeletedService = await mongoose.connection
    .collection('sitereports')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('SiteReport not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SiteReport');
  }

  const updatedData = await SiteReport.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SiteReport not found after update');
  }

  return updatedData;
};

const deleteSiteReportFromDB = async (id: string) => {
  const deletedService = await SiteReport.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SiteReport');
  }

  return deletedService;
};

export const SiteReportServices = {
  createSiteReportIntoDB,
  getAllSiteReportsFromDB,
  getSingleSiteReportFromDB,
  updateSiteReportIntoDB,
  deleteSiteReportFromDB,
};
