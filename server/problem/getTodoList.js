import { ProblemModel } from "../models/ProblemModel";

export default async function getTodoList(username) {
  try {
    const problems = await ProblemModel.find({
      username: username,
      status: 'todo'
    });
    console.log(`all problems of ${username}`);
    console.log(problems);
  } catch (error) {
    console.error('Error while fetching problems:', error);
    return { error: 'internal server error' };
  }
}
