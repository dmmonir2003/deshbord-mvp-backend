import express, { NextFunction, Request, Response } from 'express';
import { SubContractorControllers } from './SubContractor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSubContractorValidationSchema, updateSubContractorValidationSchema } from './SubContractor.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-sub-contractor-expense',
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
  validateRequest(createSubContractorValidationSchema),
  SubContractorControllers.createSubContractor,
);

router.get(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SubContractorControllers.getSingleSubContractor,
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
  validateRequest(updateSubContractorValidationSchema),
  SubContractorControllers.updateSubContractor,
);

router.delete(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SubContractorControllers.deleteSubContractor,
);

router.get(
  '/',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SubContractorControllers.getAllSubContractors,
);

export const SubContractorRoutes = router;
