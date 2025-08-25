import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TimeScheduleServices } from './TimeSchedule.service';

const createTimeSchedule = catchAsync(async (req, res) => {
  const TimeScheduleData = req.body;
  const result = await TimeScheduleServices.createTimeScheduleIntoDB(TimeScheduleData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSchedule is created successfully',
    data: result,
  });
});


const shareTimeSchedule = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await TimeScheduleServices.shareTimeScheduleIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareTimeSchedule = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await TimeScheduleServices.unShareTimeScheduleIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleTimeSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TimeScheduleServices.getSingleTimeScheduleFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSchedule is retrieved successfully',
    data: result,
  });
});

const getAllTimeSchedules = catchAsync(async (req, res) => {
  const result = await TimeScheduleServices.getAllTimeSchedulesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSchedules are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateTimeSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const TimeSchedule = req.body;
  const result = await TimeScheduleServices.updateTimeScheduleIntoDB(id, TimeSchedule, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSchedule is updated successfully',
    data: result,
  });
});

const deleteTimeSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TimeScheduleServices.deleteTimeScheduleFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TimeSchedule is deleted successfully',
    data: result,
  });
});

export const TimeScheduleControllers = {
  createTimeSchedule,
  getSingleTimeSchedule,
  getAllTimeSchedules,
  updateTimeSchedule,
  deleteTimeSchedule,
  shareTimeSchedule,
  unShareTimeSchedule
};
