import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";  
import Button from 'react-bootstrap/Button';

export default function Solving() {
  const [problem, setProblem] = useState(null);
  const [time, setTime] = useState(0);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:4000/currentSolving`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.status === 200) {
          response.json()
            .then(data => {
              setProblem(data);
              const startedDate = new Date(data.startedDate);
              const currentDate = new Date();
              const difference = currentDate - startedDate;
              setTime(Math.floor((difference / 1000)));
            })
        }
      } catch(error) {
        console.log('Error fetching data: ', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Create an interval that increments the time every second
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  async function handleSolved() {
    // POST/PUT body
    const response = await fetch('http://localhost:4000/problemUpdate', {
      method: 'PUT',
      body: JSON.stringify({
        problemId: problem.problemId,
        preStatus: 'solving',
        status: 'solved'
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      setRedirect(true);
    } else {
      response.json()
        .then(data => alert(data));
    }
  }
  if(redirect) {
    return <Navigate to={'/solvedList'} />;
  }
  
  if (problem === null) {
    return (
      <div>
        No active solving problem
      </div>
    )
  } else {
    return (
      <div>
        <h1><a target="_blank" rel="noreferrer noopener" href={problem.link}>{problem.title}</a></h1>
        <p>Time: {time} seconds</p>
        <Button variant="success" onClick={handleSolved}>Solved</Button>{' '}
      </div>
    );
  }
}
