/* eslint-disable no-unused-vars */
import { Model , Types} from 'mongoose';

export type TSecondFixSubFolder = {
  title: string;
  secondFixFolderId: Types.ObjectId;
  projectId: Types.ObjectId;
  isDeleted: boolean;
};

export interface SecondFixSubFolderModel extends Model<TSecondFixSubFolder> {
  isSecondFixSubFolderExists(id: string): Promise<TSecondFixSubFolder | null>;
}
