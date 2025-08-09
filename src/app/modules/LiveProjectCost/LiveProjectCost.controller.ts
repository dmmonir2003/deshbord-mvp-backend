import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LiveProjectCostServices } from './LiveProjectCost.service';

const createLiveProjectCost = catchAsync(async (req, res) => {
  const { LiveProjectCost: LiveProjectCostData } = req.body;
  const result = await LiveProjectCostServices.createLiveProjectCostIntoDB(LiveProjectCostData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveProjectCost is created successfully',
    data: result,
  });
});

const getSingleLiveProjectCost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LiveProjectCostServices.getSingleLiveProjectCostFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveProjectCost is retrieved successfully',
    data: result,
  });
});

const getAllLiveProjectCosts = catchAsync(async (req, res) => {
  const result = await LiveProjectCostServices.getAllLiveProjectCostsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveProjectCosts are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllTypeLiveProjectCosts = catchAsync(async (req, res) => {
  const result = await LiveProjectCostServices.getAllTypeLiveProjectCostsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveProjectCosts are retrieved successfully',
    data: result.result,
  });
});

const updateLiveProjectCost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { LiveProjectCost } = req.body;
  const result = await LiveProjectCostServices.updateLiveProjectCostIntoDB(id, LiveProjectCost);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveProjectCost is updated successfully',
    data: result,
  });
});

const deleteLiveProjectCost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LiveProjectCostServices.deleteLiveProjectCostFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveProjectCost is deleted successfully',
    data: result,
  });
});

export const LiveProjectCostControllers = {
  createLiveProjectCost,
  getSingleLiveProjectCost,
  getAllLiveProjectCosts,
  updateLiveProjectCost,
  deleteLiveProjectCost,
  getAllTypeLiveProjectCosts
};
