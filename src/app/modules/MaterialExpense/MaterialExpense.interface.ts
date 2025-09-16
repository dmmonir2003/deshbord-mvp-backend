/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TMaterialExpense = {
    type?: string;
    name: string;
    projectId: Types.ObjectId;
    quantity?: number;
    // unit?: number;
    unitPrice?: number;
    vat?: number;
    amount: number;
    file?: string;
    materialId?: Types.ObjectId;
    date?: string;
    description?: string;
    isDeleted: boolean;
};

export interface MaterialExpenseModel extends Model<TMaterialExpense> {
  isMaterialExpenseExists(id: string): Promise<TMaterialExpense | null>;
}
