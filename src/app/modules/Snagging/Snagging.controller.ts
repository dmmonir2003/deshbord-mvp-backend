import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SnaggingServices } from './Snagging.service';
import {  Express } from 'express';
const createSnagging = catchAsync(async (req, res) => {

  const files = req.files as {
  [fieldname: string]: Express.MulterS3.File[];
};

  const SnaggingData = req.body;
  const result = await SnaggingServices.createSnaggingIntoDB(SnaggingData, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Snagging is created successfully',
    data: result,
  });
});
const shareSnagging = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await SnaggingServices.shareSnaggingIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareSnagging = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await SnaggingServices.unShareSnaggingIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});

const getSingleSnagging = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SnaggingServices.getSingleSnaggingFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Snagging is retrieved successfully',
    data: result,
  });
});

const getAllSnaggings = catchAsync(async (req, res) => {
  const result = await SnaggingServices.getAllSnaggingsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Snaggings are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSnagging = catchAsync(async (req, res) => {

    const files = req.files as {
  [fieldname: string]: Express.MulterS3.File[];
};
  const { id } = req.params;
  const Snagging = req.body;
  const result = await SnaggingServices.updateSnaggingIntoDB(id, Snagging, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Snagging is updated successfully',
    data: result,
  });
});

const deleteSnagging = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SnaggingServices.deleteSnaggingFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Snagging is deleted successfully',
    data: result,
  });
});

export const SnaggingControllers = {
  createSnagging,
  getSingleSnagging,
  getAllSnaggings,
  updateSnagging,
  deleteSnagging,
  shareSnagging,
  unShareSnagging
};
