import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { IUserModel, UserModel } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';

passport.use(
  new LocalStrategy(
    async (username, password, done): Promise<void> => {
      try {
        const user = await UserModel
          .findOne({ $or: [{ email: username }, { username }] })
          .select("+password")
          .exec();

        if (!user) {
          return done(null, false);
        }

        if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
          console.log('user')
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    }),
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload: { data: IUserModel }, done) => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();
        if (user) {
          done(null, user);
          return;
        }

        done(null, false);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  UserModel.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

export { passport };
