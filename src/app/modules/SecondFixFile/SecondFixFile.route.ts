import express, { NextFunction, Request, Response } from 'express';
import { SecondFixFileControllers } from './SecondFixFile.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSecondFixFileValidationSchema, updateSecondFixFileValidationSchema } from './SecondFixFile.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-second-fix-file',
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
  validateRequest(createSecondFixFileValidationSchema),
  SecondFixFileControllers.createSecondFixFile,
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SecondFixFileControllers.shareSecondFixFile
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SecondFixFileControllers.unShareSecondFixFile
);


router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  SecondFixFileControllers.getSingleSecondFixFile,
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
  validateRequest(updateSecondFixFileValidationSchema),
  SecondFixFileControllers.updateSecondFixFile,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SecondFixFileControllers.deleteSecondFixFile,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  SecondFixFileControllers.getAllSecondFixFiles,
);

export const SecondFixFileRoutes = router;
