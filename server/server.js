import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import register from './auth/register.js';
import login from './auth/login.js';
import { secretKey } from './auth/createSecretKey.js';
import addProblem from './problem/addProblem.js';
import getTodoList from './problem/getTodoList.js';
import removeProblem from './problem/removeProblem.js';
import startSolving from './problem/startSolving.js';

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
  if (typeof ret === 'object') {
    return res.status(400).json(ret.error);
  }
  res.status(200).json('ok');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const ret = await login(username, password);
  if (typeof ret === 'object') {
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

app.post('/addProblem', async (req, res) => {
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
  const ret = await addProblem(username, link);
  if (typeof ret === 'object') {
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
  const todoList = await getTodoList(username, status);
  if (todoList.includes('error')) {
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
  const ret = await removeProblem(username, problemId);
  if (typeof ret === 'object') {
    console.log('error in deleting: ' + ret.error);
    return res.status(400).json(ret.error);
  }
  console.log('succesffully deleted');
  return res.status(200).json('ok');
});

app.post('/startSolving', async (req, res) => {
  const { token } = req.cookies;
  const { problemId } = req.body;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    // return res.status(200).json(info);
    username = info.username;
  });
  console.log(username, problemId);
  const ret = await startSolving(username, problemId);
  if (ret.includes('error')) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json('ok');
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
