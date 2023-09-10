import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { handleRemove } from "./TodoList.js";
import { timeToString } from "../pages/Solving.js";
import axios from 'axios';

export function findDate(finishedDate) {
  finishedDate = new Date(finishedDate);
  // Extract year, month, and date
  const year = finishedDate.getUTCFullYear();
  const month = finishedDate.getUTCMonth() + 1;
  const date = finishedDate.getUTCDate();
  return (
    `${year}/${month}/${date}`
  );
}

export function findSolvedDuration(startedDate, finishedDate) {
  startedDate = new Date(startedDate);
  finishedDate = new Date(finishedDate);
  const diff = finishedDate - startedDate;
  return (
    timeToString(diff)
  );
}

export default function SolvedList() {
  const [problemList, setProblemList] = useState(null);
  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const response = await axios.get(`/problems/${'solved'}`);
        setProblemList(response.data);
      } catch(error) {
        alert(error.response.data);
      }
    }
    fetchSolved();
  }, []);
  
  return (
    <div>
      <h1>Solved List</h1>
      {problemList !== null ? (
        <table>
          <thead>
            <tr>
              <th style={{width: '3.75em', }}>#</th>
              <th style={{textAlign: 'center'}}>Name</th>
              <th style={{width: '2.5em'}}>Difficulty</th>
              <th>Date solved</th>
              <th>Solved Duration</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problemList.map((item, index) => (
              <tr key={index} className={!index % 2 ? 'active-row': ''}>
                <td><a target="_blank" rel="noreferrer noopener" className="cfLink" href={item.link}>{item.problemId}</a></td>
                <td>{item.title}</td>
                <td>{item.difficulty}</td>
                <td>{findDate(item.finishedDate)}</td>
                <td>{findSolvedDuration(item.startedDate, item.finishedDate)}</td>
                <td>{item.note}</td>
                <td>
                  <Button onClick={() => handleRemove(item.problemId)} variant="danger">
                    Remove
                  </Button>{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ): (
        <>
          Loading
        </>
      )}
    </div>
  );
}
