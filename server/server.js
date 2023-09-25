import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import register from './auth/register.js';
import login from './auth/login.js';
import problemAdd from './problem/problemAdd.js';
import getProblemsList from './problem/getProblemsList.js';
import problemRemove from './problem/problemRemove.js';
import currentSolving from './problem/currentSolving.js';
import problemUpdate from './problem/problemUpdate.js';
import { ServerDescriptionChangedEvent } from 'mongodb';

export const secretKey = process.env.SECRET_KEY;

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
  const ret = await login(username, password);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  res.cookie('token', ret, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).json(username);
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(info);
  });
});

app.post('/logout', (req, res) => {
  // clearing cookie
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(200).json('ok');
})

app.post('/problem/add', async (req, res) => {
  const { token } = req.cookies;
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
  const { link } = req.body;
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

app.get('/list/:status', async (req, res) => {
  const { token } = req.cookies;
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
  const status = req.params.status;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    username = info.username;
  });
  const ret = await getProblemsList(username, status, 0, 3500);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json(ret);
});

app.get('/list/:status/:lower/:upper', async (req, res) => {
  const { token } = req.cookies;
  const status = req.params.status;
  const lower = req.params.lower;
  const upper = req.params.upper;
  // checking token
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    username = info.username;
  });
  if (lower === '') lower = 0;
  if (upper === '') upper = 3500;
  const ret = await getProblemsList(username, status, lower, upper);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json(ret);
})

app.delete('/problem/remove/:problemId', async (req, res) => {
  const { token } = req.cookies;
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
  const problemId = req.params.problemId;
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    username = info.username;
  });
  const ret = await problemRemove(username, problemId);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json('ok');
});

/* Getting the problem that user is currently solving */
app.get('/problem/solving', async (req, res) => {
  const { token } = req.cookies;
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
  // verifying token
  let username = '';
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) {
      return res.status(400).json(err);
    }
    username = info.username;
  });
  const ret = await currentSolving(username);
  if (typeof ret === 'object' && 'error' in ret) {
    return res.status(400).json(ret.error);
  }
  return res.status(200).json(ret);
});

/* Problem solved */
app.put('/problem/update', async (req, res) => {
  const { token } = req.cookies;
  if (token === '' || token === undefined) {
    return res.status(401).json('Login first!');
  }
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
});

async function stayAwake() {
  await delay(600000); // in every 10 mins
  console.log('Server staying awake');
  stayAwake();
}

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to mongo.db');
  } catch(e) {
    console.log(e);
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    stayAwake();
    console.log(`Listening on port ${PORT}`);
  }) 
});

// delay for checking loading
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
