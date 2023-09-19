import { ProblemModel } from "../models/ProblemModel.js";


export default async function getProblemsList(username, status, lower, upper) {
  try {
    const lowerNum = parseInt(lower);
    const upperNum = parseInt(upper);
    if (isNaN(lowerNum) || isNaN(upperNum)) {
      return { error: 'Difficulty must be a number' };
    }
    const problems = await ProblemModel.find({
      username: username,
      status: status
    });
    const inRangeProblems = problems.filter(problem => {
      const difficulty = problem.difficulty;
      return lowerNum <= difficulty && difficulty <= upperNum;
    });
    let sortedProblems;
    // sorting that the most recent added is on the top
    if (status === 'todo' || status === 'skipped') {
      sortedProblems = inRangeProblems.sort((a, b) => b.addedDate - a.addedDate);
    } else {
      sortedProblems = inRangeProblems.sort((a, b) => b.finishedDate - a.finishedDate);
    }
    return sortedProblems;
  } catch (error) {
    return { error: 'internal server error' };
  }
}
