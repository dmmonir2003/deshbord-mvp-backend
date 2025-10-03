import express, { NextFunction, Request, Response } from 'express';
import { SnaggingControllers } from './Snagging.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSnaggingValidationSchema, updateSnaggingValidationSchema } from './Snagging.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-snagging',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  uploadFileS3(true).fields([
  { name: 'file', maxCount: 5 },
  { name: 'completeFile', maxCount: 5 }
]),
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
  validateRequest(createSnaggingValidationSchema),
  SnaggingControllers.createSnagging,
);


router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SnaggingControllers.shareSnagging
);
router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SnaggingControllers.unShareSnagging
);


router.get(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  SnaggingControllers.getSingleSnagging,
);

router.patch(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  uploadFileS3(true).fields([
  { name: 'file', maxCount: 5 },
  { name: 'completeFile', maxCount: 5 }
]),
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
  validateRequest(updateSnaggingValidationSchema),
  SnaggingControllers.updateSnagging,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SnaggingControllers.deleteSnagging,
);

router.get(
  '/',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  SnaggingControllers.getAllSnaggings,
);

export const SnaggingRoutes = router;
