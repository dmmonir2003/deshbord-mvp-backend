import express from 'express';
import { AnalyticControllers } from './Analytic.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAnalyticValidationSchema, updateAnalyticValidationSchema } from './Analytic.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-Analytic',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createAnalyticValidationSchema),
  AnalyticControllers.createAnalytic,
);

// router.get(
//   '/:id/get-all-analytics-single-project',
//   AnalyticControllers.getAllAnalyticsSingleProject,
// );

router.get(
  '/single-project-analytics/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  AnalyticControllers.getAllAnalyticsSingleProject,
);

router.get(
  '/get-all-analytics-combined',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  AnalyticControllers.getAllAnalyticsCombined,
);
router.get(
  '/get-analytics-profit-by-period',
  AnalyticControllers.getAllAnalyticProfitByPeriod,
);




router.patch(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateAnalyticValidationSchema),
  AnalyticControllers.updateAnalytic,
);

router.delete(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  AnalyticControllers.deleteAnalytic,
);



export const AnalyticRoutes = router;