import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { findDate } from "./SolvedList.js";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export async function handleRemove(problemId) {
  try {
    await axios.delete(`/remove/${problemId}`);
    window.location.reload();
  } catch(error) {
    alert(error.response.data);
  }
}

export default function TodoList() {
  const [problemList, setProblemList] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchData() {
      try {
        const response = await axios.get(`/problems/${'todo'}`);
        setProblemList(response.data);
      } catch(error) {
        alert(error.response.data);
      }
    }
    fetchData();
  }, []);

  async function handleStart(problemId) {
    try {
      await axios.put(`/problemUpdate`, {
        problemId: problemId,
        preStatus: 'todo',
        status: 'solving',
        note: ''
      });
      setRedirect(true);
    } catch(error) {
      alert(error.response.data);
    }
  }
  if (redirect) {
    return <Navigate to={'/solving'} />
  }
  
  return (
    <div>
      <h1>Todo List</h1>
      {problemList !== null ? (
        <>
          <table>
            <thead>
              <tr>
                <th style={{width: '3.75em', }}>#</th>
                <th style={{textAlign: 'center'}}>Name</th>
                <th style={{width: '2.5em'}}>Difficulty</th>
                <th>Date added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problemList.map((item, index) => (
                <tr key={index} className={index % 2 === 1 ? 'active-row': ''}>
                  <td><a target="_blank" rel="noreferrer noopener" className="cfLink" href={item.link}>{item.problemId}</a></td>
                  <td>{item.title}</td>
                  <td>{item.difficulty}</td>
                  <td>{findDate(item.addedDate)}</td>
                  <td>
                    <Button onClick={() => handleStart(item.problemId)} variant="warning">Start Solving</Button>{' '}
                    <Button onClick={() => handleRemove(item.problemId)} variant="danger">Remove</Button>{' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ): (
        <>
          Loading
        </>
      )}
    </div>
  );
}
