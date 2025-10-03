import express from 'express';
import { NotificationControllers } from './Notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-Notification',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  NotificationControllers.createNotification,
);


router.patch(
  '/mark-all-as-read',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  NotificationControllers.markNotificationsAsRead,
);

router.patch(
  '/:id/read',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  NotificationControllers.markNotificationAsRead,
);

router.get(
  '/unread',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  NotificationControllers.getAllUnreadNotifications,
);




export const NotificationRoutes = router;
