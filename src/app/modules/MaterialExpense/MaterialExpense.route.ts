import express, { NextFunction, Request, Response } from 'express';
import { MaterialExpenseControllers } from './MaterialExpense.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createMaterialExpenseValidationSchema, updateMaterialExpenseValidationSchema } from './MaterialExpense.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-material-expense',
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
  validateRequest(createMaterialExpenseValidationSchema),
  MaterialExpenseControllers.createMaterialExpense,
);
router.get(
  '/all-material-costs',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  MaterialExpenseControllers.getAllMaterialCosts,
);
router.get(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  MaterialExpenseControllers.getSingleMaterialExpense,
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
  validateRequest(updateMaterialExpenseValidationSchema),
  MaterialExpenseControllers.updateMaterialExpense,
);

router.delete(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  MaterialExpenseControllers.deleteMaterialExpense,
);

router.get(
  '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  MaterialExpenseControllers.getAllMaterialExpenses,
);


export const MaterialExpenseRoutes = router;
