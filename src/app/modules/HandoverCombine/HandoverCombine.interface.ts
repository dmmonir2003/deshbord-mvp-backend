/* eslint-disable no-unused-vars */
import { Model, Types} from 'mongoose';

export type THandoverCombine = {
   title?: string;
   files: string[];
    projectId: Types.ObjectId;
    sharedWith?: {
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface HandoverCombineModel extends Model<THandoverCombine> {
  isHandoverCombineExists(id: string): Promise<THandoverCombine | null>;
}
