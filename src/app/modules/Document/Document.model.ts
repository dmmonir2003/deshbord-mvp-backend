import { Schema, model } from 'mongoose';
      import { TDocument, DocumentModel } from './Document.interface';
      
      const DocumentSchema = new Schema<TDocument, DocumentModel>({
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      DocumentSchema.statics.isDocumentExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const Document = model<TDocument, DocumentModel>('Document', DocumentSchema);
      