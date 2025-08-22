/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSitePicture = {
  title: string;
  projectId: Types.ObjectId;
  sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface SitePictureModel extends Model<TSitePicture> {
  isSitePictureExists(id: string): Promise<TSitePicture | null>;
}
