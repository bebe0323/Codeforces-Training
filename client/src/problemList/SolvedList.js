import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { timeToString } from "../pages/Solving.js";
import { backendURL } from "../App.js";

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
  const [refresh, setRefresh] = useState(0);
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');

  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const response = await fetch(`${backendURL}/list/${'solved'}`, {
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
  }, [refresh]);

  async function handleRemove(problemId) {
    const response = await fetch(`${backendURL}/problem/remove/${problemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      setRefresh(1 - refresh);
    } else {
      response.json()
        .then(error => console.log(error))
    }
  }

  async function handleSubmit() {
    
    const response = await fetch(`${backendURL}/list/${'solved'}/${lower}/${upper}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      response.json()
        .then(data => setProblemList(data))
    } else {
      response.json()
        .then(data => alert(data))
    }
  }

  function handleLower(e) { setLower(e.target.value); }
  function handleUpper(e) { setUpper(e.target.value); }
  
  return (
    <div>
      <h1>Solved List</h1>
      {problemList !== null ? (
        <div className="solved-page">
          <table className="solved-table">
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
          <form className="filter-box" onSubmit={handleSubmit}>
            <p className="filter-text">→ Filter Problems</p>
            <div className="filter-input">
              <p className="difficulty-text">Difficulty:</p>
              <input value={lower} onChange={handleLower} className="difficulty-input" required/>
              -
              <input value={upper} onChange={handleUpper} className="difficulty-input" required/>
            </div>
            <div className="apply-button-div">
              <button className="apply-button">
                Apply
              </button>
            </div>
          </form>
        </div>
      ): (
        <>
          Loading
        </>
      )}
    </div>
  );
}
