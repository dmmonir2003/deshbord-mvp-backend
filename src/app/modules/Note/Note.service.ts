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
import { Quote } from '../Quote/Quote.model';
// import { Project } from '../Project/Project.model';

const createNoteIntoDB = async (
  payload: TNote,
  file?: any
) => {

  if(file) {
    payload.file = file.location;
  }
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

  console.log('user', user);

    if( user?.role === 'client' || user?.role === 'basicAdmin'  ) {
    const { userEmail } = user;
    const userId = await User.isUserExistsByCustomEmail(userEmail).then(
      (user: any) => user?._id
    );
  
    if (!userId) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }  
    console.log('userId', userId);
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
      select: "name profileImg role" // only fetch name and image
    })
    .populate({
      path: "sharedWith.sharedBy",
      select: "name profileImg role" // optional, if you also want the sharer's info
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

const updateNoteIntoDB = async (id: string, payload: any, user: any) => {

if(payload.status){

  const note = await mongoose.connection
    .collection('notes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },

    );

  if (!note) {
    throw new Error('Note not found');
  }

  if (note.isDeleted) {
    throw new Error('Cannot update a deleted Note');
  }

  const updatedNote = await Note.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedNote) {
    throw new Error('Note not found after update');
  }

   console.log('payload.status',updatedNote.status);

   if( updatedNote.status === 'approved' ) {
       console.log('updatedData.projectId======', updatedNote.projectId);
       console.log('user.email======', user.userEmail);
      // get last quote from db
  const projectId = updatedNote.projectId;
  const userId = await User.isUserExistsByCustomEmail(user.userEmail)
  .then(
    (user: any) => {
      console.log('user',user);
      return user?._id
    } 
  )
  console.log('usr',userId);

  // const userId = updatedData.userId; 
  const lastQuote = await Quote.findOne({
    projectId,                 // filter by project
    // isDeleted: false,          // not deleted
    "sharedWith.userId": userId // user has access
  })
    .sort({ createdAt: -1 }) // latest first
    // .populate({
    //   path: "sharedWith.userId",
    //   select: "name image"
    // })
    // .populate({
    //   path: "sharedWith.sharedBy",
    //   select: "name image"
    // });

    console.log('lastQuote++++++++++',lastQuote);
    console.log('updatedNote++++++++++',updatedNote);
    console.log('updatedNote.value',updatedNote.value);
    console.log('lastQuote?.value++++++++++',lastQuote?.value);
    console.log('updatedNote?._id+++++++++',updatedNote?._id);
  const newValue = updatedNote.value+(lastQuote?.value as any);
    const newQuoteData =  {
      projectId: lastQuote?.projectId,
      title: lastQuote?.title,
      file: lastQuote?.file,
      noteId: updatedNote?._id,
      value: newValue,
      sharedWith: lastQuote?.sharedWith
    }
    const newQuote = await Quote.create(newQuoteData);
    if (!newQuote) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Quote');
    }
// result++++++++++ {
//   _id: new ObjectId('68996f4de71cc31474d92095'),
//   title: 'Architect',
//   file: 'https://pro-bucket.s3.us-east-1.amazonaws.com/1754885962356_1.png',
//   projectId: new ObjectId('688e16d11287a3a4dc3a9b83'),
//   value: 450000,
//   isDeleted: false,
//   sharedWith: [
//     {
//       userId: new ObjectId('68996262d2544a0c0ed42616'),
//       role: 'client',
//       sharedBy: new ObjectId('688e22868f082a1b763c2007'),
//       _id: new ObjectId('68996fcde71cc31474d920b4')
//     }
//   ],
//   __v: 0
// }

      return;
      // return newQuote;
   }

 


}else{

 console.log('payload.status Not found');

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
}

  
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
