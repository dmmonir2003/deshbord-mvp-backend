import { Schema, model } from 'mongoose';
import { TCertificate, CertificateModel } from './Certificate.interface';

const CertificateSchema = new Schema<TCertificate, CertificateModel>({
  file: { type: String, required: true },
  title: { type: String, required: true },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
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

CertificateSchema.statics.isCertificateExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Certificate = model<TCertificate, CertificateModel>(
  'Certificate',
  CertificateSchema,
);
