import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";


export default function Solving() {
  const [problem, setProblem] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
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
              setTime(data.solvedDuration);
            })
        }
      } catch(error) {
        console.log('Error fetching data: ', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  function handleStopStart() {
    setIsRunning(isRunning => !isRunning);
  }

  async function handleSolved() {
    // POST/PUT body
    const response = await fetch('http://localhost:4000/problemUpdate', {
      method: 'PUT',
      body: JSON.stringify({
        problemId: problem.problemId,
        duration: time,
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
        <h1><a target="_blank" href={problem.link}>{problem.title}</a></h1>
        <p>Time: {time} seconds</p>
        <button onClick={handleStopStart}>{isRunning ? 'Stop': 'Start'}</button>
        <button onClick={handleSolved}>Solved</button>
      </div>
    );
  }
}
