/* eslint-disable class-methods-use-this */
import express from 'express';
import { validationResult } from 'express-validator';
import { ITweetModel, TweetModel } from '../models/tweetModel';
import { IUserModel, UserModel } from '../models/userModel';
import handlerId from '../utils/handlerId';
import isValidObjectId from '../utils/isValidObjectId';

class TweetsController {
  async get(_req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel
        .find({})
        .populate('user')
        .populate({ path: 'retweet', populate: { path: 'user' } })
        .populate({
          path: 'replyingTo', populate: [
            { path: 'user' },
            { path: 'retweet', populate: { path: 'user' } },
            { path: 'replyingTo', populate: { path: 'user' } },
          ],
        })
        .populate({
          path: 'replies', populate: [
            { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
          ],
        })
        .sort({ 'createdAt': '-1' })
        .exec();

      res.json({
        status: 'success',
        data: tweets,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async getById(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweetId = req.params.id;

      if (!isValidObjectId(tweetId)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetModel
        .findById(tweetId)
        .populate('user')
        .populate({ path: 'retweet', populate: { path: 'user' } })
        .populate({
          path: 'replyingTo', populate: [
            { path: 'user' },
            { path: 'retweet', populate: { path: 'user' } },
            { path: 'replyingTo', populate: { path: 'user' } },
          ],
        })
        .populate({
          path: 'replies', populate: [
            { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
          ],
        })
        .exec();

      if (!tweet) {
        res.status(404).send();
        return;
      }

      res.json({
        status: 'success',
        data: tweet,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async getFollowingUsers(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { followingUsers } = req.user as IUserModel;

      if (followingUsers) {
        const tweets = await TweetModel
          .find({ user: { $in: followingUsers } })
          .populate('user')
          .populate({ path: 'retweet', populate: { path: 'user' } })
          .populate({
            path: 'replyingTo', populate: [
              { path: 'user' },
              { path: 'retweet', populate: { path: 'user' } },
              { path: 'replyingTo', populate: { path: 'user' } },
            ],
          })
          .populate({
            path: 'replies', populate: [
              { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
            ],
          })
          .sort({ 'createdAt': '-1' })
          .exec();

        res.json({
          status: 'success',
          data: tweets,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async getFavorite(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res.status(400).send();
        return;
      }

      const user = await UserModel
        .findById(userId)
        .populate({
          path: 'favoriteTweets', populate: [
            { path: 'user' },
            { path: 'retweet', populate: { path: 'user' } },
            {
              path: 'replyingTo', populate: [
                { path: 'user' },
                { path: 'retweet', populate: { path: 'user' } },
                { path: 'replyingTo', populate: { path: 'user' } },
              ],
            },
            {
              path: 'replies', populate: [
                { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
              ],
            },
          ],
        })
        .exec();

      if (user) {
        res.json({
          status: 'success',
          data: user.favoriteTweets,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async getUserTweets(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetModel
        .find({ user: userId })
        .populate('user')
        .populate({ path: 'retweet', populate: { path: 'user' } })
        .populate({
          path: 'replyingTo', populate: [
            { path: 'user' },
            { path: 'retweet', populate: { path: 'user' } },
            { path: 'replyingTo', populate: { path: 'user' } },
          ],
        })
        .populate({
          path: 'replies', populate: [
            { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
          ],
        })
        .sort({ 'createdAt': '-1' })
        .exec();

      if (!tweet) {
        res.status(404).send();
        return;
      }

      res.json({
        status: 'success',
        data: tweet,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user?._id) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
          return;
        }

        const data: ITweetModel = {
          text: req.body.text,
          images: req.body.images,
          user: user._id,
          likes: [],
          isFavorite: false,
        };

        if (req.body.retweet) {
          data.retweet = req.body.retweet;
        }

        if (req.body.replyingTo) {
          data.replyingTo = req.body.replyingTo;
        }

        const tweet = await TweetModel.create(data);

        user.tweets?.push(tweet._id);

        if (req.body.retweet) {
          const retweet = await TweetModel.findById(req.body.retweet._id);
          if (retweet?.retweets) {
            retweet.retweets = handlerId.insertId(tweet._id, retweet.retweets);
            retweet.save();
          }
        }

        if (req.body.replyingTo) {
          const replyingTo = await TweetModel.findById(req.body.replyingTo._id);
          if (replyingTo?.replies) {
            replyingTo.replies = handlerId.insertId(tweet._id, replyingTo.replies);
            replyingTo.save();
          }
        }

        res.json({
          status: 'success',
          data: await tweet
            .populate('user')
            .populate({ path: 'retweet', populate: { path: 'user' } })
            .populate({
              path: 'replyingTo', populate: [
                { path: 'user' },
                { path: 'retweet', populate: { path: 'user' } },
                { path: 'replyingTo', populate: { path: 'user' } },
              ],
            })
            .populate({
              path: 'replies', populate: [
                { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
              ],
            })
            .execPopulate(),
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async update(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(400).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet && typeof tweet.user === 'object') {
          if (String(tweet.user._id) === String(user._id)) {
            const { text } = req.body;
            tweet.text = text;
            tweet.save();
            res.send();
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUserModel;

      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(400).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet && typeof tweet.user === 'object') {

          if (String(tweet.user._id) === String(user._id)) {

            if (tweet.retweet) {
              const retweet = await TweetModel.findById(tweet.retweet);
              if (retweet?.retweets) {
                const indexOfId = handlerId.searchId(retweet?.retweets, tweet.retweet.toString());
                retweet.retweets.splice(indexOfId, 1);
                retweet.save();
              }
            }

            if (tweet.replyingTo) {
              const replyingTo = await TweetModel.findById(tweet.replyingTo);
              if (replyingTo?.replies) {
                const indexOfId = handlerId.searchId(replyingTo.replies, tweet.replyingTo.toString());
                replyingTo.replies.splice(indexOfId, 1);
                replyingTo.save();
              }
            }

            tweet.remove();
            res.send();
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async like(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweetId = req.params.id;
      const { _id: userId } = req.user as IUserModel;

      if (!isValidObjectId(tweetId)) {
        res.status(400).send();
        return;
      }

      if (userId) {
        const user = await UserModel.findById(userId);

        if (user) {
          const indexOfId = handlerId.searchId(user.favoriteTweets, tweetId.toString());

          if (indexOfId === -1) {
            user.favoriteTweets = handlerId.insertId(tweetId, user.favoriteTweets);
          } else {
            user.favoriteTweets.splice(indexOfId, 1);
          }
          user.save();
        }

        const tweet = await TweetModel
          .findById(tweetId)
          .populate('user')
          .populate({ path: 'retweet', populate: { path: 'user' } })
          .populate({
            path: 'replyingTo', populate: [
              { path: 'user' },
              { path: 'retweet', populate: { path: 'user' } },
              { path: 'replyingTo', populate: { path: 'user' } },
            ],
          })
          .populate({
            path: 'replies', populate: [
              { path: 'user' }, { path: 'replyingTo', populate: { path: 'user' } },
            ],
          })
          .exec();

        if (tweet) {
          const indexOfId = handlerId.searchId(tweet.likes, userId.toString());

          if (indexOfId === -1) {
            tweet.likes = handlerId.insertId(userId, tweet.likes);
            tweet.isFavorite = true;
          } else {
            tweet.likes.splice(indexOfId, 1);
            tweet.isFavorite = false;
          }
          tweet.save();

          res.json({
            status: 'success',
            data: tweet,
          });
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export default new TweetsController();
