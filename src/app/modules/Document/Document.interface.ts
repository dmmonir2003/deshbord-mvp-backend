/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TDocument = {
  title: string;
  isDeleted: boolean;
};

export interface DocumentModel extends Model<TDocument> {
  isDocumentExists(id: string): Promise<TDocument | null>;
}
