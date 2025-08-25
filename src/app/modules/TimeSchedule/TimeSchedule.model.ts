import { Schema, model } from 'mongoose';
import { TTimeSchedule, TimeScheduleModel } from './TimeSchedule.interface';

const TimeScheduleSchema = new Schema<TTimeSchedule, TimeScheduleModel>({
  title: { type: String, required: true },
  file: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
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
});

TimeScheduleSchema.statics.isTimeScheduleExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const TimeSchedule = model<TTimeSchedule, TimeScheduleModel>(
  'TimeSchedule',
  TimeScheduleSchema,
);
