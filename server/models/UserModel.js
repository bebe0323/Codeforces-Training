import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: String,
  password: String
});

export const UserModel = model('user', UserSchema);
