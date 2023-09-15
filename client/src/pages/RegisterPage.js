import { useState } from "react";
import { Navigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    setLoading(false);
    if (response.status === 200) {
      setRedirect(true);
      alert('successful registration');
    } else {
      response.json()
        .then(data => alert(data))
    }
  }
  if (redirect === true) {
    return <Navigate to={'/login'} />
  }

  return(
    <>
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
        {loading === true && (
          <Button disabled={loading} className="authSubmitButton" onClick={handleRegister} variant="secondary">Registering</Button>
        )}
        {loading === false && (
          <Button className="authSubmitButton" onClick={handleRegister} variant="secondary">Register</Button>
        )}
      </form>
    </>
  )
}