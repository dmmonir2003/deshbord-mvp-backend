/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SITEREPORT_SEARCHABLE_FIELDS } from './SiteReport.constant';
import mongoose, { Types } from 'mongoose';
import { TSiteReport } from './SiteReport.interface';
import { SiteReport } from './SiteReport.model';
import { User } from '../User/user.model';

const createSiteReportIntoDB = async (
  payload: TSiteReport,
  files: any,
) => {

// Example: get overview files
const overviewFiles = files['overviewFile']?.map((f:any) => f.location) || [];
const weatherFiles = files['weather']?.map((f:any) => f.location) || [];
const workingDayFiles = files['workingDays']?.map((f:any) => f.location) || [];
const laborTeamFiles = files['LaborTeam']?.map((f:any) => f.location) || [];



    if(overviewFiles.length > 0){
      payload.overviewFile = overviewFiles; // Assuming file.location contains the S3 URL
    }
    if(weatherFiles.length > 0){
      payload.weather = weatherFiles; // Assuming file.location contains the S3 URL
    }
    if(workingDayFiles.length > 0){
      payload.workingDays = workingDayFiles; // Assuming file.location contains the S3 URL
    }
    if(laborTeamFiles.length > 0){
      payload.LaborTeam = laborTeamFiles; // Assuming file.location contains the S3 URL
    } 

  const result = await SiteReport.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SiteReport');
  }

  return result;
};

const shareSiteReportIntoDB = async (
  projectId: string,
  sharedWith: { userId: string; role: 'client' | 'basicAdmin' }[],
  user?: any
) => {

  const { userEmail } = user;
  const sharedBy = await User.isUserExistsByCustomEmail(userEmail).then(
    (user: any) => user?._id
  );

  if (!sharedBy) {
    throw new Error('Shared by user not found');
  }

  const sharedEntries = sharedWith.map(entry => ({
    userId: new Types.ObjectId(entry.userId),
    role: entry.role,
    sharedBy: new Types.ObjectId(sharedBy),
  }));

  const project = await SiteReport.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};
const unShareSiteReportIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await SiteReport.findByIdAndUpdate(
     projectId,
     {
       $pull: {
         sharedWith: {
           userId: { $in: userIds.map(id => new Types.ObjectId(id)) } // 🔄 remove multiple
         }
       }
     },
     { new: true }
   );
 
   if (!updatedProject) {
     throw new Error('Project not found or unshare failed');
   }
 
   return updatedProject;
};


const getAllSiteReportsFromDB = async (query: Record<string, unknown>) => {

  const SiteReportQuery = new QueryBuilder(
    SiteReport.find(),
    query,
  )
    .search(SITEREPORT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SiteReportQuery.modelQuery;
  const meta = await SiteReportQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSiteReportFromDB = async (id: string) => {
  const result = await SiteReport.findById(id).populate({
      path: "sharedWith.userId", // field to populate
      select: "name profileImg email role", // only return what you need
    });

  return result;
};

const updateSiteReportIntoDB = async (id: string, payload: any, files?: any) => {

// Example: get overview files
const overviewFiles = files['overviewFile']?.map((f:any) => f.location) || [];
const weatherFiles = files['weather']?.map((f:any) => f.location) || [];
const workingDayFiles = files['workingDays']?.map((f:any) => f.location) || [];
const laborTeamFiles = files['LaborTeam']?.map((f:any) => f.location) || [];



    if(overviewFiles.length > 0){
      payload.overviewFile = overviewFiles; // Assuming file.location contains the S3 URL
    }
    if(weatherFiles.length > 0){
      payload.weather = weatherFiles; // Assuming file.location contains the S3 URL
    }
    if(workingDayFiles.length > 0){
      payload.workingDays = workingDayFiles; // Assuming file.location contains the S3 URL
    }
    if(laborTeamFiles.length > 0){
      payload.LaborTeam = laborTeamFiles; // Assuming file.location contains the S3 URL
    }

  console.log('Payload in service:', payload);

  const isDeletedService = await mongoose.connection
    .collection('sitereports')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('SiteReport not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SiteReport');
  }

  const updatedData = await SiteReport.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SiteReport not found after update');
  }

  return updatedData;
};

const deleteSiteReportFromDB = async (id: string) => {
  const deletedService = await SiteReport.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SiteReport');
  }

  return deletedService;
};

export const SiteReportServices = {
  createSiteReportIntoDB,
  getAllSiteReportsFromDB,
  getSingleSiteReportFromDB,
  updateSiteReportIntoDB,
  deleteSiteReportFromDB,
  shareSiteReportIntoDB,
  unShareSiteReportIntoDB,
};
