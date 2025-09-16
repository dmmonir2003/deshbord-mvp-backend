import { Schema, model } from 'mongoose';
import { TLabourExpense, LabourExpenseModel } from './LabourExpense.interface';

const LabourExpenseSchema = new Schema<TLabourExpense, LabourExpenseModel>({
  type: { type: String },
  name: { type: String, required: true },
  days: { type: Number, required: true },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  // vat: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  file: { type: String },
  labourId: { type: Schema.Types.ObjectId, ref: 'Labour', required: true },
  date: { type: String, default: new Date().toISOString() },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

LabourExpenseSchema.statics.isLabourExpenseExists = async function (
  id: string,
) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const LabourExpense = model<TLabourExpense, LabourExpenseModel>(
  'LabourExpense',
  LabourExpenseSchema,
);
