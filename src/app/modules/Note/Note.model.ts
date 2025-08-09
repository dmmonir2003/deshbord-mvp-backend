import { Schema, model } from 'mongoose';
import { TNote, NoteModel } from './Note.interface';

const NoteSchema = new Schema<TNote, NoteModel>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true },
  description: { type: String },
  date: { type: String, default: new Date().toISOString() }, // store date as string (could also use Date type if needed)
  value: { type: Number, required: true },
  clientComment: { type: String, required: true },
  adminComment: { type: String, required: true },
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
