import { Schema, model } from 'mongoose';
import { TQuote, QuoteModel } from './Quote.interface';

const QuoteSchema = new Schema<TQuote, QuoteModel>({
  title: { type: String, required: true },
  file: { type: String },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
  value: { type: Number, required: true },
  sharedWith: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['client', 'basicAdmin'], required: true },
      sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

QuoteSchema.statics.isQuoteExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Quote = model<TQuote, QuoteModel>('Quote', QuoteSchema);
