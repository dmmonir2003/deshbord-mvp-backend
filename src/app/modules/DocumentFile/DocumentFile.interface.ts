/* eslint-disable no-unused-vars */
import { Model, Types} from 'mongoose';

export type TDocumentFile = {
    file: string;
    documentSubFolderId: Types.ObjectId;
    projectId: Types.ObjectId;
    sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface DocumentFileModel extends Model<TDocumentFile> {
  isDocumentFileExists(id: string): Promise<TDocumentFile | null>;
}
