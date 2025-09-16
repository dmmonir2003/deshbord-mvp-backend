import express, { NextFunction, Request, Response } from 'express';
import { TimeScheduleControllers } from './TimeSchedule.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createTimeScheduleValidationSchema, updateTimeScheduleValidationSchema } from './TimeSchedule.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-time-schedule',
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
  validateRequest(createTimeScheduleValidationSchema),
  TimeScheduleControllers.createTimeSchedule,
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  TimeScheduleControllers.shareTimeSchedule
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  TimeScheduleControllers.unShareTimeSchedule
);

router.get(
  '/:id',
  TimeScheduleControllers.getSingleTimeSchedule,
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
  validateRequest(updateTimeScheduleValidationSchema),
  TimeScheduleControllers.updateTimeSchedule,
);

router.delete(
  '/:id',
  TimeScheduleControllers.deleteTimeSchedule,
);

router.get(
  '/',
  TimeScheduleControllers.getAllTimeSchedules,
);

export const TimeScheduleRoutes = router;
