import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProblemSchema = new Schema({
  username: String,
  link: String,
  title: String,
  difficulty: Number,
  problemId: String,
  tags: [String],
  status: String, // todo / solving / skipped / solved
  addedDate: Date,
  startedDate: Date,
  finishedDate: Date,
  note: String
});

export const ProblemModel = model('problem', ProblemSchema);
