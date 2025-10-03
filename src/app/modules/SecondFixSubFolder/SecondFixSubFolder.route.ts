import express from 'express';
import { SecondFixSubFolderControllers } from './SecondFixSubFolder.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSecondFixSubFolderValidationSchema, updateSecondFixSubFolderValidationSchema } from './SecondFixSubFolder.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-sub-second-fix-folder',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createSecondFixSubFolderValidationSchema),
  SecondFixSubFolderControllers.createSecondFixSubFolder,
);

router.get(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SecondFixSubFolderControllers.getSingleSecondFixSubFolder,
);

router.patch(
  '/:id',
     auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateSecondFixSubFolderValidationSchema),
  SecondFixSubFolderControllers.updateSecondFixSubFolder,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SecondFixSubFolderControllers.deleteSecondFixSubFolder,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  SecondFixSubFolderControllers.getAllSecondFixSubFolders,
);

export const SecondFixSubFolderRoutes = router;
