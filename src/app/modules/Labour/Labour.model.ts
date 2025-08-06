import { Schema, model } from 'mongoose';
import { TLabour, LabourModel } from './Labour.interface';

const LabourSchema = new Schema<TLabour, LabourModel>({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  position: { type: String },
  dayRate: { type: Number, required: true },
  UtrNinAddress: { type: String, required: true },
  file: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

LabourSchema.statics.isLabourExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Labour = model<TLabour, LabourModel>('Labour', LabourSchema);
