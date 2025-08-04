import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LabourServices } from './Labour.service';

const createLabour = catchAsync(async (req, res) => {
  const LabourData = req.body;
  const result = await LabourServices.createLabourIntoDB(LabourData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Labour is created successfully',
    data: result,
  });
});

const getSingleLabour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LabourServices.getSingleLabourFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Labour is retrieved successfully',
    data: result,
  });
});

const getAllLabours = catchAsync(async (req, res) => {
  const result = await LabourServices.getAllLaboursFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Labours are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateLabour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Labour = req.body;
  const result = await LabourServices.updateLabourIntoDB(id, Labour, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Labour is updated successfully',
    data: result,
  });
});

const deleteLabour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LabourServices.deleteLabourFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Labour is deleted successfully',
    data: result,
  });
});

export const LabourControllers = {
  createLabour,
  getSingleLabour,
  getAllLabours,
  updateLabour,
  deleteLabour,
};
