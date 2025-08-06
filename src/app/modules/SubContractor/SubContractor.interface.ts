/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSubContractor = {
  type?: string;
    name: string;
    days: number;
    vat?: number;
    ratePerDay: number;
    amount: number;
    file?: string;
    subContractorId?: Types.ObjectId;
    date?: string;
    description?: string;
    isDeleted: boolean;
};

export interface SubContractorModel extends Model<TSubContractor> {
  isSubContractorExists(id: string): Promise<TSubContractor | null>;
}
