import { Schema, model } from 'mongoose';
      import { TDocumentSubfolder, DocumentSubfolderModel } from './DocumentSubfolder.interface';
      
      const DocumentSubfolderSchema = new Schema<TDocumentSubfolder, DocumentSubfolderModel>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      DocumentSubfolderSchema.statics.isDocumentSubfolderExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const DocumentSubfolder = model<TDocumentSubfolder, DocumentSubfolderModel>('DocumentSubfolder', DocumentSubfolderSchema);
      