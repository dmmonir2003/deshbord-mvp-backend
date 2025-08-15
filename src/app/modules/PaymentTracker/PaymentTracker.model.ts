import { Schema, model } from 'mongoose';
      import { TPaymentTracker, PaymentTrackerModel } from './PaymentTracker.interface';
      
      const PaymentTrackerSchema = new Schema<TPaymentTracker, PaymentTrackerModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      PaymentTrackerSchema.statics.isPaymentTrackerExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const PaymentTracker = model<TPaymentTracker, PaymentTrackerModel>('PaymentTracker', PaymentTrackerSchema);
      