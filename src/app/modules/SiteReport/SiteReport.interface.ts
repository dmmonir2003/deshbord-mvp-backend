/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSiteReport = {
  overviewText: string;
  overviewFile: string;
  projectId: Types.ObjectId;
  date : Date;
  weather: string;
  workingDays: string;
  LaborTeam: string;
  isDeleted: boolean;
}; 

export interface SiteReportModel extends Model<TSiteReport> {
  isSiteReportExists(id: string): Promise<TSiteReport | null>;
}
