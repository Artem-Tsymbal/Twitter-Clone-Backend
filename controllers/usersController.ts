/* eslint-disable class-methods-use-this */
import express from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { UserModel, IUserModel, IUserModelDocument } from '../models/userModel';
import generateMD5 from '../utils/generateHash';
import sendEmail from '../utils/sendEmail';
import isValidObjectId from '../utils/isValidObjectId';

interface IUpdateMeData {
  avatar?: string;
  background?: string;
  fullName: string;
  biography: string;
}

class UsersController {
  async get(_req: express.Request, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();

      res.json({
        status: 'success',
        data: users,
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
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findById(userId).populate('tweets').exec();

      if (!user) {
        res.status(404).send();
        return;
      }

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async getMe(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as IUserModelDocument).toJSON() : undefined;

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async updateMe(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { _id: userId } = req.user as IUserModel;

      if (userId) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
        }

        const data: IUpdateMeData = {
          fullName: req.body.fullName,
          biography: req.body.biography,
        };

        if (req.body.avatar) {
          data.avatar = req.body.avatar;
        }

        if (req.body.background) {
          data.background = req.body.background;
        }

        UserModel.findByIdAndUpdate(userId, data, { new: true }, (error, user) => {
          if (error) res.send(error);

          res.status(201).json({
            status: 'success',
            data: user,
          });
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'error', errors: errors.array() });
        return;
      }

      const randomStr = Math.random().toString();
      const data: IUserModel = {
        email: req.body.email,
        username: req.body.username,
        fullName: req.body.fullName,
        password: generateMD5(req.body.password + process.env.SECRET_KEY),
        confirmHash: generateMD5(process.env.SECRET_KEY + randomStr || randomStr),
      };
      const user = await UserModel.create(data);

      sendEmail(
        {
          emailFrom: 'admin@twitter.com',
          emailTo: data.email,
          subject: 'Подтверждение почты Twitter Clone',
          html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:3000/user
          /activate/${data.confirmHash}">по этой ссылке</a>`,
        },
        (err: Error | null) => {
          if (err) {
            res.status(500).json({
              status: 'error',
              message: err,
            });
          } else {
            res.status(201).json({
              status: 'success',
              data: user,
            });
          }
        },
      );
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async verify(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { hash } = req.query;

      if (!hash) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findOne({ confirmHash: hash as string }).exec();

      if (user) {
        user.confirmed = true;
        user.save();

        res.json({
          status: 'success',
          data: {
            ...user.toJSON(),
            token: jwt.sign({ data: user.toJSON() }, process.env.SECRET_KEY || '345', {
              expiresIn: '14 days',
            }),
          },
        });
      } else {
        res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async giveOutJWT(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as IUserModelDocument).toJSON() : undefined;

      res.json({
        status: 'success',
        data: {
          user,
          token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || '345', {
            expiresIn: '14 days',
          }),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export default new UsersController();
