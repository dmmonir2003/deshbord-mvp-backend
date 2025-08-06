import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubContractorServices } from './SubContractor.service';

const createSubContractor = catchAsync(async (req, res) => {
  const SubContractorData = req.body;
  const result = await SubContractorServices.createSubContractorIntoDB(SubContractorData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubContractor is created successfully',
    data: result,
  });
});

const getSingleSubContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubContractorServices.getSingleSubContractorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubContractor is retrieved successfully',
    data: result,
  });
});

const getAllSubContractors = catchAsync(async (req, res) => {
  const result = await SubContractorServices.getAllSubContractorsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubContractors are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSubContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const SubContractor = req.body;
  const result = await SubContractorServices.updateSubContractorIntoDB(id, SubContractor, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubContractor is updated successfully',
    data: result,
  });
});

const deleteSubContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubContractorServices.deleteSubContractorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubContractor is deleted successfully',
    data: result,
  });
});

export const SubContractorControllers = {
  createSubContractor,
  getSingleSubContractor,
  getAllSubContractors,
  updateSubContractor,
  deleteSubContractor,
};
