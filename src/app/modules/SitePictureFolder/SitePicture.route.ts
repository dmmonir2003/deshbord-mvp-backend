import express from 'express';
import { SitePictureControllers } from './SitePicture.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSitePictureValidationSchema, updateSitePictureValidationSchema } from './SitePicture.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-site-picture',
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
  SitePictureControllers.getSingleSitePicture,
);

router.patch(
  '/:id',
  validateRequest(updateSitePictureValidationSchema),
  SitePictureControllers.updateSitePicture,
);

router.delete(
  '/:id',
  SitePictureControllers.deleteSitePicture,
);

router.get(
  '/',
  SitePictureControllers.getAllSitePictures,
);

export const SitePictureRoutes = router;
