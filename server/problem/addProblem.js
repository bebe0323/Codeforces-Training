import { ProblemModel } from '../models/ProblemModel.js';
import cheerio from 'cheerio';
import axios from 'axios';

export default async function addProblem(username, problemLink) {
  console.log(username, problemLink, 'here');
  if (!isValidLink(problemLink)) {
    return { error: 'invalid link' };
  }
  const tags = [];
  await axios.get(problemLink)
    .then(urlResponse => {
      const $ = cheerio.load(urlResponse.data)
      $('span.tag-box').each((index, element) => {
        tags.push($(element).text().trim());
      })
    }).catch(err => console.log(err))
  
  const difficulty = getDifficulty(tags);
  console.log(`problem difficulty: ${difficulty}`);

  const problemId = getProblemId(problemLink);
  if (typeof problemId === 'object') {
    return problemId;
  }
  console.log(`problemId: ${problemId}`);
}

function isValidLink(problemLink) {
  console.log(`problem link: ${problemLink}`);
  if (problemLink.startsWith("https://codeforces.com")) {
    console.log('true');
    return true;
  }
  console.log('false');
  return false;
}

function getDifficulty(tags) {
  if (tags.length > 0) {
    const lastElement = tags[tags.length - 1];
    // problem difficulty is a string start with *
    const removedFirst = lastElement.substring(1);
    if (!isNaN(removedFirst)) {
      console.log('difficulty is a number');
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
