import { useState } from "react";
import { Navigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/register', {
        username, password
      });
      alert('Registration successful');
      setRedirect(true);
    } catch(error) {
      console.log(error.response.data);
    }
  }
  if (redirect === true) {
    return <Navigate to={'/login'} />
  }
  return(
    <>
      <h1>Register</h1>
      <form className="login">
        <FloatingLabel
          controlId="floatingInput"
          label="username"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FloatingLabel>
        <Button className="authSubmitButton" onClick={handleRegister} variant="secondary">Register</Button>
      </form>
    </>
  )
}