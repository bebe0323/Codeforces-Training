import { Link, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { backendURL } from "./App.js";

import NavDropdown from 'react-bootstrap/NavDropdown';


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
      <Link to="/" className="logo">My CF Training</Link>
      <nav>
        {userInfo && (
          <>
            <Link to="/problem/solving">Solving</Link>
            <Link to="/problem/add">Add problem</Link>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Problem Lists"
              menuVariant="dark"
              size="sm"
            >
              <NavDropdown.Item href="/#/list/todo">Todo</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/#/list/solved">Solved</NavDropdown.Item>
              <NavDropdown.Item size="small" href="/#/list/skipped">Skipped</NavDropdown.Item>
            </NavDropdown>
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
