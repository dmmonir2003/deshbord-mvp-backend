import { Schema, model } from 'mongoose';
import { TSnagging, SnaggingModel } from './Snagging.interface';

const SnaggingSchema = new Schema<TSnagging, SnaggingModel>({
  title: { type: String, required: true },
  description: { type: String , required: true},
  file: { type: [String] , required: true},
  completeFile: { type: [String] },
  status: { type: Boolean, default: false },
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

SnaggingSchema.statics.isSnaggingExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Snagging = model<TSnagging, SnaggingModel>(
  'Snagging',
  SnaggingSchema,
);
