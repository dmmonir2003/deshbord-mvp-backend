import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SitePictureImageServices } from './SitePictureImage.service';
import {  Express } from 'express';

const createSitePictureImage = catchAsync(async (req, res) => {
  const fileUrls = (req.files as Express.MulterS3.File[]).map(f => f.location); 
  const SitePictureImageData= req.body;
  const result = await SitePictureImageServices.createSitePictureImageIntoDB(SitePictureImageData, fileUrls);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePictureImage is created successfully',
    data: result,
  });
});

const getSingleSitePictureImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SitePictureImageServices.getSingleSitePictureImageFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePictureImage is retrieved successfully',
    data: result,
  });
});

const getAllSitePictureImages = catchAsync(async (req, res) => {
  const result = await SitePictureImageServices.getAllSitePictureImagesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePictureImages are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSitePictureImage = catchAsync(async (req, res) => {
    const fileUrls = (req.files as Express.MulterS3.File[]).map(f => f.location); 
  const { id } = req.params;
  const SitePictureImage = req.body;
console.log("SitePictureImage",SitePictureImage)

  const result = await SitePictureImageServices.updateSitePictureImageIntoDB(id, SitePictureImage, fileUrls);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePictureImage is updated successfully',
    data: result,
  });
});

const deleteSitePictureImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SitePictureImageServices.deleteSitePictureImageFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SitePictureImage is deleted successfully',
    data: result,
  });
});

export const SitePictureImageControllers = {
  createSitePictureImage,
  getSingleSitePictureImage,
  getAllSitePictureImages,
  updateSitePictureImage,
  deleteSitePictureImage,
};
