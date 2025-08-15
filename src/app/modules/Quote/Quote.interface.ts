/* eslint-disable no-unused-vars */
import { Model , Types} from 'mongoose';

export type TQuote = {
  title: string;
  projectId: Types.ObjectId;
  noteId?: Types.ObjectId;
  file: string;
  value: number;
  sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface QuoteModel extends Model<TQuote> {
  isQuoteExists(id: string): Promise<TQuote | null>;
}
