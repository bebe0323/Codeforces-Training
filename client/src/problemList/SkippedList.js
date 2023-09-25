import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader.js";
import { backendURL } from "../App.js";
import Table from "./components/Table.js";

export default function SkippedList() {
  const [problemList, setProblemList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [redirect, setRedirect] = useState('');

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
        } else if (response.status === 401) {
          // unauthorised
          alert('Login first');
          setRedirect('login');
        } else {
          response.json()
            .then(data => alert(data))
        }
        setFirstFetch(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    fetchSolved();
  }, [refresh]);
  
  if (redirect === 'login') {
    return <Navigate to={'/login'} />
  }
  return (
    <div>
      {firstFetch && (
        <div className="loading">
          <RingLoader color="#36d7b7" size={120}/>
        </div>
      )}
      {!firstFetch && (
        <div>
          <h1>Skipped List</h1>
          <Table
            problemList={problemList}
            isSkipped={true}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </div>
      )}
    </div>
  );
}
