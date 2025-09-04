import { Schema, model } from 'mongoose';
import { TProject, ProjectModel } from './Project.interface';

const ProjectSchema = new Schema<TProject, ProjectModel>(
  {
    projectName: { type: String, required: true },
    clientName: { type: String },
    clientEmail: { type: String },
    clientId: { type: Schema.Types.ObjectId, ref: 'User' }, // Adjust 'Client' to your actual model name
    description: { type: String },
    reference: { type: String},
    address: { type: String, required: true },
    contact: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    completedDate: { type: String, default: '' },
    contractFile: { type: String },
    value: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'completed', 'cancelled'],
      default: 'pending'
    },
    sharedWith: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['client', 'basicAdmin'], required: true },
      sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    }
  ],
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

ProjectSchema.statics.isProjectExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Project = model<TProject, ProjectModel>('Project', ProjectSchema);
