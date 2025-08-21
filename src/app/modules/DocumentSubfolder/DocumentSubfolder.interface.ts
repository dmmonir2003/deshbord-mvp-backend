/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TDocumentSubfolder = {
  title: string;
  documentId: Types.ObjectId;
  isDeleted: boolean;
};

export interface DocumentSubfolderModel extends Model<TDocumentSubfolder> {
  isDocumentSubfolderExists(id: string): Promise<TDocumentSubfolder | null>;
}
