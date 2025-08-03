import { Schema, model } from 'mongoose';
import { TInterim, InterimModel } from './Interim.interface';

const InterimSchema = new Schema<TInterim, InterimModel>({
  title: { type: String, required: true },
  file: { type: String },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  value: { type: Number, required: true },
  sharedWith: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['client', 'basicAdmin'], required: true },
      sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  isDeleted: { type: Boolean, default: false },
});

InterimSchema.statics.isInterimExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Interim = model<TInterim, InterimModel>('Interim', InterimSchema);
