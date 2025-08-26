import { Schema, model } from 'mongoose';
import { TSitePicture, SitePictureModel } from './SitePicture.interface';

const SitePictureSchema = new Schema<TSitePicture, SitePictureModel>({
  title: { type: String, required: true },
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

SitePictureSchema.statics.isSitePictureExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const SitePictureFolder = model<TSitePicture, SitePictureModel>(
  'SitePictureFolder',
  SitePictureSchema,
);
