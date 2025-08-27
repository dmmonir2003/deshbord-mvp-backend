import { Schema, model } from 'mongoose';
import { TSiteReport, SiteReportModel } from './SiteReport.interface';

const SiteReportSchema = new Schema<TSiteReport, SiteReportModel>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  overviewText: { type: String, required: true },
  title: { type: String},
  overviewFile: { type: [String], required: true },
  weather: { type: [String], required: true },
  workingDays: { type: [String], required: true },
  LaborTeam: { type: [String], required: true },
  date: { type: Date, default: Date.now() },
  sharedWith: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['client', 'basicAdmin'], required: true },
      sharedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  isDeleted: { type: Boolean, default: false },
});

SiteReportSchema.statics.isSiteReportExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const SiteReport = model<TSiteReport, SiteReportModel>(
  'SiteReport',
  SiteReportSchema,
);
