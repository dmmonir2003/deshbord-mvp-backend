import express, { NextFunction, Request, Response } from 'express';
import { SitePictureImageControllers } from './SitePictureImage.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSitePictureImageValidationSchema, updateSitePictureImageValidationSchema } from './SitePictureImage.validation';
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-site-picture-image',
  // auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
   uploadFileS3(true).array('file', 5),
  //  uploadFileS3(true).single('file'),
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
  validateRequest(createSitePictureImageValidationSchema),
  SitePictureImageControllers.createSitePictureImage,
);

router.get(
  '/:id',
  SitePictureImageControllers.getSingleSitePictureImage,
);

router.patch(
  '/:id',
  uploadFileS3(true).array('file', 5),
  //  uploadFileS3(true).single('file'),
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
  validateRequest(updateSitePictureImageValidationSchema),
  SitePictureImageControllers.updateSitePictureImage,
);

router.delete(
  '/:id',
  SitePictureImageControllers.deleteSitePictureImage,
);

router.get(
  '/',
  SitePictureImageControllers.getAllSitePictureImages,
);

export const SitePictureImageRoutes = router;
