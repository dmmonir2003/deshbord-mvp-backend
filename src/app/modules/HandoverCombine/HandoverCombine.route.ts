import express from 'express';
import { HandoverCombineControllers } from './HandoverCombine.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createHandoverCombineValidationSchema, updateHandoverCombineValidationSchema } from './HandoverCombine.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-handover-combine',
  validateRequest(createHandoverCombineValidationSchema),
  HandoverCombineControllers.createHandoverCombine,
);


router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  HandoverCombineControllers.shareHandoverCombine
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  HandoverCombineControllers.unShareHandoverCombine
);

router.get(
  '/:id',
  HandoverCombineControllers.getSingleHandoverCombine,
);

router.patch(
  '/:id',
  validateRequest(updateHandoverCombineValidationSchema),
  HandoverCombineControllers.updateHandoverCombine,
);

router.delete(
  '/:id',
  HandoverCombineControllers.deleteHandoverCombine,
);

router.get(
  '/',
  HandoverCombineControllers.getAllHandoverCombines,
);
router.get(
  '/:id/combine-data',
  HandoverCombineControllers.getAllHandoverCombinesData,
);

export const HandoverCombineRoutes = router;
