import express, { NextFunction, Request, Response } from 'express';
import { InterimControllers } from './Interim.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createInterimValidationSchema, updateInterimValidationSchema } from './Interim.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-interim',
  auth(USER_ROLE.superAdmin,USER_ROLE.primeAdmin),
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
  validateRequest(createInterimValidationSchema),
  InterimControllers.createInterim,
);


router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  InterimControllers.shareInterim
);
router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  InterimControllers.unShareInterim
);

router.get(
  '/:id',
  InterimControllers.getSingleInterim,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin,USER_ROLE.primeAdmin),
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
  validateRequest(updateInterimValidationSchema),
  InterimControllers.updateInterim,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin,USER_ROLE.primeAdmin),
  InterimControllers.deleteInterim,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  InterimControllers.getAllInterims,
);

export const InterimRoutes = router;
