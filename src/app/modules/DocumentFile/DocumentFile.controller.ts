import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DocumentFileServices } from './DocumentFile.service';

const createDocumentFile = catchAsync(async (req, res) => {
  const DocumentFileData = req.body;
  const result = await DocumentFileServices.createDocumentFileIntoDB(DocumentFileData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentFile is created successfully',
    data: result,
  });
});


const shareDocumentFile = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await DocumentFileServices.shareDocumentFileIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareDocumentFile = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await DocumentFileServices.unShareDocumentFileIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});



const getSingleDocumentFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DocumentFileServices.getSingleDocumentFileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentFile is retrieved successfully',
    data: result,
  });
});

const getAllDocumentFiles = catchAsync(async (req, res) => {
  const result = await DocumentFileServices.getAllDocumentFilesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentFiles are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateDocumentFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const DocumentFile = req.body;
  const result = await DocumentFileServices.updateDocumentFileIntoDB(id, DocumentFile, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentFile is updated successfully',
    data: result,
  });
});

const deleteDocumentFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DocumentFileServices.deleteDocumentFileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DocumentFile is deleted successfully',
    data: result,
  });
});

export const DocumentFileControllers = {
  createDocumentFile,
  getSingleDocumentFile,
  getAllDocumentFiles,
  updateDocumentFile,
  deleteDocumentFile,
  shareDocumentFile,
  unShareDocumentFile
};
