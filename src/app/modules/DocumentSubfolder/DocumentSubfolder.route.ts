import express from 'express';
import { DocumentSubfolderControllers } from './DocumentSubfolder.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDocumentSubfolderValidationSchema, updateDocumentSubfolderValidationSchema } from './DocumentSubfolder.validation';

const router = express.Router();

router.post(
  '/create-sub-document',
  validateRequest(createDocumentSubfolderValidationSchema),
  DocumentSubfolderControllers.createDocumentSubfolder,
);

router.get(
  '/:id',
  DocumentSubfolderControllers.getSingleDocumentSubfolder,
);

router.patch(
  '/:id',
  validateRequest(updateDocumentSubfolderValidationSchema),
  DocumentSubfolderControllers.updateDocumentSubfolder,
);

router.delete(
  '/:id',
  DocumentSubfolderControllers.deleteDocumentSubfolder,
);

router.get(
  '/',
  DocumentSubfolderControllers.getAllDocumentSubfolders,
);

export const DocumentSubfolderRoutes = router;
