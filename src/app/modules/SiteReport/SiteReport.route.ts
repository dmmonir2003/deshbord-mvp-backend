import express, { NextFunction, Request, Response } from 'express';
import { SiteReportControllers } from './SiteReport.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { createSiteReportValidationSchema, updateSiteReportValidationSchema } from './SiteReport.validation';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-site-report',
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
  // validateRequest(createSiteReportValidationSchema),
  SiteReportControllers.createSiteReport,
);

router.get(
  '/:id',
  SiteReportControllers.getSingleSiteReport,
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
  // validateRequest(updateSiteReportValidationSchema),
  SiteReportControllers.updateSiteReport,
);

router.delete(
  '/:id',
  SiteReportControllers.deleteSiteReport,
);

router.get(
  '/',
  SiteReportControllers.getAllSiteReports,
);

export const SiteReportRoutes = router;
