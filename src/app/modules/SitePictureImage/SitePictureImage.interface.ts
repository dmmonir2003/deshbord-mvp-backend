/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSitePictureImage = {
  file: string[];
  projectId: Types.ObjectId;
  sitePictureFolderId: Types.ObjectId;
  uploadDate: Date;
  isDeleted: boolean;
};

export interface SitePictureImageModel extends Model<TSitePictureImage> {
  isSitePictureImageExists(id: string): Promise<TSitePictureImage | null>;
}
