import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NoteServices } from './Note.service';

const createNote = catchAsync(async (req, res) => {
  const NoteData = req.body;
  const result = await NoteServices.createNoteIntoDB(NoteData, req.file, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note is created successfully',
    data: result,
  });
});

const shareNote = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await NoteServices.shareNoteIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareNote = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await NoteServices.unShareNoteIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NoteServices.getSingleNoteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note is retrieved successfully',
    data: result,
  });
});

const getAllNotes = catchAsync(async (req, res) => {



  const result = await NoteServices.getAllNotesFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notes are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Note = req.body;
  const result = await NoteServices.updateNoteIntoDB(id, Note, req.user, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note is updated successfully',
    data: result,
  });
});

const deleteNote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NoteServices.deleteNoteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Note is deleted successfully',
    data: result,
  });
});

export const NoteControllers = {
  createNote,
  getSingleNote,
  getAllNotes,
  updateNote,
  deleteNote,
  shareNote,
  unShareNote
};
