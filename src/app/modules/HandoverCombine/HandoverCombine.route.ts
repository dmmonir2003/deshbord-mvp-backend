import express from 'express';
import { HandoverCombineControllers } from './HandoverCombine.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createHandoverCombineValidationSchema, updateHandoverCombineValidationSchema } from './HandoverCombine.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-handover-combine',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin,),
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
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  HandoverCombineControllers.getSingleHandoverCombine,
);

router.patch(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateHandoverCombineValidationSchema),
  HandoverCombineControllers.updateHandoverCombine,
);

router.delete(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  HandoverCombineControllers.deleteHandoverCombine,
);

router.get(
  '/',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  HandoverCombineControllers.getAllHandoverCombines,
);
router.get(
  '/:id/combine-data',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  HandoverCombineControllers.getAllHandoverCombinesData,
);

export const HandoverCombineRoutes = router;
