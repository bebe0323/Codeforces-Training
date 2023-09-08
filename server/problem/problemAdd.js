import { ProblemModel } from '../models/ProblemModel.js';
import cheerio from 'cheerio';
import axios from 'axios';

export default async function problemAdd(username, problemLink) {
  if (typeof problemLink !== 'string') {
    return { error: 'invalid link' };
  }
  problemLink = problemLink.toLowerCase();
  const tags = [];
  let title = '';
  
  await axios.get(problemLink)
    .then(urlResponse => {
      const $ = cheerio.load(urlResponse.data)
      $('span.tag-box').each((index, element) => {
        tags.push($(element).text().trim());
      })
      $('div.header div.title').each((index, element) => {
        title = $(element).text().trim();
      })
    }).catch(err => console.log(err))
  
  const difficulty = getDifficulty(tags);
  if (difficulty !== 0) {
    // removing difficulty tag
    tags.pop();
  }
  
  const problemId = getProblemId(problemLink);
  if (title === '' || typeof problemId === 'object') {
    return { error: 'invalid link' };
  }
  
  try {
    // checking if user already added
    const problemExist = await ProblemModel.findOne({
      username: username,
      problemId: problemId
    });
    if (problemExist !== null) {
      return { error: 'already added' };
    }
    // adding to mongoDB database
    const newProblem = new ProblemModel({
      username: username,
      link: problemLink,
      title: title,
      difficulty: difficulty,
      problemId: problemId,
      tags: tags,
      status: 'todo',
      addedDate: new Date(),
      startedDate: null,
      finishedDate: null,
      note: ''
    });
    await newProblem.save();
    return 'success';
  } catch(error) {
    console.error('Error while checking for problem existence:', error);
    return { error: 'internal server error' };
  }
}

function getDifficulty(tags) {
  if (tags.length > 0) {
    const lastElement = tags[tags.length - 1];
    // problem difficulty is a string start with *
    const removedFirst = lastElement.substring(1);
    if (!isNaN(removedFirst)) {
      return Number(removedFirst);
    }
  }
  // does not have difficulty
  return 0;
}

function getProblemId(problemLink) {
  // problem from contest
  // https://codeforces.com/contest/1830/problem/A
  // problem from problemset
  // https://codeforces.com/problemset/problem/1856/C
  
  const parts = problemLink.split('/').filter(part => part !== '');
  if (
    problemLink.startsWith('https://codeforces.com/contest/') &&
    parts.length === 6 &&
    parts[4] === 'problem'
  ) {
    // problem from contest
    return (parts[3] + parts[5]);
  } else if (
    problemLink.startsWith('https://codeforces.com/problemset/') &&
    parts.length === 6 &&
    parts[3] === 'problem'
  ) {
    // problem from problemset
    return (parts[4] + parts[5]);
  } else {
    return { error: 'invalid id' };
  }
}
