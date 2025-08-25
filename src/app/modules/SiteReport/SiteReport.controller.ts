import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SiteReportServices } from './SiteReport.service';
import {  Express } from 'express';
const createSiteReport = catchAsync(async (req, res) => {
  // const fileUrls = (req.files as Express.MulterS3.File[]).map(f => f.location); 
const files = req.files as {
  [fieldname: string]: Express.MulterS3.File[];
};
   
  const SiteReportData = req.body;
  const result = await SiteReportServices.createSiteReportIntoDB(SiteReportData, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SiteReport is created successfully',
    data: result,
  });
});

const shareSiteReport = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await SiteReportServices.shareSiteReportIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareSiteReport = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await SiteReportServices.unShareSiteReportIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleSiteReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SiteReportServices.getSingleSiteReportFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SiteReport is retrieved successfully',
    data: result,
  });
});

const getAllSiteReports = catchAsync(async (req, res) => {
  const result = await SiteReportServices.getAllSiteReportsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SiteReports are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateSiteReport = catchAsync(async (req, res) => {
  // const fileUrls = (req.files as Express.MulterS3.File[]).map(f => f.location); 

  const files = req.files as {
  [fieldname: string]: Express.MulterS3.File[];
};
  const { id } = req.params;
  const SiteReport= req.body;

  // const result = await SiteReportServices.updateSiteReportIntoDB(id, SiteReport, fileUrls);
  const result = await SiteReportServices.updateSiteReportIntoDB(id, SiteReport, files);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SiteReport is updated successfully',
    data: result,
  });
});

const deleteSiteReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SiteReportServices.deleteSiteReportFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SiteReport is deleted successfully',
    data: result,
  });
});

export const SiteReportControllers = {
  createSiteReport,
  getSingleSiteReport,
  getAllSiteReports,
  updateSiteReport,
  deleteSiteReport,
  unShareSiteReport,
  shareSiteReport,
};
