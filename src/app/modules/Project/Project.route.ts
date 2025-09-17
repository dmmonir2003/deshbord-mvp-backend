import express, { NextFunction, Request, Response } from 'express';
import { ProjectControllers } from './Project.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createProjectValidationSchema, updateProjectValidationSchema } from './Project.validation';
import auth from '../../middlewares/auth';
import { uploadFileS3 } from '../../utils/UploaderS3';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-project',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
    uploadFileS3(true).single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        next(error);
      }
    }
    next();
  },
  validateRequest(createProjectValidationSchema),
  ProjectControllers.createProject,
);
router.get(
  '/get-earning-of-month',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  ProjectControllers.getEarningForProjectsOfMonth,
);
router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  ProjectControllers.shareProject
);
router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  ProjectControllers.unShareProject
);
router.get(
  '/completed-ongoing',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  ProjectControllers.getAllProjectsWithoutPending,
);
router.get(
  '/:id',
  ProjectControllers.getSingleProject,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
    uploadFileS3(true).single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        next(error);
      }
    }
    next();
  },
  validateRequest(updateProjectValidationSchema),
  ProjectControllers.updateProject,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  ProjectControllers.deleteProject,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  ProjectControllers.getAllProjects,
);



export const ProjectRoutes = router;
