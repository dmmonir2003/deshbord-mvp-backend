import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SecondFixFileServices } from './SecondFixFile.service';

const createSecondFixFile = catchAsync(async (req, res) => {
  const { SecondFixFile: SecondFixFileData } = req.body;
  const result = await SecondFixFileServices.createSecondFixFileIntoDB(SecondFixFileData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFile is created successfully',
    data: result,
  });
});

const getSingleSecondFixFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SecondFixFileServices.getSingleSecondFixFileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFile is retrieved successfully',
    data: result,
  });
});

const getAllSecondFixFiles = catchAsync(async (req, res) => {
  const result = await SecondFixFileServices.getAllSecondFixFilesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFiles are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSecondFixFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { SecondFixFile } = req.body;
  const result = await SecondFixFileServices.updateSecondFixFileIntoDB(id, SecondFixFile);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFile is updated successfully',
    data: result,
  });
});

const deleteSecondFixFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SecondFixFileServices.deleteSecondFixFileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFile is deleted successfully',
    data: result,
  });
});

export const SecondFixFileControllers = {
  createSecondFixFile,
  getSingleSecondFixFile,
  getAllSecondFixFiles,
  updateSecondFixFile,
  deleteSecondFixFile,
};
