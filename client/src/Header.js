import { Link } from "react-router-dom"
import { useEffect, useContext } from "react"
import { UserContext } from "./UserContext";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Header() {
  const {userInfo, setUserInfo} = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
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
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUserInfo(null);
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Codeforces Training</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            
            <NavDropdown title="Problem list" id="basic-nav-dropdown">
              <NavDropdown.Item href="/todoList">Todo</NavDropdown.Item>
              <NavDropdown.Item href="/skippedList">
                Skipped
              </NavDropdown.Item>
              <NavDropdown.Item href="/solvedList">Solved</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    // <header>
    //   <Link to="/" className="logo">My Codeforces</Link>
    //   <nav>
    //     {userInfo && (
    //       <>
    //         <Link to="/solving">Solving</Link>
    //         <Link to="/addProblem">Add problem</Link>
    //         <Link to="/todoList">Todo</Link>
    //         <Link to="/skippedList">Skipped</Link>
    //         <Link to="/solvedList">Solved</Link>
    //         <a onClick={logout}>Logout</a>
    //       </>
    //     )}
    //     {!userInfo && (
    //       <>
    //         <Link to="/login">Login</Link>
    //         <Link to="/register">Register</Link>
    //       </>
    //     )}
    //   </nav>
    // </header>
  );
}