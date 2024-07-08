import React, { useState,useEffect } from 'react';
import TodoList from './components/TodoList'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterLogin from './register_login/register_login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userid, setUserid] = useState('');
  const [username, setUsername] = useState('');
  useEffect(() => {
    // 根据条件应用或删除样式
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
  
  return (
//     <Router>
//   <Routes>
//     <Route path="/register" element={<RegisterLogin setIsLoggedIn={setIsLoggedIn} setUserid={setUserid}/>} />
//     <Route path="/todolist/:userid" element={<TodoList />} />
//     <Route path="/" element={isLoggedIn ? <Navigate to={`/todolist/${userid}`} /> : <Navigate to="/register" />} />
//   </Routes>
// </Router>
   <Router>
   <Routes>
       <Route path="/register" element={<RegisterLogin setIsLoggedIn={setIsLoggedIn} setUserid={setUserid} setUsername={setUsername} />} />
       <Route path="/todolist/:userid" element={<TodoList username={username} userid={userid} /> } />
       <Route path="/" element={isLoggedIn ? <Navigate to={`/todolist/${userid}`} /> : <Navigate to="/register" />} />
   </Routes>
</Router>
  );
}

export default App;
