import { Schema, model } from 'mongoose';
import {
  TDocumentSubfolder,
  DocumentSubfolderModel,
} from './DocumentSubfolder.interface';

const DocumentSubfolderSchema = new Schema<
  TDocumentSubfolder,
  DocumentSubfolderModel
>({
  title: { type: String, required: true, unique: true },
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
});

DocumentSubfolderSchema.statics.isDocumentSubfolderExists = async function (
  id: string,
) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const DocumentSubfolder = model<
  TDocumentSubfolder,
  DocumentSubfolderModel
>('DocumentSubfolder', DocumentSubfolderSchema);
