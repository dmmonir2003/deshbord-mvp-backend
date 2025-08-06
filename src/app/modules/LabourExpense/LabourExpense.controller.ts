import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LabourExpenseServices } from './LabourExpense.service';

const createLabourExpense = catchAsync(async (req, res) => {
  const LabourExpenseData = req.body;
  const result = await LabourExpenseServices.createLabourExpenseIntoDB(LabourExpenseData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LabourExpense is created successfully',
    data: result,
  });
});

const getSingleLabourExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LabourExpenseServices.getSingleLabourExpenseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LabourExpense is retrieved successfully',
    data: result,
  });
});

const getAllLabourExpenses = catchAsync(async (req, res) => {
  const result = await LabourExpenseServices.getAllLabourExpensesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LabourExpenses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateLabourExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const LabourExpense = req.body;
  const result = await LabourExpenseServices.updateLabourExpenseIntoDB(id, LabourExpense, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LabourExpense is updated successfully',
    data: result,
  });
});

const deleteLabourExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LabourExpenseServices.deleteLabourExpenseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LabourExpense is deleted successfully',
    data: result,
  });
});

export const LabourExpenseControllers = {
  createLabourExpense,
  getSingleLabourExpense,
  getAllLabourExpenses,
  updateLabourExpense,
  deleteLabourExpense,
};
