import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SecondFixFolderServices } from './SecondFixFolder.service';

const createSecondFixFolder = catchAsync(async (req, res) => {
  const SecondFixFolderData = req.body;
  const result = await SecondFixFolderServices.createSecondFixFolderIntoDB(SecondFixFolderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFolder is created successfully',
    data: result,
  });
});

const getSingleSecondFixFolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SecondFixFolderServices.getSingleSecondFixFolderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFolder is retrieved successfully',
    data: result,
  });
});

const getAllSecondFixFolders = catchAsync(async (req, res) => {
  const result = await SecondFixFolderServices.getAllSecondFixFoldersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFolders are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSecondFixFolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const SecondFixFolder = req.body;
  const result = await SecondFixFolderServices.updateSecondFixFolderIntoDB(id, SecondFixFolder);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFolder is updated successfully',
    data: result,
  });
});

const deleteSecondFixFolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SecondFixFolderServices.deleteSecondFixFolderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixFolder is deleted successfully',
    data: result,
  });
});

export const SecondFixFolderControllers = {
  createSecondFixFolder,
  getSingleSecondFixFolder,
  getAllSecondFixFolders,
  updateSecondFixFolder,
  deleteSecondFixFolder,
};
