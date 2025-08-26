import { Schema, model } from 'mongoose';
import { TDocument, DocumentModel } from './Document.interface';

const DocumentSchema = new Schema<TDocument, DocumentModel>(
  {
    title: { type: String, required: true},
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

DocumentSchema.statics.isDocumentExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Document = model<TDocument, DocumentModel>(
  'Document',
  DocumentSchema,
);
