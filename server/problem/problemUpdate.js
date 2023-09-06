import { ProblemModel } from "../models/ProblemModel.js";

export default async function problemUpdate(
  username,
  problemId,
  duration,
  preStatus,
  status
) {
  const query = {
    username: username,
    problemId: problemId,
    status: preStatus
  };
  const update = {
    solvedDuration: duration,
    status: status
  };
  const options = {
    new: true // return updated problem
  };
  const problem = await ProblemModel.findOneAndUpdate(
    query,
    update,
    options
  );
  if (problem === null) {
    return { error: 'problem error' };
  }
  console.log('updated problem');
  console.log(problem);
  return 'ok';
}
