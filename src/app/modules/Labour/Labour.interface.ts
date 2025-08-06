/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TLabour = {
  name: string;
  description?: string;
  address?: string;
  position: string;
  dayRate: number;
  UtrNinAddress: string;
  file: string;
  isDeleted: boolean;
};

export interface LabourModel extends Model<TLabour> {
  isLabourExists(id: string): Promise<TLabour | null>;
}
