import dotenv from 'dotenv';
dotenv.config();

import './core/db';

import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/validator';

const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidations, UserCtrl.create);
app.get('/users/:id', registerValidations, UserCtrl.show);
app.get('/users/verify', registerValidations, UserCtrl.verify);

app.listen(process.env.PORT, (): void => {
  console.log('Server started')
});
