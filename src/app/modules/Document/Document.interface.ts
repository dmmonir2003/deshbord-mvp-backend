/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TDocument = {
  title: string;
  projectId: Types.ObjectId;
  isDeleted: boolean;
};

export interface DocumentModel extends Model<TDocument> {
  isDocumentExists(id: string): Promise<TDocument | null>;
}
