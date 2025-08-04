import { Schema, model } from 'mongoose';
import {
  TMaterialExpense,
  MaterialExpenseModel,
} from './MaterialExpense.interface';

const MaterialExpenseSchema = new Schema<
  TMaterialExpense,
  MaterialExpenseModel
>({
  type: { type: String },
  name: { type: String, required: true },
  vat: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  unit: { type: String, default: 0 },
  amount: { type: Number, required: true },
  file: { type: String },
  materialId: { type: Schema.Types.ObjectId, ref: 'Labour'},
  date: { type: String, default: new Date().toISOString() },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

MaterialExpenseSchema.statics.isMaterialExpenseExists = async function (
  id: string,
) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const MaterialExpense = model<TMaterialExpense, MaterialExpenseModel>(
  'MaterialExpense',
  MaterialExpenseSchema,
);
