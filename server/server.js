import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const secretKey = process.env.SECRET_KEY;

import register from './auth/register.js';
import login from './auth/login.js';
import problemAdd from './problem/problemAdd.js';
import getProblemsList from './problem/getProblemsList.js';
import problemRemove from './problem/problemRemove.js';
import currentSolving from './problem/currentSolving.js';
import problemUpdate from './problem/problemUpdate.js'

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
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  res.status(200).json('ok');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const ret = await login(username, password);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  res.cookie('token', ret);
  return res.status(200).json(username);
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(info);
  });
});

app.post('/logout', (req, res) => {
  // clearing cookie
  res.cookie('token', '');
  res.status(200).json('ok');
})

app.post('/problemAdd', async (req, res) => {
  const { link } = req.body;
  const { token } = req.cookies;
  let username = '';
  // verifying token
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    // return res.status(200).json(info);
    username = info.username;
  });
  const ret = await problemAdd(username, link);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json('success');
});

app.get('/problems/:status', async (req, res) => {
  const { token } = req.cookies;
  const status = req.params.status;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    // return res.status(200).json(info);
    username = info.username;
  });
  const todoList = await getProblemsList(username, status);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(todoList.error);
  }
  return res.status(200).json(todoList);
});

app.delete('/remove/:problemId', async (req, res) => {
  const { token } = req.cookies;
  const problemId = req.params.problemId;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    // return res.status(200).json(info);
    username = info.username;
  });
  const ret = await problemRemove(username, problemId);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json('ok');
});

/* Getting the problem that user is currently solving */
app.get('/currentSolving', async (req, res) => {
  const { token } = req.cookies;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    // return res.status(200).json(info);
    username = info.username;
  });
  const ret = await currentSolving(username);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json(ret);
});

/* Problem solved */
app.put('/problemUpdate', async(req, res) => {
  const { token } = req.cookies;
  const {
    problemId,
    preStatus,
    status,
    note
  } = req.body;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    // return res.status(200).json(info);
    username = info.username;
  });
  const ret = await problemUpdate(
    username,
    problemId,
    preStatus,
    status,
    note
  );
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json(ret);
});

app.get('/', (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.send('hello');
})

// const PORT = 4000;
const PORT = process.env.PORT;
const mongodbUri = process.env.MONGODB_URI;

app.listen(PORT, async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to mongo.db');
    console.log(`Listening on port ${PORT}`);
  } catch(e) {
    console.log(e);
  }
});
