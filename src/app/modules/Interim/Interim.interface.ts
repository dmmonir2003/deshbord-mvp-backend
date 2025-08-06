/* eslint-disable no-unused-vars */
import { Model, Types} from 'mongoose';

export type TInterim = {
  title: string;
  projectId: Types.ObjectId;
  file?: string;
  value: number;
    sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface InterimModel extends Model<TInterim> {
  isInterimExists(id: string): Promise<TInterim | null>;
}
