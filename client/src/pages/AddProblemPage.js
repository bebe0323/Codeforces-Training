import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function AddProblemPage() {
  const [difficulty, setDifficulty] = useState('easy');
  const [problemTitle, setProblemTitle] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { userInfo } = useContext(UserContext);
  console.log(`userInfo: ${userInfo}`);

  async function handleAddProblem(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/addProblem', {
      method: "POST",
      body: JSON.stringify({ problemTitle, difficulty }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      setRedirect(true);
      alert('successfully added');
    } else {
      response.json()
        .then(error => alert(error))
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }
  if (userInfo === undefined) {
    return (
      <h1>Login or Sign up first</h1>
    );
  } else {
    return(
      <div>
        <form className="problemSubmit" onSubmit={handleAddProblem}>
          <input
            className="problemTitle"
            placeholder="Problem title"
            type="text"
            value={problemTitle}
            onChange={(e) => {
              setProblemTitle(e.target.value)
            }}
          />
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}
