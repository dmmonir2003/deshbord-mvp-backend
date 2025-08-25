import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HandoverServices } from './Handover.service';

const createHandover = catchAsync(async (req, res) => {
  const HandoverData = req.body;
  const result = await HandoverServices.createHandoverIntoDB(HandoverData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Handover is created successfully',
    data: result,
  });
});

const shareHandoverFile = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await HandoverServices.shareHandoverFileIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareHandoverFile = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await HandoverServices.unShareHandoverFileIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleHandover = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HandoverServices.getSingleHandoverFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Handover is retrieved successfully',
    data: result,
  });
});

const getAllHandovers = catchAsync(async (req, res) => {
  const result = await HandoverServices.getAllHandoversFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Handovers are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateHandover = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Handover = req.body;
  const result = await HandoverServices.updateHandoverIntoDB(id, Handover, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Handover is updated successfully',
    data: result,
  });
});

const deleteHandover = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HandoverServices.deleteHandoverFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Handover is deleted successfully',
    data: result,
  });
});

export const HandoverControllers = {
  createHandover,
  getSingleHandover,
  getAllHandovers,
  updateHandover,
  deleteHandover,
  shareHandoverFile,
  unShareHandoverFile
};
