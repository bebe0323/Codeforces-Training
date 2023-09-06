import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProblemSchema = new Schema({
  username: String,
  link: String,
  title: String,
  difficulty: Number,
  problemId: String,
  tags: [String],
  status: String, // todo / skipped / solved
  addedDate: Date,
  solvedDate: Date,
  solvedDuration: Number
});

export const ProblemModel = model('problem', ProblemSchema);
