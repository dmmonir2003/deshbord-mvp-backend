import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentTrackerServices } from './PaymentTracker.service';

const createPaymentTracker = catchAsync(async (req, res) => {
  const { PaymentTracker: PaymentTrackerData } = req.body;
  const result = await PaymentTrackerServices.createPaymentTrackerIntoDB(PaymentTrackerData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PaymentTracker is created successfully',
    data: result,
  });
});

const getSinglePaymentTracker = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentTrackerServices.getSinglePaymentTrackerFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PaymentTracker is retrieved successfully',
    data: result,
  });
});

const getAllPaymentTrackers = catchAsync(async (req, res) => {
  const result = await PaymentTrackerServices.getAllPaymentTrackersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PaymentTrackers are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllPaymentTrackerElements = catchAsync(async (req, res) => {
    // const { id } = req.params;
    // console.log('id', id);
  const result = await PaymentTrackerServices.getAllPaymentTrackerElementsFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PaymentTrackers are retrieved successfully',
    data: result,
  });
});

const updatePaymentTracker = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { PaymentTracker } = req.body;
  const result = await PaymentTrackerServices.updatePaymentTrackerIntoDB(id, PaymentTracker);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PaymentTracker is updated successfully',
    data: result,
  });
});

const deletePaymentTracker = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentTrackerServices.deletePaymentTrackerFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PaymentTracker is deleted successfully',
    data: result,
  });
});

export const PaymentTrackerControllers = {
  createPaymentTracker,
  getSinglePaymentTracker,
  getAllPaymentTrackers,
  updatePaymentTracker,
  deletePaymentTracker,
  getAllPaymentTrackerElements
};
