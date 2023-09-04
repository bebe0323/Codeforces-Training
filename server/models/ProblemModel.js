import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProblemSchema = new Schema({
  username: String,
  title: String,
  difficulty: String,
  status: String,
  added: Date,
  solved: Date
});

export const ProblemModel = model('problem', ProblemSchema);
