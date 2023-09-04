import { UserModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey } from './createSecretKey.js';

export default async function login(username, password) {
  const userDb = await UserModel.findOne({ username: username });
  if (userDb === null) {
    return { error: 'username does not exist' };
  }
  // wrong password
  if (!bcrypt.compareSync(password, userDb.password)) {
    return { error: 'wrong password' };
  }
  // logged in
  const token = jwt.sign({ username, id: userDb._id}, secretKey, {});
  console.log(`Login token: ${token}`);
  return token;
}
