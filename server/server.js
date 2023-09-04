import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import register from './auth/register.js';
import login from './auth/login.js';
import { secretKey } from './auth/createSecretKey.js';
import addProblem from './problem/addProblem.js';

// Set up web app
const app = express();
// Use middleware that allows for access from other domains
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
// Use middleware that allows us to access the JSON body of requests
app.use(express.json());
// Use middleware to pass cookies
app.use(cookieParser());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const ret = await register(username, password);
  console.log(ret);
  if ('error' in ret) {
    return res.status(400).json(ret.error);
  }
  res.status(200).json(ret);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ret = await login(username, password);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  res.cookie('token', ret);
  return res.status(200).json(username);
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      console.log('invalid token');
      return res.status(400).json(err);
    }
    console.log('token verified');
    return res.status(200).json(info);
  });
});

app.post('/logout', (req, res) => {
  // clearing cookie
  res.cookie('token', '');
  res.status(200).json('ok');
})

app.post('/addProblem', async (req, res) => {
  const { problemTitle, difficulty } = req.body;
  const { token } = req.cookies;
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      console.log('invalid token');
      return res.status(400).json(err);
    }
    username = info.username;
  });
  const ret = await addProblem(username, problemTitle, difficulty);
  if ('error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json(ret);
});

const PORT = 4000;
app.listen(PORT, async () => {
  try {
    await mongoose.connect('mongodb+srv://belgutei0323:HOFZn2lSvlnnnm61@cluster0.ay3soxd.mongodb.net/?retryWrites=true&w=majority');
    console.log('Connected to mongo.db');
    console.log(`Listening on port ${PORT}`);
  } catch(e) {
    console.log(e);
  }
});
