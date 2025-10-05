import express from 'express';
import { DocumentSubfolderControllers } from './DocumentSubfolder.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDocumentSubfolderValidationSchema, updateDocumentSubfolderValidationSchema } from './DocumentSubfolder.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-sub-document',
      auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createDocumentSubfolderValidationSchema),
  DocumentSubfolderControllers.createDocumentSubfolder,
);

router.get(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  DocumentSubfolderControllers.getSingleDocumentSubfolder,
);

router.patch(
  '/:id',
      auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateDocumentSubfolderValidationSchema),
  DocumentSubfolderControllers.updateDocumentSubfolder,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  DocumentSubfolderControllers.deleteDocumentSubfolder,
);

router.get(
  '/',
 auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  DocumentSubfolderControllers.getAllDocumentSubfolders,
);

export const DocumentSubfolderRoutes = router;
