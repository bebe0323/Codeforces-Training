import './App.css';
import {Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import AddProblemPage from './pages/AddProblemPage';
import SkippedList from './problemList/SkippedList';
import TodoList from './problemList/TodoList';
import SolvedList from './problemList/SolvedList';
import Solving from './pages/Solving';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element = {<Layout />}>
          <Route index element = {<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/addProblem' element={<AddProblemPage />} />
          <Route path='/todoList' element={<TodoList />} />
          <Route path='/skippedList' element={<SkippedList />} />
          <Route path='/solvedList' element={<SolvedList />} />
          <Route path='/solving' element={<Solving />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
