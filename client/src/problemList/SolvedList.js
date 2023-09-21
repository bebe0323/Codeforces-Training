import React, { useEffect, useState } from "react";
import { backendURL } from "../App.js";
import { findDifMinute } from "./date.js";
import { FilterBox } from "./FilterBox.js";
import Table from "./Table.js";

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
          <Table
            problemList={problemList}
            isSolved={true}
            refresh={refresh}
            setRefresh={setRefresh}
          />
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
