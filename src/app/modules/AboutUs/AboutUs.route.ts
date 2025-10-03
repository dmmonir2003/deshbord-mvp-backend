import express from 'express';
import { AboutUsControllers } from './AboutUs.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAboutUsValidationSchema, updateAboutUsValidationSchema } from './AboutUs.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-about',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createAboutUsValidationSchema),
  AboutUsControllers.createAboutUs,
);

router.get(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  AboutUsControllers.getSingleAboutUs,
);

router.patch(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateAboutUsValidationSchema),
  AboutUsControllers.updateAboutUs,
);

router.delete(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  AboutUsControllers.deleteAboutUs,
);

router.get(
  '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  AboutUsControllers.getAllAboutUss,
);

export const AboutUsRoutes = router;
