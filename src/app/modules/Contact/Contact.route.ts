import express from 'express';
import { ContactControllers } from './Contact.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createContactValidationSchema, updateContactValidationSchema } from './Contact.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-contact',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(createContactValidationSchema),
  ContactControllers.createContact,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  ContactControllers.getSingleContact,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  validateRequest(updateContactValidationSchema),
  ContactControllers.updateContact,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  ContactControllers.deleteContact,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin, USER_ROLE.client),
  ContactControllers.getAllContacts,
);

export const ContactRoutes = router;
