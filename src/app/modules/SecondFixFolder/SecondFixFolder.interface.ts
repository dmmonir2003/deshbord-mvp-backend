/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TSecondFixFolder = {
  title: string;
  projectId: Types.ObjectId;
  isDeleted: boolean;
};

export interface SecondFixFolderModel extends Model<TSecondFixFolder> {
  isSecondFixFolderExists(id: string): Promise<TSecondFixFolder | null>;
}
