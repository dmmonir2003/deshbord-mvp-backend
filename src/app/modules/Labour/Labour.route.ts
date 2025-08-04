import express, { NextFunction, Request, Response } from 'express';
import { LabourControllers } from './Labour.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createLabourValidationSchema, updateLabourValidationSchema } from './Labour.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-labour',
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
  validateRequest(createLabourValidationSchema),
  LabourControllers.createLabour,
);

router.get(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourControllers.getSingleLabour,
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
  validateRequest(updateLabourValidationSchema),
  LabourControllers.updateLabour,
);

router.delete(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourControllers.deleteLabour,
);

router.get(
  '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourControllers.getAllLabours,
);

export const LabourRoutes = router;
