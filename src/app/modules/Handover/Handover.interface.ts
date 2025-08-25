/* eslint-disable no-unused-vars */
import { Model , Types} from 'mongoose';

export type THandover = {
    file: string;
    title: string;
    projectId: Types.ObjectId;
    sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface HandoverModel extends Model<THandover> {
  isHandoverExists(id: string): Promise<THandover | null>;
}
