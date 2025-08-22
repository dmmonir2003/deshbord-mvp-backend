/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SITEPICTUREIMAGE_SEARCHABLE_FIELDS } from './SitePictureImage.constant';
import mongoose from 'mongoose';
import { TSitePictureImage } from './SitePictureImage.interface';
import { SitePictureImage } from './SitePictureImage.model';

const createSitePictureImageIntoDB = async (
  payload: TSitePictureImage,
  files: string[],
) => {


  if (files) {
    payload.file = files; // Assuming file.location contains the S3 URL
  }

  const result = await SitePictureImage.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SitePictureImage');
  }

  return result;
};

const getAllSitePictureImagesFromDB = async (query: Record<string, unknown>) => {
  const SitePictureImageQuery = new QueryBuilder(
    SitePictureImage.find(),
    query,
  )
    .search(SITEPICTUREIMAGE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SitePictureImageQuery.modelQuery;
  const meta = await SitePictureImageQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSitePictureImageFromDB = async (id: string) => {
  const result = await SitePictureImage.findById(id);

  return result;
};

const updateSitePictureImageIntoDB = async (id: string, payload: any, files?: any) => {
  const isDeletedService = await mongoose.connection
    .collection('sitepictureimages')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('SitePictureImage not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SitePictureImage');
  }


  if (files) {
    payload.file = files; // Assuming file.location contains the S3 URL
  }

  const updatedData = await SitePictureImage.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SitePictureImage not found after update');
  }

  return updatedData;
};

const deleteSitePictureImageFromDB = async (id: string) => {
  const deletedService = await SitePictureImage.findByIdAndDelete(
    id,
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SitePictureImage');
  }

  return deletedService;
};

export const SitePictureImageServices = {
  createSitePictureImageIntoDB,
  getAllSitePictureImagesFromDB,
  getSingleSitePictureImageFromDB,
  updateSitePictureImageIntoDB,
  deleteSitePictureImageFromDB,
};
