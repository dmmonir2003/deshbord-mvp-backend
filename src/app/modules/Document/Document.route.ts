import express from 'express';
import { DocumentControllers } from './Document.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDocumentValidationSchema, updateDocumentValidationSchema } from './Document.validation';

const router = express.Router();

router.post(
  '/create-document',
  validateRequest(createDocumentValidationSchema),
  DocumentControllers.createDocument,
);

router.get(
  '/:id',
  DocumentControllers.getSingleDocument,
);

router.patch(
  '/:id',
  validateRequest(updateDocumentValidationSchema),
  DocumentControllers.updateDocument,
);

router.delete(
  '/:id',
  DocumentControllers.deleteDocument,
);

router.get(
  '/',
  DocumentControllers.getAllDocuments,
);

export const DocumentRoutes = router;
