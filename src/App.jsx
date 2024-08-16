import React, { useState,useEffect } from 'react';
import TodoList from './components/TodoList'; 
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import RegisterLogin from './register_login/register_login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    return storedIsLoggedIn === 'true';
  });
  const [username, setUsername] = useState(() => sessionStorage.getItem('username') || '');
  const [userid, setUserid] = useState(() => sessionStorage.getItem('userid') || '');

  useEffect(() => {
    const sessionStarted = sessionStorage.getItem('sessionStarted');
    if (!sessionStarted && isLoggedIn) {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userid');
      setIsLoggedIn(false);
      setUsername('');
      setUserid('');
    }
    sessionStorage.setItem('sessionStarted', 'true');
  }, [isLoggedIn]);
  

  useEffect(() => {
    if (!isLoggedIn) {
      document.body.style.backgroundImage = 'url(/wallpaper.jpg)';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.background = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundAttachment = '';
    }
  }, [isLoggedIn]);
  
  
  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userid', userid);
  }, [isLoggedIn, username, userid]);


return (
  <Router>
    <Routes>
      <Route path="/register" element={<RegisterLogin setIsLoggedIn={setIsLoggedIn} setUserid={setUserid} setUsername={setUsername} />} />
      <Route path="/todolist/:userid" element={<TodoList username={username} userid={userid} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
      <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn} />} />
    </Routes>
  </Router>
);
}

function PrivateRoute({ isLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/register');
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? <Navigate to={`/todolist/${sessionStorage.getItem('userid')}`} /> : null;
}
export default App;
