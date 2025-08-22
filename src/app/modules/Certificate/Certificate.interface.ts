/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TCertificate = {
  file: string;
  title: string;
  projectId: Types.ObjectId;
  sharedWith?: {
    userId: Types.ObjectId;
    role: 'client' | 'basicAdmin';
    sharedBy: Types.ObjectId;
  }[];
  isDeleted: boolean;
};

export interface CertificateModel extends Model<TCertificate> {
  isCertificateExists(id: string): Promise<TCertificate | null>;
}
