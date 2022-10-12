import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login.component';
import Main from './pages/main/main.component';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Navigate replace to='/login' />} />
      <Route exact path="/login" element={<Login/>} />
      <Route exact path='/main' element={<Main />} />
    </Routes>
  );
}

export default App;
