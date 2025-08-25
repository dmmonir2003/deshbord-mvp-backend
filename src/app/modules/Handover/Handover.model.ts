import { Schema, model } from 'mongoose';
      import { THandover, HandoverModel } from './Handover.interface';
      
      const HandoverSchema = new Schema<THandover, HandoverModel>({
         file: { type: String, required: true },
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
      }, { timestamps: true });
      
      HandoverSchema.statics.isHandoverExists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const Handover = model<THandover, HandoverModel>('Handover', HandoverSchema);
      