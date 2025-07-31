/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  // [x: string]: any;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  subscriberId?: Types.ObjectId;
  password: string;
  passwordChangedAt?: Date;
  contactNo: string;
  profileImg?: string;
  otpVerified: boolean;
  propertyAddress?: string;
  propertyPostCode?: string;
  role: 'client' | 'superAdmin' | 'admin' | 'subscriber';
  status?: 'contacted' | 'interested' | 'agreed' | 'notInterested';
  isDeleted: boolean;
}
export interface UserModel extends Model<TUser> {
  // Static methods for checking if the user exists
    // isUserExistsByCustomEmail(email: string): Promise<TUser>;
  isUserExistsByCustomEmail(email: string): Promise<TUser | null>;

  // Static method for password comparison
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  // Static method to check JWT issuance timing
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
