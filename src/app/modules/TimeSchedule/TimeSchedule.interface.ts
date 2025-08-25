/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TTimeSchedule = {
  title: string;
  file: string;
  startDate: Date;
  endDate: Date;
  description: string;
   projectId: Types.ObjectId;
       sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface TimeScheduleModel extends Model<TTimeSchedule> {
  isTimeScheduleExists(id: string): Promise<TTimeSchedule | null>;
}
