import express from 'express';
import { LiveProjectCostControllers } from './LiveProjectCost.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createLiveProjectCostValidationSchema, updateLiveProjectCostValidationSchema } from './LiveProjectCost.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-LiveProjectCost',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createLiveProjectCostValidationSchema),
  LiveProjectCostControllers.createLiveProjectCost,
);

router.get(
  '/get-all-type-costs',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  LiveProjectCostControllers.getAllTypeLiveProjectCosts,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  LiveProjectCostControllers.getSingleLiveProjectCost,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateLiveProjectCostValidationSchema),
  LiveProjectCostControllers.updateLiveProjectCost,
);

router.delete(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  LiveProjectCostControllers.deleteLiveProjectCost,
);

router.get(
  '/',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  LiveProjectCostControllers.getAllLiveProjectCosts,
);


export const LiveProjectCostRoutes = router;
