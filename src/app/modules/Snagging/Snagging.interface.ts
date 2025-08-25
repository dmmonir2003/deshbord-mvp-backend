/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSnagging = {
  title: string;
  projectId: Types.ObjectId;
  description: string;
  file: string[];
  completeFile?: string[];
  status: boolean;
    sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface SnaggingModel extends Model<TSnagging> {
  isSnaggingExists(id: string): Promise<TSnagging | null>;
}
