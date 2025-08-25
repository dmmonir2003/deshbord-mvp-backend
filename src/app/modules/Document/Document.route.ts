import express from 'express';
import { DocumentControllers } from './Document.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDocumentValidationSchema, updateDocumentValidationSchema } from './Document.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-document',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  validateRequest(createDocumentValidationSchema),
  DocumentControllers.createDocument,
);

router.get(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.basicAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  DocumentControllers.getSingleDocument,
);

router.patch(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  validateRequest(updateDocumentValidationSchema),
  DocumentControllers.updateDocument,
);

router.delete(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  DocumentControllers.deleteDocument,
);

router.get(
  '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  DocumentControllers.getAllDocuments,
);

export const DocumentRoutes = router;
