import { useEffect, useState } from "react";

export default function TodoList() {
  const [problemList, setProblemList] = useState(null);
  useEffect(() => {
    // using async function here to avoid use async TodoList()
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:4000/problems/${'todo'}`, {
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
  }, []);

  function handleStart(problemId) {
    
  }

  async function handleRemove(problemId) {
    const response = await fetch(`http://localhost:4000/remove/${problemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      window.location.reload();
    } else {
      response.json()
        .then(error => console.log(error))
    }
  }
  
  return (
    <div>
      <h1>Todo List</h1>
      {problemList !== null ? (
        <>
          <table>
            <thead>
              <tr>
                <th style={{width: '3.75em', }}>#</th>
                <th style={{textAlign: 'center'}}>Name</th>
                <th style={{width: '2.5em'}}>Difficulty</th>
                <th>Date added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problemList.map((item, index) => (
                <tr key={index}>
                  <td>{item.problemId}</td>
                  <td>{item.title}</td>
                  <td>{item.difficulty}</td>
                  <td>{item.addedDate}</td>
                  <td>
                    <button onClick={() => handleStart(item.problemId)}>Start solving</button>
                    <button onClick={() => handleRemove(item.problemId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ): (
        <>
          Loading
        </>
      )}
    </div>
  );
}
