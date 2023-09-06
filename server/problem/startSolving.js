import { ProblemModel } from "../models/ProblemModel.js";

export default async function startSolving(username, problemId) {
  const problem = await ProblemModel.findOneAndUpdate({
    username: username,
    problemId: problemId,
    status: 'todo'
  }, {status: 'solving'}, { new: true });
  if (problem === null) {
    return { error: 'problem error' };
  }
  console.log(problem);
  return 'ok';
}
