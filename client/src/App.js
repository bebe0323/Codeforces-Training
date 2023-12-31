import './App.css';
import './Sidebar.css';
import { Route, Routes, Navigate } from 'react-router-dom';

import Layout from './Layout.js';
import IndexPage from './pages/IndexPage.js';
import LoginPage from './auth-pages/LoginPage.js';
import RegisterPage from './auth-pages/RegisterPage.js';
import { UserContextProvider } from './UserContext.js';
import AddProblemPage from './problem/AddProblem.js';
import SkippedList from './problemList/SkippedList.js';
import TodoList from './problemList/TodoList.js';
import SolvedList from './problemList/SolvedList.js';
import Solving from './problem/Solving.js';

export const backendURL = 'https://cp-training-backend.onrender.com';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/problem/add" element={<AddProblemPage />} />
          <Route path="/list/todo" element={<TodoList />} />
          <Route path="/list/skipped" element={<SkippedList />} />
          <Route path="/list/solved" element={<SolvedList />} />
          <Route path="/problem/solving" element={<Solving />} />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
