import express from 'express';
import { PaymentTrackerControllers } from './PaymentTracker.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createPaymentTrackerValidationSchema, updatePaymentTrackerValidationSchema } from './PaymentTracker.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-payment-tracker',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createPaymentTrackerValidationSchema),
  PaymentTrackerControllers.createPaymentTracker,
);

router.get(
  '/all-element',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  PaymentTrackerControllers.getAllPaymentTrackerElements,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  PaymentTrackerControllers.getSinglePaymentTracker,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updatePaymentTrackerValidationSchema),
  PaymentTrackerControllers.updatePaymentTracker,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  PaymentTrackerControllers.deletePaymentTracker,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  PaymentTrackerControllers.getAllPaymentTrackers,
);


export const PaymentTrackerRoutes = router;
