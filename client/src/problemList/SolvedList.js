import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import RingLoader from 'react-spinners/RingLoader.js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
} from 'chart.js';
import { backendURL } from '../App.js';
import { findDifMinute } from './components/date.js';
import { FilterBox } from './components/FilterBox.js';
import { StatBar } from './components/StatBar.js';
import Table from './components/Table.js';

ChartJs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

export default function SolvedList() {
  const [problemList, setProblemList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');
  const [redirect, setRedirect] = useState('');
  const [searchParams, setSearchParams] = useSearchParams({
    lower: '',
    upper: '',
  });
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [firstFetch, setFirstFetch] = useState(true);
  const [totalDuration, setTotalDuration] = useState(0);
  const [numProblems, setNumProblems] = useState(0);

  useEffect(() => {
    const newData = {
      labels: [],
      datasets: [
        {
          labels: 'Solved duration',
          data: [],
          backgroundColor: '#3B5998',
          borderColor: '#3B5998',
          pointBorderColor: '#3B5998',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
    const newOptions = {
      plugins: {
        legend: true,
      },
      scales: {
        y: {
          min: 0,
          max: 20,
        },
      },
    };
    let ymax = 0;
    let total = 0;
    for (const problem of problemList) {
      const differenceMinute = findDifMinute(problem.startedDate, problem.finishedDate);
      total += new Date(problem.finishedDate) - new Date(problem.startedDate);
      ymax = Math.max(differenceMinute, ymax);
      // pushing at the start of the array
      newData.labels.unshift(problem.problemId);
      newData.datasets[0].data.unshift(differenceMinute);
    }
    newOptions.scales.y.max = ymax + 10;
    // graph
    setData(newData);
    setOptions(newOptions);
    // sidebar statistic
    setTotalDuration(total);
    setNumProblems(problemList.length);
  }, [problemList]);

  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const lower1 = searchParams.get('lower');
        const upper1 = searchParams.get('upper');
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
            .then((data) => {
              setProblemList(data);
            });
        } else if (response.status === 401) {
          alert('Login first');
          setRedirect('login');
        } else {
          response.json()
            .then((data) => alert(data));
        }
        setFirstFetch(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchSolved();
  }, [refresh]);

  async function handleFilter(e) {
    e.preventDefault();
    // updating search params
    setSearchParams((prev) => {
      prev.set('lower', lower);
      prev.set('upper', upper);
      return prev;
    });
    // updating list
    setRefresh(!refresh);
  }

  function handleLower(e) { setLower(e.target.value); }
  function handleUpper(e) { setUpper(e.target.value); }
  // !show -> list
  // show -> graph
  function handleGraph() {
    if (!show) setShow(!show);
  }
  function handleList() {
    if (show) setShow(!show);
  }

  if (redirect === 'login') {
    return <Navigate to="/login" />;
  }
  if (firstFetch) {
    return (
      <div className="loading">
        <RingLoader color="#36d7b7" size={120} />
      </div>
    );
  }
  return (
    <div>
      <h1>Solved List</h1>
      <div className="solved-page">
        {!show && (
          <Table
            problemList={problemList}
            isSolved
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
        {show && (
          <div className="line-chart">
            <Line redraw data={data} options={options} />
          </div>
        )}
        <div className="solved-sidebar">
          <div className="sidebar-2-buttons">
            <button disabled={!show} onClick={handleList} className="apply-button">
              List
            </button>
            {' '}
            <button disabled={show} onClick={handleGraph} className="apply-button">
              Graph
            </button>
          </div>
          <FilterBox
            handleFilter={handleFilter}
            lower={lower}
            upper={upper}
            handleLower={handleLower}
            handleUpper={handleUpper}
          />
          <StatBar
            totalDuration={totalDuration}
            numProblems={numProblems}
          />
        </div>
      </div>
    </div>
  );
}
