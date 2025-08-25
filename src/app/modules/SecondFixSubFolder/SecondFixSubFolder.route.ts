import express from 'express';
import { SecondFixSubFolderControllers } from './SecondFixSubFolder.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSecondFixSubFolderValidationSchema, updateSecondFixSubFolderValidationSchema } from './SecondFixSubFolder.validation';

const router = express.Router();

router.post(
  '/create-sub-second-fix-folder',
  validateRequest(createSecondFixSubFolderValidationSchema),
  SecondFixSubFolderControllers.createSecondFixSubFolder,
);

router.get(
  '/:id',
  SecondFixSubFolderControllers.getSingleSecondFixSubFolder,
);

router.patch(
  '/:id',
  validateRequest(updateSecondFixSubFolderValidationSchema),
  SecondFixSubFolderControllers.updateSecondFixSubFolder,
);

router.delete(
  '/:id',
  SecondFixSubFolderControllers.deleteSecondFixSubFolder,
);

router.get(
  '/',
  SecondFixSubFolderControllers.getAllSecondFixSubFolders,
);

export const SecondFixSubFolderRoutes = router;
