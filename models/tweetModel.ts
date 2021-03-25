import { model, Schema, Document } from 'mongoose';
import { IUserModelDocument } from './userModel';

export interface ITweetModel {
  _id?: string;
  text: string;
  user: IUserModelDocument | string;
  images?: string[];
  replyingTo?: string;
  replies?: string[];
  retweet?: string;
  retweets?: string[];
  likes: string[];
  isFavorite: boolean;
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
  replyingTo: {
    ref: 'Tweet',
    type: Schema.Types.ObjectId,
  },
  replies: [
    { ref: 'Tweet', type: Schema.Types.ObjectId },
  ],
  retweet: {
    ref: 'Tweet',
    type: Schema.Types.ObjectId,
  },
  retweets: [
    { ref: 'Tweet', type: Schema.Types.ObjectId },
  ],
  likes: [
    { ref: 'User', type: Schema.Types.ObjectId },
  ],
  isFavorite: {
    required: true,
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const TweetModel = model<ITweetModelDocument>('Tweet', TweetSchema);
