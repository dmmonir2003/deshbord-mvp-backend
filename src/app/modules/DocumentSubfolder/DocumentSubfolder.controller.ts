import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DocumentSubfolderServices } from './DocumentSubfolder.service';

const createDocumentSubfolder = catchAsync(async (req, res) => {
  const { DocumentSubfolder: DocumentSubfolderData } = req.body;
  const result = await DocumentSubfolderServices.createDocumentSubfolderIntoDB(DocumentSubfolderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentSubfolder is created successfully',
    data: result,
  });
});

const getSingleDocumentSubfolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DocumentSubfolderServices.getSingleDocumentSubfolderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentSubfolder is retrieved successfully',
    data: result,
  });
});

const getAllDocumentSubfolders = catchAsync(async (req, res) => {
  const result = await DocumentSubfolderServices.getAllDocumentSubfoldersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentSubfolders are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateDocumentSubfolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { DocumentSubfolder } = req.body;
  const result = await DocumentSubfolderServices.updateDocumentSubfolderIntoDB(id, DocumentSubfolder);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentSubfolder is updated successfully',
    data: result,
  });
});

const deleteDocumentSubfolder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DocumentSubfolderServices.deleteDocumentSubfolderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentSubfolder is deleted successfully',
    data: result,
  });
});

export const DocumentSubfolderControllers = {
  createDocumentSubfolder,
  getSingleDocumentSubfolder,
  getAllDocumentSubfolders,
  updateDocumentSubfolder,
  deleteDocumentSubfolder,
};
