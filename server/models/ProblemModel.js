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
  added: Date,
  solved: Date
});

export const ProblemModel = model('problem', ProblemSchema);
