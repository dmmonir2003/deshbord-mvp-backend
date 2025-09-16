import { Schema, model } from 'mongoose';
import { TNote, NoteModel } from './Note.interface';

const NoteSchema = new Schema<TNote, NoteModel>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  file: { type: String },
  description: { type: String },
  date: { type: String, default: new Date().toISOString() }, // store date as string (could also use Date type if needed)
  value: { type: Number },
  clientComment: { type: String},
  adminComment: { type: String},
      status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
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

NoteSchema.statics.isNoteExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Note = model<TNote, NoteModel>('Note', NoteSchema);
