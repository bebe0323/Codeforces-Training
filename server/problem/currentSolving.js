import { ProblemModel } from "../models/ProblemModel.js";

export default async function currentSolving(username) {
  const problem = await ProblemModel.findOne({
    username: username,
    status: 'solving'
  });
  if (problem === null) {
    return { error: 'user does not have solving problem' };
  }
  return problem;
}
