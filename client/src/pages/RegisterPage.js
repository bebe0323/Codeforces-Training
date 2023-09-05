import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function handleRegister(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });
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
    <form action="" className="register" onSubmit={handleRegister}>
      <h1>Register</h1>
      <input
        className="userAuthInput"
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        className="userAuthInput"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button className="userAuthSubmit">Register</button>
    </form>
  )
}