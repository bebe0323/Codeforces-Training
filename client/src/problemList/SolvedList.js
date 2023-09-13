import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { timeToString } from "../pages/Solving.js";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
  const [problemList, setProblemList] = useState(null);
  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const response = await fetch(`https://cp-training-backend.onrender.com/problems/${'solved'}`, {
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

  async function handleRemove(problemId) {
    const response = await fetch(`http://localhost:4000/remove/${problemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      navigate('/solvedList');
      window.location.reload();
    } else {
      response.json()
        .then(error => console.log(error))
    }
  }
  
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
