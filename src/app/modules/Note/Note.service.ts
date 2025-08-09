/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { NoteSearchableFields } from './Note.constant';
import mongoose from 'mongoose';
import { TNote } from './Note.interface';
import { Note } from './Note.model';

const createNoteIntoDB = async (
  payload: TNote,
) => {
  const result = await Note.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Note');
  }

  return result;
};

const getAllNotesFromDB = async (query: Record<string, unknown>) => {
  const NoteQuery = new QueryBuilder(
    Note.find(),
    query,
  )
    .search(NoteSearchableFields)
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
};

const getSingleNoteFromDB = async (id: string) => {
  const result = await Note.findById(id);

  return result;
};

const updateNoteIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('notes')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
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
  const deletedService = await Note.findByIdAndUpdate(
    id,
    { isDeleted: true },
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
};
