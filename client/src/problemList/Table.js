import Button from 'react-bootstrap/Button';
import { findDate, findSolvedDuration } from "./date.js";
import { backendURL } from "../App.js";
import { useState } from "react";

export default function Table({ problemList, isTodo = false, isSolved = false, isSkipped = false, handleStart, refresh, setRefresh }) {
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState('');

  async function handleRemove(problemId) {
    setLoadingId(problemId);
    setLoading(true);
    const response = await fetch(`${backendURL}/problem/remove/${problemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    setLoadingId('');
    setLoading(false);
    if (response.status === 200) {
      setRefresh(!refresh);
    } else {
      response.json()
        .then(error => console.log(error))
    }
  }

  return (
    <table className={isSolved ? 'solved-table' : ''}>
      <thead>
        <tr>
          <th style={{width: '3.75em', }}>#</th>
          <th style={{textAlign: 'center'}}>Name</th>
          <th style={{width: '2.5em'}}>Difficulty</th>
          {isTodo && <th>Date added</th>}
          {isSolved && <th>Date solved</th>}
          {isSolved && <th>Solved Duration</th>}
          {isSkipped && <th>Date tried</th>}
          {isSkipped && <th>Tried Duration</th>}
          {!isTodo && <th>Note</th>}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {problemList.map((item, index) => (
          <tr key={index} className={!index % 2 ? 'active-row': ''}>
            <td><a target="_blank" rel="noreferrer noopener" className="cfLink" href={item.link}>{item.problemId}</a></td>
            <td>{item.title}</td>
            <td>{item.difficulty}</td>
            {isTodo && <td>{findDate(item.addedDate)}</td>}
            {!isTodo && <td>{findDate(item.finishedDate)}</td>}
            {!isTodo && <td>{findSolvedDuration(item.startedDate, item.finishedDate)}</td>}
            {!isTodo && <td>{item.note}</td>}
            <td>
              {
                isTodo &&
                <Button onClick={() => handleStart(item.problemId)} variant="warning">
                  Start Solving
                </Button>
              }{' '}
              <Button disabled={loading && item.problemId === loadingId} onClick={() => handleRemove(item.problemId)} variant="danger">
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}