import express, { NextFunction, Request, Response } from 'express';
import { QuoteControllers } from './Quote.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createQuoteValidationSchema, updateQuoteValidationSchema } from './Quote.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { uploadFileS3 } from '../../utils/UploaderS3';

const router = express.Router();

router.post(
  '/create-quote',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
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
  validateRequest(createQuoteValidationSchema),
  QuoteControllers.createQuote,
);

router.get(
  '/get-all-quote-value',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  QuoteControllers.getAllQuotesValue,
);

router.get(
  '/:id/last-quote',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  QuoteControllers.lastQuote
);

router.post(
  '/:id/share',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  QuoteControllers.shareQuote
);
router.post(
  '/:id/unshare',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin),
  QuoteControllers.unShareQuote
);


router.get(
  '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  QuoteControllers.getSingleQuote,
);

router.patch(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
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
  validateRequest(updateQuoteValidationSchema),
  QuoteControllers.updateQuote,
);

router.delete(
  '/:id',
   auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.basicAdmin),
  QuoteControllers.deleteQuote,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.primeAdmin, USER_ROLE.client, USER_ROLE.basicAdmin),
  QuoteControllers.getAllQuotes,
);


export const QuoteRoutes = router;
