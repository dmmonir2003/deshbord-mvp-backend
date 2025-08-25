import express, { NextFunction, Request, Response } from 'express';
import { SiteReportControllers } from './SiteReport.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSiteReportValidationSchema, updateSiteReportValidationSchema } from './SiteReport.validation';
import { uploadFileS3 } from '../../utils/UploaderS3';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-site-report',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),

  // uploadFileS3(true).array('file', 5),
     uploadFileS3(true).fields([
  { name: 'overviewFile', maxCount: 5 },
  { name: 'weather', maxCount: 5 },
  { name: 'workingDays', maxCount: 5 },
  { name: 'LaborTeam', maxCount: 5 },
]),
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
  validateRequest(createSiteReportValidationSchema),
  SiteReportControllers.createSiteReport,
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SiteReportControllers.shareSiteReport
);

router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SiteReportControllers.unShareSiteReport
);


router.get(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin,  USER_ROLE.client, USER_ROLE.basicAdmin),
  SiteReportControllers.getSingleSiteReport,
);

router.patch(
  '/:id',
      auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
     uploadFileS3(true).fields([
  { name: 'overviewFile', maxCount: 5 },
  { name: 'weather', maxCount: 5 },
  { name: 'workingDays', maxCount: 5 },
  { name: 'LaborTeam', maxCount: 5 },
]),
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
  validateRequest(updateSiteReportValidationSchema),
  SiteReportControllers.updateSiteReport,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  SiteReportControllers.deleteSiteReport,
);

router.get(
  '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin,  USER_ROLE.client, USER_ROLE.basicAdmin),
  SiteReportControllers.getAllSiteReports,
);

export const SiteReportRoutes = router;
