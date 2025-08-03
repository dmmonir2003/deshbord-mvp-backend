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
  const result = await QuoteServices.getAllQuotesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Quotes are retrieved successfully',
    meta: result.meta,
    data: result.result,
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
};
