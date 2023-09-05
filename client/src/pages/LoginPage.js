import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
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
    return <Navigate to={'/'} />
  }
  return (
    <form action="" className="login" onSubmit={handleLogin}>
      <h1>Login</h1>
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
      <button className="userAuthSubmit">Login</button>
    </form>
  )
}