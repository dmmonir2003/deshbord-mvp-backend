import express from 'express';
import { PrivacyControllers } from './Privacy.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createPrivacyValidationSchema, updatePrivacyValidationSchema } from './Privacy.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-privacy',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createPrivacyValidationSchema),
  PrivacyControllers.createPrivacy,
);

router.get(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  PrivacyControllers.getSinglePrivacy,
);

router.patch(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updatePrivacyValidationSchema),
  PrivacyControllers.updatePrivacy,
);

router.delete(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  PrivacyControllers.deletePrivacy,
);

router.get(
  '/',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  PrivacyControllers.getAllPrivacys,
);

export const PrivacyRoutes = router;
