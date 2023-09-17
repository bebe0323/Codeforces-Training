import { Link, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { backendURL } from "./App.js";

export default function Header() {
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = useContext(UserContext);

  useEffect(() => {
    fetch(`${backendURL}/profile`, {
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
    fetch(`${backendURL}/logout`, {
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
            <Link to="/problem/solving">Solving</Link>
            <Link to="/problem/add">Add problem</Link>
            <Link to="/list/todo">Todo</Link>
            <Link to="/list/skipped">Skipped</Link>
            <Link to="/list/solved">Solved</Link>
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
