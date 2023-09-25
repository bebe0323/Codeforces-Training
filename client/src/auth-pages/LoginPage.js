import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import { UserContext } from '../UserContext.js';
import { backendURL } from '../App.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('Log in');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setButtonMessage('Logging in');
    const response = await fetch(`${backendURL}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    setLoading(false);
    setButtonMessage('Log in');
    if (response.status === 200) {
      response.json()
        .then((data) => {
          setUserInfo(data);
          setRedirect(true);
        });
    } else {
      response.json()
        .then((data) => alert(data));
    }
  }
  if (redirect) {
    return <Navigate to="/" />;
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
      <Button disabled={loading} className="authSubmitButton" onClick={handleLogin} variant="secondary">
        {buttonMessage}
      </Button>
    </form>
  );
}
