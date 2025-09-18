/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CERTIFICATE_SEARCHABLE_FIELDS } from './Certificate.constant';
import mongoose, { Types } from 'mongoose';
import { TCertificate } from './Certificate.interface';
import { Certificate } from './Certificate.model';
import { User } from '../User/user.model';
import { NotificationServices } from '../Notification/Notification.service';

const createCertificateIntoDB = async (
  payload: TCertificate,
  file?: any
) => {


  if(file){
    payload.file = file.location as string;
  }

  const result = await Certificate.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Certificate');
  }

  const ndata = {
    title: 'Certificate Creation',
    message: "A certificate created",
    projectId:payload?.projectId,
    readBy: []
  }

  const createdData = await NotificationServices.createNotificationIntoDB(ndata)
   
  if(!createdData) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Certificate');

  return result;
};

const shareCertificateIntoDB = async (
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

  const project = await Certificate.findByIdAndUpdate(
    quoteId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};

const unShareCertificateIntoDB = async (
  projectId : string,
  userIds: string[],
) => {

 if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('No user IDs provided for unsharing');
  }

 const updatedProject = await Certificate.findByIdAndUpdate(
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

const getAllCertificatesFromDB = async (query: Record<string, unknown>) => {
  const CertificateQuery = new QueryBuilder(
    Certificate.find(),
    query,
  )
    .search(CERTIFICATE_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CertificateQuery.modelQuery;
  const meta = await CertificateQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleCertificateFromDB = async (id: string) => {
  const result = await Certificate.findById(id).populate({
      path: "sharedWith.userId", // field to populate
      select: "name profileImg role", // only return what you need
    });

  return result;
};

const updateCertificateIntoDB = async (id: string, payload: any, file?: any) => {

  const isDeletedService = await mongoose.connection
    .collection('certificates')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
    );

  if (!isDeletedService) {
    throw new Error('Certificate not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Certificate');
  }

  
  if(file){
    payload.file = file.location as string;
  }

  const updatedData = await Certificate.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Certificate not found after update');
  }

  return updatedData;
};

const deleteCertificateFromDB = async (id: string) => {
  const deletedService = await Certificate.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Certificate');
  }

  return deletedService;
};

export const CertificateServices = {
  createCertificateIntoDB,
  getAllCertificatesFromDB,
  getSingleCertificateFromDB,
  updateCertificateIntoDB,
  deleteCertificateFromDB,
  unShareCertificateIntoDB,
  shareCertificateIntoDB
};
