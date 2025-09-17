import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { QuoteServices } from './Quote.service';

const createQuote = catchAsync(async (req, res) => {
  const QuoteData= req.body;
  const result = await QuoteServices.createQuoteIntoDB(QuoteData, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote is created successfully',
    data: result,
  });
});

const lastQuote = catchAsync(async (req, res) => {
      const { id } = req.params;
  // const {sharedWith} = req.body;
  const result = await QuoteServices.lastQuoteIntoDB(id);
  // const result = await QuoteServices.lastQuoteIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const shareQuote = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {sharedWith} = req.body;
  const result = await QuoteServices.shareQuoteIntoDB(id, sharedWith, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});
const unShareQuote = catchAsync(async (req, res) => {
      const { id } = req.params;
  const {unShareWith } = req.body;
  const result = await QuoteServices.unShareQuoteIntoDB(id, unShareWith);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});


const getSingleQuote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuoteServices.getSingleQuoteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote is retrieved successfully',
    data: result,
  });
});

const getAllQuotes = catchAsync(async (req, res) => {
  const result = await QuoteServices.getAllQuotesFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotes are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getAllQuotesValue = catchAsync(async (req, res) => {
  const result = await QuoteServices.getAllQuotesValueFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotes are retrieved successfully',
    meta: result.meta,
    data: {totalValue:result.totalValue},
  });
});

const updateQuote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Quote = req.body;
  const result = await QuoteServices.updateQuoteIntoDB(id, Quote, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote is updated successfully',
    data: result,
  });
});

const deleteQuote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await QuoteServices.deleteQuoteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quote is deleted successfully',
    data: result,
  });
});

export const QuoteControllers = {
  createQuote,
  getSingleQuote,
  getAllQuotes,
  updateQuote,
  deleteQuote,
  shareQuote,
  unShareQuote, 
  lastQuote,
  getAllQuotesValue
};
