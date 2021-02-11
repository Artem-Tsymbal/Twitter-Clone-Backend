/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import './core/db';
import express from 'express';
import userController from './controllers/userController';
import tweetController from './controllers/tweetController';
import registrationValidation from './validations/sign-up';
import tweetCreationValidation from './validations/tweetCreation';
import passport from './core/passport';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users/', userController.get);
app.get('/users/me', passport.authenticate('jwt', { session: false }), userController.getMe);
app.get('/users/:id', userController.getById);

app.get('/tweets/', tweetController.get);
app.get('/tweets/:id', tweetController.getById);
app.delete('/tweets/:id', passport.authenticate('jwt'), tweetController.delete);
app.post('/tweets/', passport.authenticate('jwt'), tweetCreationValidation, tweetController.create);
app.patch('/tweets/:id', passport.authenticate('jwt'), tweetCreationValidation, tweetController.update);

app.post('/auth/register', registrationValidation, userController.create);
app.get('/auth/verify', registrationValidation, userController.verify);
app.post('/auth/login', passport.authenticate('local'), userController.giveOutJWT);

app.listen(process.env.PORT, (): void => {
  console.log('Server started');
});
