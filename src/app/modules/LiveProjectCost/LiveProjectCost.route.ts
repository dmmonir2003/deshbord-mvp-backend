import express from 'express';
import { LiveProjectCostControllers } from './LiveProjectCost.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createLiveProjectCostValidationSchema, updateLiveProjectCostValidationSchema } from './LiveProjectCost.validation';

const router = express.Router();

router.post(
  '/create-LiveProjectCost',
  validateRequest(createLiveProjectCostValidationSchema),
  LiveProjectCostControllers.createLiveProjectCost,
);

router.get(
  '/get-all-type-costs',
  LiveProjectCostControllers.getAllTypeLiveProjectCosts,
);

router.get(
  '/:id',
  LiveProjectCostControllers.getSingleLiveProjectCost,
);

router.patch(
  '/:id',
  validateRequest(updateLiveProjectCostValidationSchema),
  LiveProjectCostControllers.updateLiveProjectCost,
);

router.delete(
  '/:id',
  LiveProjectCostControllers.deleteLiveProjectCost,
);

router.get(
  '/',
  LiveProjectCostControllers.getAllLiveProjectCosts,
);


export const LiveProjectCostRoutes = router;
