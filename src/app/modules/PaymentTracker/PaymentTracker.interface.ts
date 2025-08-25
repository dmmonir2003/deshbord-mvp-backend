/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TPaymentTracker = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface PaymentTrackerModel extends Model<TPaymentTracker> {
  isPaymentTrackerExists(id: string): Promise<TPaymentTracker | null>;
}
