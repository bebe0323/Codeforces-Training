import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../App.js";
import Table from "./Table.js";

export default function TodoList() {
  const navigate = useNavigate();
  const [problemList, setProblemList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchData() {
      try {
        const response = await fetch(`${backendURL}/list/${'todo'}`, {
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
  }, [refresh]);

  async function handleStart(problemId) {
    const response = await fetch(`${backendURL}/problem/update`, {
      method: 'PUT',
      body: JSON.stringify({
        problemId: problemId,
        preStatus: 'todo',
        status: 'solving',
        note: ''
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      navigate("/problem/solving");
    } else {
      response.json()
        .then(data => alert(data))
    }
  }
  
  return (
    <div>
      <h1>Todo List</h1>
      <Table
        problemList={problemList}
        handleStart={handleStart}
        isTodo={true}
        refresh={refresh}
        setRefresh={setRefresh}
      />      
    </div>
  );
}
