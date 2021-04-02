/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import './core/db';
import express from 'express';
import { Socket } from 'socket.io';
import passport from './core/passport';

const io = require('socket.io')();

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

const server = app.listen(process.env.PORT, (): void => {
  console.log('Server started');
});

io.listen(server);

io.on('connection', (socket: Socket) => {
  const { id } = socket.handshake.query;
  if (id) socket.join(id);

  socket.on('send-message', ({ recipient, text, createdAt, sender }) => {
    socket.to(recipient._id).emit('receive-message', {
      recipient: sender, text, createdAt, sender,
    });
  });

  socket.on('disconnecting', () => {
    if (id) socket.leave(id.toString());
  });
});
