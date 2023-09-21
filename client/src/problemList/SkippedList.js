import { useEffect, useState } from "react";

import { backendURL } from "../App.js";
import Table from "./Table.js";

export default function SkippedList() {
  const [problemList, setProblemList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchSolved() {
      try {
        const response = await fetch(`${backendURL}/list/${'skipped'}`, {
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
  
  return (
    <div>
      <h1>Skipped List</h1>
      <Table
        problemList={problemList}
        isSkipped={true}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
}
