import { Schema, model } from 'mongoose';
import { TDocumentFile, DocumentFileModel } from './DocumentFile.interface';

const DocumentFileSchema = new Schema<TDocumentFile, DocumentFileModel>({
  file: { type: String, required: true },
  documentSubFolderId: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  sharedWith: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['client', 'basicAdmin'], required: true },
      sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  isDeleted: { type: Boolean, default: false },
});

DocumentFileSchema.statics.isDocumentFileExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const DocumentFile = model<TDocumentFile, DocumentFileModel>(
  'DocumentFile',
  DocumentFileSchema,
);
