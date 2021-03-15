import { model, Schema, Document } from 'mongoose';
import { IUserModelDocument } from './userModel';

export interface ITweetModel {
  _id?: string;
  text: string;
  user: IUserModelDocument | string;
  images?: string[];
  retweet?: string;
  likes: string[];
  favorite: boolean;
}

export type ITweetModelDocument = ITweetModel & Document;

const TweetSchema = new Schema<ITweetModelDocument>({
  text: {
    required: true,
    type: String,
    maxlength: 280,
  },
  user: {
    required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  images: [
    {
      type: String,
    },
  ],
  retweet: {
    ref: 'Tweet',
    type: Schema.Types.ObjectId,
  },
  likes: [
    { ref: 'User', type: Schema.Types.ObjectId },
  ],
  favorite: {
    required: true,
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const TweetModel = model<ITweetModelDocument>('Tweet', TweetSchema);
