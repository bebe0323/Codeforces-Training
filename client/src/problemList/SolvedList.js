import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { backendURL } from "../App.js";
import { FilterBox } from "./FilterBox.js";
import { findDate, findSolvedDuration, findDifMinute } from "./date.js";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement
} from 'chart.js';
import { useSearchParams } from "react-router-dom";

ChartJs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function SolvedList() {
  const [problemList, setProblemList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');
  const [searchParams, setSearchParams] = useSearchParams({
    lower: '',
    upper: ''
  });
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        labels: 'Solved duration',
        data: [],
        backgroundColor: 'aqua',
        borderColor: 'black',
        pointBorderColor: 'aqua'
      }
    ]
  });
  const [options, setOptions] = useState({
    plugins: {
      legend: true
    },
    scales: {
      y: {
        min: 0,
        max: 20
      }
    }
  });

  useEffect(() => {
    let newData = {
      labels: [],
      datasets: [
        {
          labels: 'Solved duration',
          data: [],
          backgroundColor: 'aqua',
          borderColor: 'black',
          pointBorderColor: 'aqua'
        }
      ]
    }
    let newOptions = {
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
    let ymax = 0;
    for (const problem of problemList) {
      const differenceMinute = findDifMinute(problem.startedDate, problem.finishedDate);
      ymax = Math.max(differenceMinute, ymax);
      // pushing at the start of the array
      newData.labels.unshift(problem.problemId);
      newData.datasets[0].data.unshift(differenceMinute);
    }
    newOptions.scales.y.max = ymax + 10;
    setData(newData);
    setOptions(newOptions);
  }, [problemList]);

  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const lower1 = searchParams.get("lower");
        const upper1 = searchParams.get("upper");
        // if lower and upper on params are numbers, setting lower and upper
        if (!isNaN(parseInt(lower1)) && !isNaN(parseInt(upper1))) {
          setLower(parseInt(lower1));
          setUpper(parseInt(upper1));
        }
        let URL = `${backendURL}/list/${'solved'}/${lower1}/${upper1}`;
        if (lower1 === '') {
          URL = `${backendURL}/list/${'solved'}`;
        }
        const response = await fetch(URL, {
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
      setRefresh(!refresh);
    } else {
      response.json()
        .then(error => console.log(error))
    }
  }

  async function handleFilter(e) {
    e.preventDefault();
    // updating search params
    setSearchParams(prev => {
      prev.set("lower", lower);
      prev.set("upper", upper);
      return prev;
    });
    // updating list
    setRefresh(!refresh);
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
            handleFilter={handleFilter}
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
