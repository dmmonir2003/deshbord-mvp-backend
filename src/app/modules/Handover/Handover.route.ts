import express, { NextFunction, Request, Response } from 'express';
import { HandoverControllers } from './Handover.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createHandoverValidationSchema, updateHandoverValidationSchema } from './Handover.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-handover',
  //  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
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
  validateRequest(createHandoverValidationSchema),
  HandoverControllers.createHandover,
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  HandoverControllers.shareHandoverFile
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  HandoverControllers.unShareHandoverFile
);

router.get(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  HandoverControllers.getSingleHandover,
);

router.patch(
  '/:id',
 auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
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
  validateRequest(updateHandoverValidationSchema),
  HandoverControllers.updateHandover,
);

router.delete(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  HandoverControllers.deleteHandover,
);

router.get(
  '/',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  HandoverControllers.getAllHandovers,
);

export const HandoverRoutes = router;
