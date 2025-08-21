import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DocumentServices } from './Document.service';

const createDocument = catchAsync(async (req, res) => {
  const DocumentData = req.body;
  console.log('DocumentData', DocumentData);
  const result = await DocumentServices.createDocumentIntoDB(DocumentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document is created successfully',
    data: result,
  });
});

const getSingleDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DocumentServices.getSingleDocumentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document is retrieved successfully',
    data: result,
  });
});

const getAllDocuments = catchAsync(async (req, res) => {
  const result = await DocumentServices.getAllDocumentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Documents are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Document = req.body;
  const result = await DocumentServices.updateDocumentIntoDB(id, Document);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document is updated successfully',
    data: result,
  });
});

const deleteDocument = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DocumentServices.deleteDocumentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document is deleted successfully',
    data: result,
  });
});

export const DocumentControllers = {
  createDocument,
  getSingleDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
};
