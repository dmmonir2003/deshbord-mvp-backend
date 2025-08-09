import express from 'express';
import { NoteControllers } from './Note.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createNoteValidationSchema, updateNoteValidationSchema } from './Note.validation';

const router = express.Router();

router.post(
  '/create-Note',
  validateRequest(createNoteValidationSchema),
  NoteControllers.createNote,
);

router.get(
  '/:id',
  NoteControllers.getSingleNote,
);

router.patch(
  '/:id',
  validateRequest(updateNoteValidationSchema),
  NoteControllers.updateNote,
);

router.delete(
  '/:id',
  NoteControllers.deleteNote,
);

router.get(
  '/',
  NoteControllers.getAllNotes,
);

export const NoteRoutes = router;
