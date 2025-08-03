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
    auth(USER_ROLE.superAdmin,USER_ROLE.primeAdmin),
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
  '/:id',
  QuoteControllers.getSingleQuote,
);

router.patch(
  '/:id',
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
  QuoteControllers.deleteQuote,
);

router.get(
  '/',
  QuoteControllers.getAllQuotes,
);

export const QuoteRoutes = router;
