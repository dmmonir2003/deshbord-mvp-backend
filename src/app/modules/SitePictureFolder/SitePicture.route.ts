import express from 'express';
import { SitePictureControllers } from './SitePicture.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSitePictureValidationSchema, updateSitePictureValidationSchema } from './SitePicture.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-site-picture',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createSitePictureValidationSchema),
  SitePictureControllers.createSitePicture,
);


router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SitePictureControllers.shareSitePictureFolder
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SitePictureControllers.unShareSitePictureFolder
);

router.get(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SitePictureControllers.getSingleSitePicture,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateSitePictureValidationSchema),
  SitePictureControllers.updateSitePicture,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SitePictureControllers.deleteSitePicture,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SitePictureControllers.getAllSitePictures,
);

export const SitePictureRoutes = router;
