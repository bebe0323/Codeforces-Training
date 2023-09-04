import { ProblemModel } from '../models/ProblemModel.js';
import cheerio from 'cheerio';
import axios from 'axios';

export default async function addProblem(username, problemLink) {
  console.log(username, problemLink);
  if (problemLink === undefined) {
    return { error: 'undefined link' };
  }
  const tags = [];
  await axios.get(problemLink)
    .then(urlResponse => {
      const $ = cheerio.load(urlResponse.data)
      $('span.tag-box').each((index, element) => {
        tags.push($(element).text().trim());
      })
    }).catch(err => console.log(err))
  let difficulty = 0;
  if (tags.length > 0) {
    const lastElement = tags[tags.length - 1];
    // problem difficulty is a string start with *
    const removedFirst = lastElement.substring(1);
    if (!isNaN(removedFirst)) {
      difficulty = Number(removedFirst);
      console.log(`difficulty: ${difficulty}`);
    } else {
      console.log('does not have difficulty');
    }
  }
}
