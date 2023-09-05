import { ProblemModel } from '../models/ProblemModel.js';

export default async function removeProblem(username, problemId) {
  const isExist = await ProblemModel.findOneAndRemove({
    username: username,
    problemId: problemId
  }).exec();
  if (isExist === null) {
    return { error: 'problem does not exist' };
  }
  return 'ok';
}
