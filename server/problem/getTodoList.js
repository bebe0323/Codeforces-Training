import { ProblemModel } from "../models/ProblemModel.js";

export default async function getTodoList(username) {
  try {
    const problems = await ProblemModel.find({
      username: username,
      status: 'todo'
    });
    return problems;
  } catch (error) {
    return { error: 'internal server error' };
  }
}
