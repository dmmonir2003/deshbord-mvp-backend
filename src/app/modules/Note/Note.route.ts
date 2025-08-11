import express from 'express';
import { NoteControllers } from './Note.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createNoteValidationSchema, updateNoteValidationSchema } from './Note.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-note',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  validateRequest(createNoteValidationSchema),
  NoteControllers.createNote,
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  NoteControllers.shareNote
);
router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  NoteControllers.unShareNote
);


router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client),
  NoteControllers.getSingleNote,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client),
  validateRequest(updateNoteValidationSchema),
  NoteControllers.updateNote,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  NoteControllers.deleteNote,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client),
  NoteControllers.getAllNotes,
);

export const NoteRoutes = router;
