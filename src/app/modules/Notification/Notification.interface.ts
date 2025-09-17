/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TNotification = {
  // title: 'quote' | 'callBooking';
  title: string;
  message: string;
  userFor?: Types.ObjectId[];
  readBy: Types.ObjectId[];
  projectId: Types.ObjectId;
};

export interface NotificationModel extends Model<TNotification> {
  isNotificationExists(id: string): Promise<TNotification | null>;
}
