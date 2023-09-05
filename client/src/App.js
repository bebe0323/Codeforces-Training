import './App.css';
import {Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import AddProblemPage from './pages/AddProblemPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element = {<Layout />}>
          <Route index element = {<IndexPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/addProblem' element={<AddProblemPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;