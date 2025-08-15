/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { PAYMENTTRACKER_SEARCHABLE_FIELDS } from './PaymentTracker.constant';
import mongoose from 'mongoose';
import { TPaymentTracker } from './PaymentTracker.interface';
import { PaymentTracker } from './PaymentTracker.model';
import { User } from '../User/user.model';
import { QuoteServices } from '../Quote/Quote.service';
import { InterimServices } from '../Interim/Interim.service';

const createPaymentTrackerIntoDB = async (
  payload: TPaymentTracker,
) => {
  const result = await PaymentTracker.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create PaymentTracker');
  }

  return result;
};

const getAllPaymentTrackersFromDB = async (query: Record<string, unknown>) => {
  const PaymentTrackerQuery = new QueryBuilder(
    PaymentTracker.find(),
    query,
  )
    .search(PAYMENTTRACKER_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentTrackerQuery.modelQuery;
  const meta = await PaymentTrackerQuery.countTotal();
  return {
    result,
    meta,
  };
};
const getAllPaymentTrackerElementsFromDB = async ( query: Record<string, unknown>, user?: any) => {
  
        console.log('query',query);
        console.log('user',user);

        console.log('query?.projectId',query?.projectId);

  if( user?.role === 'client' || user?.role === 'basicAdmin'  ) {
    const { userEmail } = user;
    const userId = await User.isUserExistsByCustomEmail(userEmail).then(
      (user: any) => user?._id
    );
   
    console.log('userId', userId);

 
  }else{
      //  const totalInterimValue = 0;
       const lastQuote = await QuoteServices.lastQuoteIntoDB(query?.projectId as any);
       const allInterims = await InterimServices.getAllInterimsFromDB(query, user);


        const totalInterimValue = allInterims.result.map((interim:any) => interim.value).reduce((acc, interim) => acc + interim, 0);
        // const totalInterimValue = allInterims.reduce((acc, interim) => acc + interim.interimValue, 0);
      //  console.log('lastQuote',lastQuote);
       console.log('allInterims',allInterims.result);
       console.log('totalInterimValue',totalInterimValue);

       const paymentTrackerdata = {
           quote:lastQuote,
           interims:allInterims.result,
           outStanding: lastQuote?.value ? (lastQuote?.value - totalInterimValue) : 0,
           profit: totalInterimValue
       }

       console.log('paymentTrackerdata',paymentTrackerdata);
       return paymentTrackerdata
}
}
const getSinglePaymentTrackerFromDB = async (id: string) => {
  const result = await PaymentTracker.findById(id);

  return result;
};

const updatePaymentTrackerIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('paymenttrackers')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('PaymentTracker not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted PaymentTracker');
  }

  const updatedData = await PaymentTracker.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('PaymentTracker not found after update');
  }

  return updatedData;
};

const deletePaymentTrackerFromDB = async (id: string) => {
  const deletedService = await PaymentTracker.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete PaymentTracker');
  }

  return deletedService;
};

export const PaymentTrackerServices = {
  createPaymentTrackerIntoDB,
  getAllPaymentTrackersFromDB,
  getSinglePaymentTrackerFromDB,
  updatePaymentTrackerIntoDB,
  deletePaymentTrackerFromDB,
  getAllPaymentTrackerElementsFromDB
};
