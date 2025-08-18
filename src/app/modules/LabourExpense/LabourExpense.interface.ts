/* eslint-disable no-unused-vars */

import { Model, Types } from 'mongoose';

export type TLabourExpense = {
  type?: string;
  name: string;
  projectId: Types.ObjectId;
  days: number;
  vat?: number;
  amount: number;
  file?: string;
  labourId: Types.ObjectId;
  date?: string;
  description?: string;
  isDeleted: boolean;
};

export interface LabourExpenseModel extends Model<TLabourExpense> {
  isLabourExpenseExists(id: string): Promise<TLabourExpense | null>;
}
