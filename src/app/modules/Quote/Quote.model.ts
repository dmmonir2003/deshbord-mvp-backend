import { Schema, model } from 'mongoose';
      import { TQuote, QuoteModel } from './Quote.interface';
      
      const QuoteSchema = new Schema<TQuote, QuoteModel>({
        title: { type: String, required: true },
        file: { type: String, required: true },
        projectId: { 
            type: Schema.Types.ObjectId,
            ref: 'Project',
         },
        value: { type: Number, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      QuoteSchema.statics.isQuoteExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const Quote = model<TQuote, QuoteModel>('Quote', QuoteSchema);
      