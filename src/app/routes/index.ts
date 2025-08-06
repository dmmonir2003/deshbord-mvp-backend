import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { OtpRoutes } from '../modules/Otp/otp.route';
import { AboutUsRoutes } from '../modules/AboutUs/AboutUs.route';
import { PrivacyRoutes } from '../modules/Privacy/Privacy.route';
import { TermRoutes } from '../modules/Term/Term.route';
import { ContactRoutes } from '../modules/Contact/Contact.route';
import { NotificationRoutes } from '../modules/Notification/Notification.route';
import { ProjectRoutes } from '../modules/Project/Project.route';
import { AnalyticRoutes } from '../modules/Analytic/Analytic.route';
import { QuoteRoutes } from '../modules/Quote/Quote.route';
import { InterimRoutes } from '../modules/Interim/Interim.route';
import { LabourRoutes } from '../modules/Labour/Labour.route';
import { LabourExpenseRoutes } from '../modules/LabourExpense/LabourExpense.route';
import { MaterialExpenseRoutes } from '../modules/MaterialExpense/MaterialExpense.route';
import { SubContractorRoutes } from '../modules/SubContractor/SubContractor.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/projects',
    route: ProjectRoutes, // Assuming you have a ProjectRoutes defined  
  },
  {
    path: '/otps',
    route: OtpRoutes,
  },
  {
    path: '/abouts',
    route: AboutUsRoutes,
  },
  {
    path: '/privacies',
    route: PrivacyRoutes,
  },
  {
    path: '/terms',
    route: TermRoutes,
  },
  {
    path: '/contacts',
    route: ContactRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticRoutes,
  },
  {
    path: '/quotes',
    route: QuoteRoutes, // Assuming you have a QuoteRoutes defined
  },
  {
    path: '/interims',
    route: InterimRoutes,
  },
  {
    path: '/labours',
    route: LabourRoutes, 
  },
  {
    path: '/labour-expenses',
    route: LabourExpenseRoutes, 
  },
  {
    path: '/material-expenses',
    route: MaterialExpenseRoutes, 
  },
  {
    path: '/sub-contractor-expenses',
    route: SubContractorRoutes, 
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
