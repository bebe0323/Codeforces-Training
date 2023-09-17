import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';

import Layout from './Layout.js';
import IndexPage from './pages/IndexPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import { UserContextProvider } from './UserContext.js';
import AddProblemPage from './pages/AddProblemPage.js';
import SkippedList from './problemList/SkippedList.js';
import TodoList from './problemList/TodoList.js';
import SolvedList from './problemList/SolvedList.js';
import Solving from './pages/Solving.js';

export const backendURL = "https://cp-training-backend.onrender.com";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element = {<Layout />} >
          <Route index element = {<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/problem/add' element={<AddProblemPage />} />
          <Route path='/list/todo' element={<TodoList />} />
          <Route path='/list/skipped' element={<SkippedList />} />
          <Route path='/list/solved' element={<SolvedList />} />
          <Route path='/problem/solving' element={<Solving />} />
          <Route
            path="*"
            element={<Navigate to="/" replace={true} />}
          />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
