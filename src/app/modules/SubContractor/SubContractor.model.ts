import { Schema, model } from 'mongoose';
      import { TSubContractor, SubContractorModel } from './SubContractor.interface';
      
      const SubContractorSchema = new Schema<TSubContractor, SubContractorModel>({
      type: { type: String },
  name: { type: String, required: true },
  days: { type: Number, required: true },
  vat: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  ratePerDay: { type: Number, required: true },
  file: { type: String },
  subContractorId: { type: Schema.Types.ObjectId, ref: 'Labour' },
  date: { type: String, default: new Date().toISOString() },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
      }, { timestamps: true });
      
      SubContractorSchema.statics.isSubContractorExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const SubContractor = model<TSubContractor, SubContractorModel>('SubContractor', SubContractorSchema);
      