import express from 'express';
import { SecondFixFolderControllers } from './SecondFixFolder.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSecondFixFolderValidationSchema, updateSecondFixFolderValidationSchema } from './SecondFixFolder.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-second-fix-folder',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createSecondFixFolderValidationSchema),
  SecondFixFolderControllers.createSecondFixFolder,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.basicAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  SecondFixFolderControllers.getSingleSecondFixFolder,
);

router.patch(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateSecondFixFolderValidationSchema),
  SecondFixFolderControllers.updateSecondFixFolder,
);

router.delete(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  SecondFixFolderControllers.deleteSecondFixFolder,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.basicAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  SecondFixFolderControllers.getAllSecondFixFolders,
);

export const SecondFixFolderRoutes = router;
