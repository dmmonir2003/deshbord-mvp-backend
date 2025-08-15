/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { QUOTE_SEARCHABLE_FIELDS } from './Quote.constant';
import mongoose, { Types } from 'mongoose';
import { TQuote } from './Quote.interface';
import { Quote } from './Quote.model';
import { User } from '../User/user.model';

const createQuoteIntoDB = async (
  payload: TQuote,
  quoteFile: any,
) => {

  if(quoteFile){
    payload.file = quoteFile.location as string;
  }

  const result = await Quote.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Quote');
  }

  return result;
};

const shareQuoteIntoDB = async (
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

  const project = await Quote.findByIdAndUpdate(
    quoteId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};
const lastQuoteIntoDB = async (
  projectId: string,
  // sharedWith: { userId: string; role: 'client' | 'basicAdmin' }[],
  // user?: any
) => {
  // const { userEmail } = user;

  // const sharedBy = await User.isUserExistsByCustomEmail(userEmail).then(
  //   (user: any) => user?._id
  // );

  // if (!sharedBy) {
  //   throw new Error('Shared by user not found');
  // }

  // const sharedEntries = sharedWith.map(entry => ({
  //   userId: new Types.ObjectId(entry.userId),
  //   role: entry.role,
  //   sharedBy: new Types.ObjectId(sharedBy),
  // }));

  // const project = await Quote.findByIdAndUpdate(
  //   quoteId,
  //   { $addToSet: { sharedWith: { $each: sharedEntries } } },
  //   { new: true }
  // );

  // if (!project) {
  //   throw new Error('Project not found or update failed');
  // }

  // const project = await Quote.findByIdAndUpdate(
  //   quoteId,
  //   { $addToSet: { sharedWith: { $each: sharedEntries } } },
  //   { new: true }
  // );

    const lastQuote = await Quote.findOne({
      projectId,                 // filter by project
      // isDeleted: false,          // not deleted
      // "sharedWith.userId": userId // user has access
    })
      .sort({ createdAt: -1 }) 


// console.log('lastQuote', lastQuote);

  return lastQuote;
};
const unShareQuoteIntoDB = async (
  projectId : string,
  userIds: string[],
) => {

 if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('No user IDs provided for unsharing');
  }

 const updatedProject = await Quote.findByIdAndUpdate(
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

//  const updatedProject = await Quote.findByIdAndUpdate(
//     projectId,
//     {
//       $pull: {
//         sharedWith: { userId: new Types.ObjectId(userId) }
//       }
//     },
//     { new: true }
//   );

//   if (!updatedProject) {
//     throw new Error('Project not found or unshare failed');
//   }

//   return updatedProject;
};

const getAllQuotesFromDB = async (query: Record<string, unknown>, user?: any) => {

  // console.log('user',user);

 if( user?.role === 'client' || user?.role === 'basicAdmin'  ) {
  const { userEmail } = user;
  const userId = await User.isUserExistsByCustomEmail(userEmail).then(
    (user: any) => user?._id
  );

  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }  

     const ProjectQuery = new QueryBuilder(
    Quote.find({
        sharedWith: {
          $elemMatch: {
            userId: new Types.ObjectId(userId),
            role: user?.role
          }
        }
      }),
    query,
  )
    .search(QUOTE_SEARCHABLE_FIELDS)
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
    Quote.find(),
    query,
  )
    .search(QUOTE_SEARCHABLE_FIELDS)
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

  // const QuoteQuery = new QueryBuilder(
  //   Quote.find(),
  //   query,
  // )
  //   .search(QUOTE_SEARCHABLE_FIELDS)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .fields();

  // const result = await QuoteQuery.modelQuery;
  // const meta = await QuoteQuery.countTotal();
  // return {
  //   result,
  //   meta,
  // };
};

const getSingleQuoteFromDB = async (id: string) => {
  const result = await Quote.findById(id);

  return result;
};

const updateQuoteIntoDB = async (id: string, payload: any, files?: any) => {

  if(files){
    payload.file = files.location as string;
  }

  const isDeletedService = await mongoose.connection
    .collection('quotes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      // { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService) {
    throw new Error('Quote not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Quote');
  }

  const updatedData = await Quote.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Quote not found after update');
  }

  return updatedData;
};

const deleteQuoteFromDB = async (id: string) => {
  const deletedService = await Quote.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Quote');
  }

  return deletedService;
};

export const QuoteServices = {
  createQuoteIntoDB,
  getAllQuotesFromDB,
  getSingleQuoteFromDB,
  updateQuoteIntoDB,
  deleteQuoteFromDB,
  shareQuoteIntoDB,
  unShareQuoteIntoDB,
  lastQuoteIntoDB
};

