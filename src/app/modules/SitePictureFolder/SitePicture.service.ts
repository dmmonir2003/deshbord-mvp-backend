/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { SITEPICTURE_SEARCHABLE_FIELDS } from './SitePicture.constant';
import mongoose, { Types } from 'mongoose';
import { TSitePicture } from './SitePicture.interface';
import { SitePictureFolder } from './SitePicture.model';
import { User } from '../User/user.model';

const createSitePictureIntoDB = async (
  payload: TSitePicture,
) => {
  const result = await SitePictureFolder.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SitePicture');
  }

  return result;
};

const shareSitePictureFolderIntoDB = async (
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

  const project = await SitePictureFolder.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};
const unShareSitePictureFolderIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await SitePictureFolder.findByIdAndUpdate(
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



const getAllSitePicturesFromDB = async (query: Record<string, unknown>) => {
  const SitePictureQuery = new QueryBuilder(
    SitePictureFolder.find(),
    query,
  )
    .search(SITEPICTURE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SitePictureQuery.modelQuery;
  const meta = await SitePictureQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleSitePictureFromDB = async (id: string) => {
  const result = await SitePictureFolder.findById(id).populate({
      path: "sharedWith.userId",
      select: "name profileImg role" // only fetch name and image
    });

  return result;
};

const updateSitePictureIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('sitepictures')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('SitePicture not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted SitePicture');
  }

  const updatedData = await SitePictureFolder.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('SitePicture not found after update');
  }

  return updatedData;
};

const deleteSitePictureFromDB = async (id: string) => {
  const deletedService = await SitePictureFolder.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete SitePicture');
  }

  return deletedService;
};

export const SitePictureServices = {
  createSitePictureIntoDB,
  getAllSitePicturesFromDB,
  getSingleSitePictureFromDB,
  updateSitePictureIntoDB,
  deleteSitePictureFromDB,
  shareSitePictureFolderIntoDB,
  unShareSitePictureFolderIntoDB
};
