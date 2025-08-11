/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { NOTE_SEARCHABLE_FIELDS } from './Note.constant';
import mongoose from 'mongoose';
import { TNote } from './Note.interface';
import { Note } from './Note.model';
import  { Types } from 'mongoose';
import { User } from '../User/user.model';
// import { Project } from '../Project/Project.model';

const createNoteIntoDB = async (
  payload: TNote,
) => {
  //   const project = await Project.findById(payload.projectId);
  // console.log('project', project);

  const result = await Note.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Note');
  }

  return result;
};

const shareNoteIntoDB = async (
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

  const project = await Note.findByIdAndUpdate(
    projectId,
    { $addToSet: { sharedWith: { $each: sharedEntries } } },
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found or update failed');
  }

  return project;
};
const unShareNoteIntoDB = async (
 projectId : string,
   userIds: string[],
 ) => {
 
   if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
     throw new Error('No user IDs provided for unsharing');
   }
   
  const updatedProject = await Note.findByIdAndUpdate(
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


const getAllNotesFromDB = async (query: Record<string, unknown>, user?: any) => {

    if( user?.role === 'client' || user?.role === 'basicAdmin'  ) {
    const { userEmail } = user;
    const userId = await User.isUserExistsByCustomEmail(userEmail).then(
      (user: any) => user?._id
    );
  
    if (!userId) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }  
  
       const NoteQuery = new QueryBuilder(
      Note.find({
          sharedWith: {
            $elemMatch: {
              userId: new Types.ObjectId(userId),
              role: user?.role
            }
          }
        }),
      query,
    )
      .search(NOTE_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await NoteQuery.modelQuery;
    const meta = await NoteQuery.countTotal();
    return {
      result,
      meta,
    };
    
    }else{
    const NoteQuery = new QueryBuilder(
      Note.find(),
      query,
    )
      .search(NOTE_SEARCHABLE_FIELDS)
      .filter()
      .sort()
      .paginate()
      .fields();
  
    const result = await NoteQuery.modelQuery;
    const meta = await NoteQuery.countTotal();
    return {
      result,
      meta,
    };
    }
  // const NoteQuery = new QueryBuilder(
  //   Note.find(),
  //   query,
  // )
  //   .search(NOTE_SEARCHABLE_FIELDS)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .fields();

  // const result = await NoteQuery.modelQuery;
  // const meta = await NoteQuery.countTotal();
  // return {
  //   result,
  //   meta,
  // };
};

// const getSingleNoteFromDB = async (id: string) => {
//   const result = await Note.findById(id);

//   return result;
// };
const getSingleNoteFromDB = async (id: string) => {
  const result = await Note.findById(id)
    .populate({
      path: "sharedWith.userId",
      select: "name profileImg" // only fetch name and image
    })
    .populate({
      path: "sharedWith.sharedBy",
      select: "name profileImg" // optional, if you also want the sharer's info
    })
    // .populate({
    //   path: "projectId",
    //   select: "title" // optional, if you want project title
    // })
    // .populate({
    //   path: "clientId",
    //   select: "name image" // optional, if you want client info
    // });

  return result;
};


const updateNoteIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('notes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },

    );

  if (!isDeletedService) {
    throw new Error('Note not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Note');
  }

  const updatedData = await Note.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('Note not found after update');
  }

  return updatedData;
};

const deleteNoteFromDB = async (id: string) => {
  const deletedService = await Note.findByIdAndDelete(
    id,
    // { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Note');
  }

  return deletedService;
};

export const NoteServices = {
  createNoteIntoDB,
  getAllNotesFromDB,
  getSingleNoteFromDB,
  updateNoteIntoDB,
  deleteNoteFromDB,
  shareNoteIntoDB,
  unShareNoteIntoDB
};
