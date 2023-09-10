import { Link, useSearchParams } from "react-router-dom"
import { useEffect, useContext, useState } from "react"
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";
import axios from 'axios';

export default function Header() {
  const {userInfo, setUserInfo} = useContext(UserContext);
  
  useEffect(() => {
    axios.get('/profile')
      .then(response => {
        setUserInfo(response.data.username);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  async function logout() {
    console.log('log out pressed');
    try {
      await axios.post('/logout');
      setUserInfo(null);
      window.location.href = '/';
    } catch(error) {
      console.log(error);
    }
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