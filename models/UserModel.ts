import { model, Schema, Document } from 'mongoose';

export interface IUserModel {
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirmHash: string;
  confirmed?: boolean;
  location?: string;
  about?: string,
  website?: string,
}

type IUserModelDocument = IUserModel & Document;

const UserSchema = new Schema<IUserModelDocument>({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  fullname: {
    required: true,
    type: String,
  },
  username: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  confirmHash: {
    required: true,
    type: String,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  location: String,
  about: String,
  website: String,
});

export const UserModel = model<IUserModelDocument>('User', UserSchema);
