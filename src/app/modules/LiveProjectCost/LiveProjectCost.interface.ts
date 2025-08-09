/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TLiveProjectCost = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface LiveProjectCostModel extends Model<TLiveProjectCost> {
  isLiveProjectCostExists(id: string): Promise<TLiveProjectCost | null>;
}
 