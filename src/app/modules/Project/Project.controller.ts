import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './Project.service';

const createProject = catchAsync(async (req, res) => {
  const ProjectData = req.body;
  const result = await ProjectServices.createProjectIntoDB(ProjectData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});

const shareProject = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await ProjectServices.shareProjectIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareProject = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await ProjectServices.unShareProjectIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.getSingleProjectFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is retrieved successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const result = await ProjectServices.getAllProjectsFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllProjectsWithoutPending = catchAsync(async (req, res) => {
  const result = await ProjectServices.getAllProjectsWithoutPendingFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getEarningForProjectsOfMonth = catchAsync(async (req, res) => {
  const result = await ProjectServices.getEarningForProjectsOfMonthFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects are retrieved successfully',
    meta: result.meta,
    data: { earningsByMonth: result.earningsByMonth, totalEarnings: result.totalEarnings },
  });
});

const updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Project = req.body;
  const result = await ProjectServices.updateProjectIntoDB(id, Project);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.deleteProjectFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is deleted successfully',
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getSingleProject,
  getAllProjects,
  updateProject,
  deleteProject,
  shareProject,
  unShareProject,
  getEarningForProjectsOfMonth,
  getAllProjectsWithoutPending
};
