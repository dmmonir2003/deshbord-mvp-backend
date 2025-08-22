import express, { NextFunction, Request, Response } from 'express';
import { DocumentFileControllers } from './DocumentFile.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createDocumentFileValidationSchema, updateDocumentFileValidationSchema } from './DocumentFile.validation';
import { uploadFileS3 } from '../../utils/UploaderS3';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-document-file',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
     uploadFileS3(true).single('file'),
     (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (error) {
          next(error);
        }
      }
      next();
    },
  validateRequest(createDocumentFileValidationSchema),
  DocumentFileControllers.createDocumentFile,
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  DocumentFileControllers.shareDocumentFile
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  DocumentFileControllers.unShareDocumentFile
);


router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  DocumentFileControllers.getSingleDocumentFile,
);

router.patch(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
     uploadFileS3(true).single('file'),
   (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        next(error);
      }
    }
    next();
  },
  validateRequest(updateDocumentFileValidationSchema),
  DocumentFileControllers.updateDocumentFile,
);

router.delete(
  '/:id',
      auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  DocumentFileControllers.deleteDocumentFile,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  DocumentFileControllers.getAllDocumentFiles,
);

export const DocumentFileRoutes = router;
