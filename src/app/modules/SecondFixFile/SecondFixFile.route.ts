import express from 'express';
import { SecondFixFileControllers } from './SecondFixFile.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSecondFixFileValidationSchema, updateSecondFixFileValidationSchema } from './SecondFixFile.validation';

const router = express.Router();

router.post(
  '/create-SecondFixFile',
  validateRequest(createSecondFixFileValidationSchema),
  SecondFixFileControllers.createSecondFixFile,
);

router.get(
  '/:id',
  SecondFixFileControllers.getSingleSecondFixFile,
);

router.patch(
  '/:id',
  validateRequest(updateSecondFixFileValidationSchema),
  SecondFixFileControllers.updateSecondFixFile,
);

router.delete(
  '/:id',
  SecondFixFileControllers.deleteSecondFixFile,
);

router.get(
  '/',
  SecondFixFileControllers.getAllSecondFixFiles,
);

export const SecondFixFileRoutes = router;
