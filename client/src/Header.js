import { Link, useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import { UserContext } from "./UserContext";

export default function Header() {
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = useContext(UserContext);

  useEffect(() => {
    fetch('https://cp-training-backend.onrender.com/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        setUserInfo(data.username);
      })
  }, []);

  function logout() {
    fetch('https://cp-training-backend.onrender.com/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUserInfo(null);
    navigate('/');
  }
  return(
    <header>
      <Link to="/" className="logo">My Codeforces</Link>
      <nav>
        {userInfo && (
          <>
            <Link to="/solving">Solving</Link>
            <Link to="/addProblem">Add problem</Link>
            <Link to="/todoList">Todo</Link>
            <Link to="/skippedList">Skipped</Link>
            <Link to="/solvedList">Solved</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!userInfo && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}