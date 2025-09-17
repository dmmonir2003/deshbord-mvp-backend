import { Schema, model } from 'mongoose';
import { TNotification, NotificationModel } from './Notification.interface';

const NotificationSchema = new Schema<TNotification, NotificationModel>({
  // type: { type: String, enum: ['quote', 'callBooking'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
 readBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
 userFor: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  projectId: {
    type: Schema.Types.ObjectId,
    // required: [true, 'Project id is required'],
    ref: 'Project',
  },
}, { timestamps: true });

NotificationSchema.statics.isNotificationExists = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Notification = model<TNotification, NotificationModel>(
  'Notification',
  NotificationSchema,
);
