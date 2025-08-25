import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SecondFixSubFolderServices } from './SecondFixSubFolder.service';

const createSecondFixSubFolder = catchAsync(async (req, res) => {
  const SecondFixSubFolderData = req.body;
  const result = await SecondFixSubFolderServices.createSecondFixSubFolderIntoDB(SecondFixSubFolderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixSubFolder is created successfully',
    data: result,
  });
});

const getSingleSecondFixSubFolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SecondFixSubFolderServices.getSingleSecondFixSubFolderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixSubFolder is retrieved successfully',
    data: result,
  });
});

const getAllSecondFixSubFolders = catchAsync(async (req, res) => {
  const result = await SecondFixSubFolderServices.getAllSecondFixSubFoldersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixSubFolders are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSecondFixSubFolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const SecondFixSubFolder = req.body;
  const result = await SecondFixSubFolderServices.updateSecondFixSubFolderIntoDB(id, SecondFixSubFolder);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixSubFolder is updated successfully',
    data: result,
  });
});

const deleteSecondFixSubFolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SecondFixSubFolderServices.deleteSecondFixSubFolderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SecondFixSubFolder is deleted successfully',
    data: result,
  });
});

export const SecondFixSubFolderControllers = {
  createSecondFixSubFolder,
  getSingleSecondFixSubFolder,
  getAllSecondFixSubFolders,
  updateSecondFixSubFolder,
  deleteSecondFixSubFolder,
};
