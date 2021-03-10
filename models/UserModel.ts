import { model, Schema, Document } from 'mongoose';

export interface IUserModel {
  _id?: string;
  email: string;
  fullName: string;
  username: string;
  password: string;
  confirmHash: string;
  confirmed?: boolean;
  biography?: string;
  avatar?: string;
  background?: string;
  tweets?: string[];
}

export type IUserModelDocument = IUserModel & Document;

const UserSchema = new Schema<IUserModelDocument>({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  fullName: {
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
    select: false,
  },
  confirmHash: {
    required: true,
    type: String,
    select: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  biography: String,
  avatar: String,
  background: String,
  tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
}, {
  timestamps: true,
});

UserSchema.set('toJSON', {
  transform: (_: never, obj: { password?: string; confirmHash?: string; }) => {
    const temp = obj;
    delete temp.password;
    delete temp.confirmHash;
    return temp;
  },
});

export const UserModel = model<IUserModelDocument>('User', UserSchema);
