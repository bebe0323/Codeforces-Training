import { ProblemModel } from '../models/ProblemModel.js';

export default async function addProblem(username, problemTitle, problemDifficulty) {
  if (problemTitle === '') {
    return { error: 'empty title' };
  }
  const problemExist = await ProblemModel.findOne({
    username: username,
    title: problemTitle 
  });
  if (problemExist !== null) {
    return { error: 'problem already added' };
  }
  const newProblem = new ProblemModel({
    username: username,
    title: problemTitle,
    difficulty: problemDifficulty,
    status: 'todo',
    added: new Date(),
    solved: null
  });
  
  await newProblem.save();

  console.log(`new problem: ${newProblem}`);
  return newProblem._id;
}
