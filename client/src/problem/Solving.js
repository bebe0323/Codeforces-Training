import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { timeToString } from "../problemList/components/date.js";
import RingLoader from "react-spinners/RingLoader.js";
import { backendURL } from "../App.js";

export default function Solving() {
  const [problem, setProblem] = useState(null);
  const [time, setTime] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [note, setNote] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);

  useEffect(() => {
    // use effect is called after paging is reloaded
    async function fetchData() {
      try {
        const response = await fetch(`${backendURL}/problem/solving`, {
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
        } else if (response.status === 401) {
          alert('Login first');
          setRedirect('login');
        }
        setFirstFetch(false);
      } catch(error) {
        console.log('Error fetching data: ', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Create an interval that increments the time every 0.3 second
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 300);
    }, 300);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  async function handleButton(status) {
    // POST/PUT body
    setLoadingSubmit(true);
    const response = await fetch(`${backendURL}/problem/update`, {
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
    setLoadingSubmit(false);
    if (response.status === 200) {
      setRedirect(status);
    } else {
      response.json()
        .then(data => alert(data));
    }
  }

  if(redirect === 'solved') {
    return <Navigate to={`/list/solved`} />;
  }
  if (redirect === 'skipped') {
    return <Navigate to={'/list/skipped'} />
  }
  if (redirect === 'login') {
    return <Navigate to={'/login'} />
  }

  function handleNoteChange(e) {
    setNote(e.target.value);
  }

  if (firstFetch) {
    return (
      <div className="loading">
        <RingLoader color="#36d7b7" size={120}/>
      </div>
    );
  }
  return (
    <div>
      {problem === null && (
        <div>
          No active solving problem
        </div>
      )}
      {problem !== null && (
        <div className="solving-page">
          <h1>
            <a target="_blank" className="problem-link" rel="noreferrer noopener" href={problem.link}>
              {problem.title}
            </a>
          </h1>
          <h2 className="time">{timeToString(time)}</h2>
          <Button disabled={loadingSubmit} className="skipped-button" variant="danger" onClick={() => handleButton('skipped')}>
            Skipped
          </Button>{' '}
          <Button disabled={loadingSubmit} className="solved-button" variant="success" onClick={() => handleButton('solved')}>
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
      )}
    </div>
  );
}
