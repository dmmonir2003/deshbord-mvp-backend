/* eslint-disable no-unused-vars */
import { Model , Types} from 'mongoose';

export type TQuote = {
  title: string;
  projectId: Types.ObjectId;
  file: string;
  value: number;
  isDeleted: boolean;
};

export interface QuoteModel extends Model<TQuote> {
  isQuoteExists(id: string): Promise<TQuote | null>;
}
