/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import './core/db';
import express from 'express';
import passport from './core/passport';

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const tweetsRouter = require('./routes/tweets');
const uploadFileRouter = require('./routes/uploadFiles');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);
app.use('/upload', uploadFileRouter);
app.use('/auth', authRouter);

app.listen(process.env.PORT, (): void => {
  console.log('Server started');
});
