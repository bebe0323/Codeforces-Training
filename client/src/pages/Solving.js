import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";  
import Button from 'react-bootstrap/Button';

export function timeToString(time) {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const formattedHH = hh.toString().padStart(2, "0");
  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");

  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

export default function Solving() {
  const [problem, setProblem] = useState(null);
  const [time, setTime] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    // include problem insider provdier
    // use effect is called after paging is reloaded
    async function fetchData() {
      try {
        const response = await fetch(`https://codeforces-training-m2t2.vercel.app/currentSolving`, {
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
              setTime(Math.floor((difference)));
              setNote(data.note);
            })
        }
      } catch(error) {
        console.log('Error fetching data: ', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Create an interval that increments the time every 0.1 second
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 100);
    }, 100);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  async function handleButton(status) {
    // POST/PUT body
    const response = await fetch('https://codeforces-training-m2t2.vercel.app/problemUpdate', {
      method: 'PUT',
      body: JSON.stringify({
        problemId: problem.problemId,
        preStatus: 'solving',
        status: status,
        note: note
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      setRedirect(status);
    } else {
      response.json()
        .then(data => alert(data));
    }
  }

  if(redirect === 'solved') {
    return <Navigate to={`/solvedList`} />;
  }
  if (redirect === 'skipped') {
    return <Navigate to={'/skippedList'} />
  }

  function handleNoteChange(e) {
    setNote(e.target.value);
  }
  
  if (problem === null) {
    return (
      <div>
        No active solving problem
      </div>
    )
  } else {
    return (
      <div className="solving-page">
        <h1>
          <a target="_blank" className="problem-link" rel="noreferrer noopener" href={problem.link}>
            {problem.title}
          </a>
        </h1>
        <h2 className="time">{timeToString(time)}</h2>
        <Button className="skipped-button" variant="danger" onClick={() => handleButton('skipped')}>
          Skipped
        </Button>{' '}
        <Button className="solved-button" variant="success" onClick={() => handleButton('solved')}>
          Solved
        </Button>
        <br />
        <textarea
          className="notes"
          type="text"
          rows={10}
          cols={50}
          value={note}
          onChange={handleNoteChange}
        />
      </div>
    );
  }
}
