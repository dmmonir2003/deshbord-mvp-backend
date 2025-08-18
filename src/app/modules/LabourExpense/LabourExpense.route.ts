import express, { NextFunction, Request, Response } from 'express';
import { LabourExpenseControllers } from './LabourExpense.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createLabourExpenseValidationSchema, updateLabourExpenseValidationSchema } from './LabourExpense.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-labour-expense',
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
  validateRequest(createLabourExpenseValidationSchema),
  LabourExpenseControllers.createLabourExpense,
);
router.get(
  '/all-labour-costs',
  // '/:id/all-labour-costs',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourExpenseControllers.getAllLabourCosts,
);

router.get(
  '/:id',
      auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourExpenseControllers.getSingleLabourExpense,
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
  validateRequest(updateLabourExpenseValidationSchema),
  LabourExpenseControllers.updateLabourExpense,
);

router.delete(
  '/:id',
      auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourExpenseControllers.deleteLabourExpense,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  LabourExpenseControllers.getAllLabourExpenses,
);


export const LabourExpenseRoutes = router;
