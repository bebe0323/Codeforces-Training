import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch('https://cp-training-backend.onrender.com/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 200) {
      response.json()
        .then(data => {
          setUserInfo(data);
          setRedirect(true);
          alert('login successful');
        })
    } else {
      response.json()
        .then(data => alert(data))
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />;
  }
  return (
    <>
      <h1>Login</h1>
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
        <Button className="authSubmitButton" onClick={handleLogin} variant="secondary">Login</Button>
      </form>
    </>
  )
}