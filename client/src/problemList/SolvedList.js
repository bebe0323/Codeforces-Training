import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { timeToString } from "../pages/Solving.js";
import { backendURL } from "../App.js";
import { FilterBox } from "./FilterBox.js";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement
} from 'chart.js';

ChartJs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

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
  const [problemList, setProblemList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');

  let data = {
    // labels: ['Mon', 'Tue', 'Wed', 'Thu'],
    labels: [],
    datasets: [
      {
        labels: 'Solved duration',
        // data: [3, 6, 9, 8],
        data: [],
        backgroundColor: 'aqua',
        borderColor: 'black',
        pointBorderColor: 'aqua'
      }
    ]
  };
  let options = {
    plugins: {
      legend: true
    },
    scales: {
      y: {
        min: 0,
        max: 20
      }
    }
  }

  useEffect(() => {
    // problem ids
    data.labels = [];
    // solved durations
    data.datasets[0].data = [];
    let ymax = 0;
    for (const problem of problemList) {
      const differenceMs = (new Date(problem.finishedDate) - new Date(problem.startedDate));
      const differenceMinute = Math.floor(differenceMs / (1000 * 60));
      ymax = Math.max(differenceMinute, ymax);
      // pushing at the start of the array
      data.labels.unshift(problem.problemId);
      data.datasets[0].data.unshift(differenceMinute);
    }
    options.scales.y.max = ymax + 10;
  }, [problemList]);

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

  async function handleSubmit(e) {
    e.preventDefault();
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
      
      <div>
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
          <FilterBox
            handleSubmit={handleSubmit}
            lower={lower}
            upper={upper}
            handleLower={handleLower}
            handleUpper={handleUpper}
          />
        </div>
        <div className="line-chart">
          <Line redraw={true} data = {data} options={options} />
        </div>
      </div>
    </div>
  );
}
