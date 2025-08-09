import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MaterialExpenseServices } from './MaterialExpense.service';

const createMaterialExpense = catchAsync(async (req, res) => {
  const MaterialExpenseData = req.body;
  const result = await MaterialExpenseServices.createMaterialExpenseIntoDB(MaterialExpenseData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'MaterialExpense is created successfully',
    data: result,
  });
});

const getSingleMaterialExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MaterialExpenseServices.getSingleMaterialExpenseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'MaterialExpense is retrieved successfully',
    data: result,
  });
});

const getAllMaterialExpenses = catchAsync(async (req, res) => {
  const result = await MaterialExpenseServices.getAllMaterialExpensesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'MaterialExpenses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllMaterialCosts = catchAsync(async (req, res) => {
  const result = await MaterialExpenseServices.getAllMaterialCostsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'MaterialExpenses are retrieved successfully',
    data: result
  });
});

const updateMaterialExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const MaterialExpense = req.body;
  const result = await MaterialExpenseServices.updateMaterialExpenseIntoDB(id, MaterialExpense, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'MaterialExpense is updated successfully',
    data: result,
  });
});

const deleteMaterialExpense = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MaterialExpenseServices.deleteMaterialExpenseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'MaterialExpense is deleted successfully',
    data: result,
  });
});

export const MaterialExpenseControllers = {
  createMaterialExpense,
  getSingleMaterialExpense,
  getAllMaterialExpenses,
  updateMaterialExpense,
  deleteMaterialExpense,
  getAllMaterialCosts
};
