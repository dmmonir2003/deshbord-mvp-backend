/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { INTERIM_SEARCHABLE_FIELDS } from './Interim.constant';
import mongoose, { Types } from 'mongoose';
import { TInterim } from './Interim.interface';
import { Interim } from './Interim.model';
import { User } from '../User/user.model';

const createInterimIntoDB = async (
  payload: TInterim,
  file?: any
) => {
  if( file ) {
    payload.file = file.location as string;
  }

  const result = await Interim.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Interim');
  }

  return result;
};


const shareInterimIntoDB = async (
  quoteId: string,
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

  const project = await Interim.findByIdAndUpdate(
    quoteId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};
const unShareInterimIntoDB = async (
  projectId : string,
  userIds: string[],
) => {

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('No user IDs provided for unsharing');
  }
  
 const updatedInterim = await Interim.findByIdAndUpdate(
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

  if (!updatedInterim) {
    throw new Error('Interim not found or unshare failed');
  }

  return updatedInterim;
};

const getAllInterimsFromDB = async (query: Record<string, unknown>, user?: any) => {
 if( user?.role === 'client' || user?.role === 'basicAdmin'  ) {
  const { userEmail } = user;
  const userId = await User.isUserExistsByCustomEmail(userEmail).then(
    (user: any) => user?._id
  );

  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }  

     const ProjectQuery = new QueryBuilder(
    Interim.find({
        sharedWith: {
          $elemMatch: {
            userId: new Types.ObjectId(userId),
            role: user?.role
          }
        }
      }),
    query,
  )
    .search(INTERIM_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ProjectQuery.modelQuery;
  const meta = await ProjectQuery.countTotal();
  return {
    result,
    meta,
  };
  
  }else{
  const ProjectQuery = new QueryBuilder(
    Interim.find(),
    query,
  )
    .search(INTERIM_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ProjectQuery.modelQuery;
  const meta = await ProjectQuery.countTotal();
  return {
    result,
    meta,
  };
  }
};

const getSingleInterimFromDB = async (id: string) => {
  const result = await Interim.findById(id);

  return result;
};

const updateInterimIntoDB = async (id: string, payload: any, file?: any) => {


if( file ) {
    payload.file = file.location as string;
  }



  const isDeletedService = await mongoose.connection
    .collection('interims')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },

    );

  if (!isDeletedService) {
    throw new Error('Interim not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Interim');
  }

  const updatedData = await Interim.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Interim not found after update');
  }

  return updatedData;
};

const deleteInterimFromDB = async (id: string) => {
  const deletedService = await Interim.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Interim');
  }

  return deletedService;
};

export const InterimServices = {
  createInterimIntoDB,
  getAllInterimsFromDB,
  getSingleInterimFromDB,
  updateInterimIntoDB,
  deleteInterimFromDB,
  unShareInterimIntoDB,
  shareInterimIntoDB
};
