import express from 'express';
import { AnalyticControllers } from './Analytic.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAnalyticValidationSchema, updateAnalyticValidationSchema } from './Analytic.validation';

const router = express.Router();

router.post(
  '/create-Analytic',
  validateRequest(createAnalyticValidationSchema),
  AnalyticControllers.createAnalytic,
);

// router.get(
//   '/:id/get-all-analytics-single-project',
//   AnalyticControllers.getAllAnalyticsSingleProject,
// );

router.get(
  '/single-project-analytics/:id',
  AnalyticControllers.getAllAnalyticsSingleProject,
);

router.get(
  '/get-all-analytics-combined',
  AnalyticControllers.getAllAnalyticsCombined,
);




router.patch(
  '/:id',
  validateRequest(updateAnalyticValidationSchema),
  AnalyticControllers.updateAnalytic,
);

router.delete(
  '/:id',
  AnalyticControllers.deleteAnalytic,
);



export const AnalyticRoutes = router;
