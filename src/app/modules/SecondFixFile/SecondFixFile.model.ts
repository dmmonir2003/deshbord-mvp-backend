import { Schema, model } from 'mongoose';
import { TSecondFixFile, SecondFixFileModel } from './SecondFixFile.interface';

const SecondFixFileSchema = new Schema<TSecondFixFile, SecondFixFileModel>(
  {
    file: { type: String},
    room: { type: String },
    surface: { type: String },
    productCode: { type: String },
    suplierName: { type: String },
    text: { type: String },
    title: { type: String, required: true },
    secondFixSubFolder: {
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
  },
  { timestamps: true },
);

SecondFixFileSchema.statics.isSecondFixFileExists = async function (
  id: string,
) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const SecondFixFile = model<TSecondFixFile, SecondFixFileModel>(
  'SecondFixFile',
  SecondFixFileSchema,
);
