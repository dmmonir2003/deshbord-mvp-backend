import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { InterimServices } from './Interim.service';

const createInterim = catchAsync(async (req, res) => {
  const InterimData = req.body;
  const result = await InterimServices.createInterimIntoDB(InterimData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interim is created successfully',
    data: result,
  });
});

const shareInterim = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await InterimServices.shareInterimIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareInterim = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;

  const result = await InterimServices.unShareInterimIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});




const getSingleInterim = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InterimServices.getSingleInterimFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interim is retrieved successfully',
    data: result,
  });
});

const getAllInterims = catchAsync(async (req, res) => {
  const result = await InterimServices.getAllInterimsFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interims are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateInterim = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Interim = req.body;
  const result = await InterimServices.updateInterimIntoDB(id, Interim, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interim is updated successfully',
    data: result,
  });
});

const deleteInterim = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await InterimServices.deleteInterimFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Interim is deleted successfully',
    data: result,
  });
});

export const InterimControllers = {
  createInterim,
  getSingleInterim,
  getAllInterims,
  updateInterim,
  deleteInterim,
  shareInterim,
  unShareInterim
};
