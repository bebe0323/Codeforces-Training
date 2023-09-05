import { ProblemModel } from "../models/ProblemModel.js";

export default async function getTodoList(username, status) {
  try {
    const problems = await ProblemModel.find({
      username: username,
      status: status
    });
    return problems;
  } catch (error) {
    return { error: 'internal server error' };
  }
}
