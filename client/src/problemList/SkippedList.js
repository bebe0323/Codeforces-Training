import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { handleRemove } from "./TodoList.js";
import { findDate } from "./SolvedList.js";
import { findSolvedDuration } from "./SolvedList.js";

export default function SkippedList() {
  const [problemList, setProblemList] = useState(null);
  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const response = await fetch(`https://codeforces-training-m2t2.vercel.app/problems/${'skipped'}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.status === 200) {
          response.json()
            .then(data => {
              setProblemList(data);
            })
        } else {
          response.json()
            .then(data => alert(data))
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchSolved();
  }, []);
  
  return (
    <div>
      <h1>Skipped List</h1>
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
              <tr key={index} className={index % 2 === 1 ? 'active-row': ''}>
                <td><a target="_blank" rel="noreferrer noopener" className="cfLink" href={item.link}>{item.problemId}</a></td>
                <td>{item.title}</td>
                <td>{item.difficulty}</td>
                <td>{findDate(item.finishedDate)}</td>
                <td>{findSolvedDuration(item.startedDate, item.finishedDate)}</td>
                <td>{item.note}</td>
                <td>
                  <Button onClick={() => handleRemove(item.problemId)} variant="danger">
                    Remove
                  </Button>
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
