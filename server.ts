/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import './core/db';
import express from 'express';
import userController from './controllers/userController';
import registerValidations from './validations/validator';
import passport from './core/passport';

const app = express();

app.use(express.json());
app.use(passport.initialize());


app.get('/users/', userController.get);
app.get('/users/me', passport.authenticate('jwt', { session: false }), userController.getMe);
app.get('/users/:id', userController.getById);
app.get('/auth/verify', registerValidations, userController.verify);
app.post('/auth/register', registerValidations, userController.create);
app.post('/auth/login', passport.authenticate('local'), userController.giveOutJWT);

app.listen(process.env.PORT, (): void => {
  console.log('Server started');
});
