import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { backendURL } from '../App.js';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('Register');

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setButtonMessage('Registering');
    const response = await fetch(`${backendURL}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    setLoading(false);
    setButtonMessage('Register');
    if (response.status === 200) {
      setRedirect(true);
      // alert('successful registration');
    } else {
      response.json()
        .then((data) => alert(data));
    }
  }
  if (redirect === true) {
    return <Navigate to="/login" />;
  }

  return (
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
      <Button disabled={loading} className="authSubmitButton" onClick={handleRegister} variant="secondary">
        {buttonMessage}
      </Button>
    </form>
  );
}
