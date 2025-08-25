import { Schema, model } from 'mongoose';
import {
  THandoverCombine,
  HandoverCombineModel,
} from './HandoverCombine.interface';

const HandoverCombineSchema = new Schema<
  THandoverCombine,
  HandoverCombineModel
>({
  title: { type: String },
  files: { type: [String], required: true },
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
}, { timestamps: true });

HandoverCombineSchema.statics.isHandoverCombineExists = async function (
  id: string,
) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const HandoverCombine = model<THandoverCombine, HandoverCombineModel>(
  'HandoverCombine',
  HandoverCombineSchema,
);
