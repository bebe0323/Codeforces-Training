import { UserModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { secretKey } from './createSecretKey.js';

export default async function register(username, password) {
  if (username === '') {
    return { error: 'username must not be empty' };
  }
  if (password === '') {
    return { error: 'password must not be empty' };
  }
  const userExist = await UserModel.findOne({ username: username });
  if (userExist !== null) {
    return { error: 'username already exists' };
  }
  // hashing password
  const hash = bcrypt.hashSync(password, secretKey);
  console.log(`Register hash: ${hash}`);
  const newUser = new UserModel({
    username: username,
    password: hash
  });
  await newUser.save();
  return 'ok';
}
