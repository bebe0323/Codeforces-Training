import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProblemSchema = new Schema({
  username: String,
  problemLink: String,
  title: String,
  difficulty: Number,
  problemId: String,
  tags: [String],
  status: String, // todo / skipped / solved
  addedDate: Date,
  solvedDate: Date,
  startedDate: Date
});

export const ProblemModel = model('problem', ProblemSchema);
