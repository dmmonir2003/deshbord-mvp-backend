/* eslint-disable no-unused-vars */
import { Model , Types} from 'mongoose';

export type TNote = {
  projectId: Types.ObjectId;
  clientId: Types.ObjectId;
  title: string;
  file: string;
  description?: string;
  date: string;
  value: number;
  clientComment: string;
  adminComment: string; 
  status: 'pending' | 'approved' | 'rejected';
  sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface NoteModel extends Model<TNote> {
  isNoteExists(id: string): Promise<TNote | null>;
}
