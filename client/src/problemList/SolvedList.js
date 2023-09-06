import { useEffect, useState } from "react";
import { handleRemove } from "./TodoList";

export function findDate(solvedDate) {
  solvedDate = new Date(solvedDate);
  // Extract year, month, and date
  const year = solvedDate.getUTCFullYear();
  const month = solvedDate.getUTCMonth() + 1; // Add 1 because getUTCMonth() returns a zero-based index (0 = January)
  const date = solvedDate.getUTCDate();
  return (
    `${year}/${month}/${date}`
  );
}

export default function SolvedList() {
  const [problemList, setProblemList] = useState(null);
  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:4000/problems/${'solved'}`, {
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
    fetchData();
  }, []);

  function findSolvedDuration(startedDate, solvedDate) {
    startedDate = new Date(startedDate);
    solvedDate = new Date(solvedDate);
    const seconds = Math.floor((solvedDate - startedDate) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return (
      `Hours: ${hours}, Minutes: ${minutes}, Seconds: ${remainingSeconds}`
    )
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problemList.map((item, index) => (
              <tr key={index} className={!index % 2 ? 'active-row': ''}>
                <td><a target="_blank" rel="noreferrer noopener" className="cfLink" href={item.link}>{item.problemId}</a></td>
                <td>{item.title}</td>
                <td>{item.difficulty}</td>
                <td>{findDate(item.solvedDate)}</td>
                <td>{findSolvedDuration(item.startedDate, item.solvedDate)}</td>
                <td>
                  <button onClick={() => handleRemove(item.problemId)}>Remove</button>
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
