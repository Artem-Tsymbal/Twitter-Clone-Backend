import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { IUserModel, UserModel } from '../models/userModel';
import generateMD5 from '../utils/generateHash';

passport.use(
  new LocalStrategy(
    async (username, password, done): Promise<void> => {
      try {
        const user = await UserModel
          .findOne({ $or: [{ email: username }, { username }] })
          .select('+password')
          .exec();

        if (!user) {
          return done(null, false);
        }

        if (/*  user.confirmed && */ user.password === generateMD5(password + process.env.SECRET_KEY)) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY || '345',
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload: { data: IUserModel }, done): Promise<void> => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done): void => {
  done(null, user._id);
});

passport.deserializeUser((id: string, done): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserModel.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

export default passport;
