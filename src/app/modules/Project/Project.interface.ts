/* eslint-disable no-unused-vars */
import { Model , Types} from 'mongoose';

export type TProject = {
  projectName: string;
  clientName?: string;
  clientEmail?: string;
  clientId?: Types.ObjectId;
  description: string;
  reference: string;
  address: string;
  contact: string;
  type: string;
  startDate: string;
  endDate: string;
  contractFile: string;
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  value: number;
  isDeleted: boolean;
};

export interface ProjectModel extends Model<TProject> {
  isProjectExists(id: string): Promise<TProject | null>;
}
