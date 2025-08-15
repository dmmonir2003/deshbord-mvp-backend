import express from 'express';
import { PaymentTrackerControllers } from './PaymentTracker.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createPaymentTrackerValidationSchema, updatePaymentTrackerValidationSchema } from './PaymentTracker.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-payment-tracker',
  validateRequest(createPaymentTrackerValidationSchema),
  PaymentTrackerControllers.createPaymentTracker,
);

router.get(
  '/all-element',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  PaymentTrackerControllers.getAllPaymentTrackerElements,
);

router.get(
  '/:id',
  PaymentTrackerControllers.getSinglePaymentTracker,
);

router.patch(
  '/:id',
  validateRequest(updatePaymentTrackerValidationSchema),
  PaymentTrackerControllers.updatePaymentTracker,
);

router.delete(
  '/:id',
  PaymentTrackerControllers.deletePaymentTracker,
);

router.get(
  '/',
  PaymentTrackerControllers.getAllPaymentTrackers,
);


export const PaymentTrackerRoutes = router;
