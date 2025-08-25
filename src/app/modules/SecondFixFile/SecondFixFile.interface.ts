/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TSecondFixFile = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface SecondFixFileModel extends Model<TSecondFixFile> {
  isSecondFixFileExists(id: string): Promise<TSecondFixFile | null>;
}
