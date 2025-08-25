/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSecondFixFile = {
   file: string;
    title: string;
    secondFixSubFolder: Types.ObjectId;
    projectId: Types.ObjectId;
    sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface SecondFixFileModel extends Model<TSecondFixFile> {
  isSecondFixFileExists(id: string): Promise<TSecondFixFile | null>;
}
