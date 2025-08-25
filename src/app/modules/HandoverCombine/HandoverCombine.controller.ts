import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HandoverCombineServices } from './HandoverCombine.service';

const createHandoverCombine = catchAsync(async (req, res) => {
  const HandoverCombineData = req.body;
  const result = await HandoverCombineServices.createHandoverCombineIntoDB(HandoverCombineData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HandoverCombine is created successfully',
    data: result,
  });
});

const shareHandoverCombine = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await HandoverCombineServices.shareHandoverCombineIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareHandoverCombine = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await HandoverCombineServices.unShareHandoverCombineIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});



const getSingleHandoverCombine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HandoverCombineServices.getSingleHandoverCombineFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HandoverCombine is retrieved successfully',
    data: result,
  });
});

const getAllHandoverCombines = catchAsync(async (req, res) => {
  const result = await HandoverCombineServices.getAllHandoverCombinesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HandoverCombines are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllHandoverCombinesData = catchAsync(async (req, res) => {
    const { id } = req.params;
  const result = await HandoverCombineServices.getAllHandoverCombinesDataFromDB(id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HandoverCombines are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateHandoverCombine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const HandoverCombine = req.body;
  const result = await HandoverCombineServices.updateHandoverCombineIntoDB(id, HandoverCombine);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HandoverCombine is updated successfully',
    data: result,
  });
});

const deleteHandoverCombine = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await HandoverCombineServices.deleteHandoverCombineFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HandoverCombine is deleted successfully',
    data: result,
  });
});

export const HandoverCombineControllers = {
  createHandoverCombine,
  getSingleHandoverCombine,
  getAllHandoverCombines,
  updateHandoverCombine,
  deleteHandoverCombine,
  shareHandoverCombine,
  unShareHandoverCombine,
  getAllHandoverCombinesData
};
