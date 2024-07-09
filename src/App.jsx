import React, { useState,useEffect } from 'react';
import TodoList from './components/TodoList'; 
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import RegisterLogin from './register_login/register_login';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userid, setUserid] = useState('');
  // const [username, setUsername] = useState('');
  //const navigate = useNavigate();
  //const navigate = useNavigate(); // 在组件内部调用 useNavigate 钩子
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    return storedIsLoggedIn === 'true';
  });
  const [username, setUsername] = useState(() => sessionStorage.getItem('username') || '');
  const [userid, setUserid] = useState(() => sessionStorage.getItem('userid') || '');

  useEffect(() => {
    // 检查 sessionStorage 中的标记
    const sessionStarted = sessionStorage.getItem('sessionStarted');
    if (!sessionStarted && isLoggedIn) {
      // 如果没有 session 标记且用户已经登录，则清除登录状态并重定向
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userid');
      setIsLoggedIn(false);
      setUsername('');
      setUserid('');
      //navigate('/register');
    }
    // 设置 session 标记
    sessionStorage.setItem('sessionStarted', 'true');
  // }, [isLoggedIn, navigate]);
  }, [isLoggedIn]);
  

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
  
  // useEffect(() => {
  //   // 在组件加载时检查用户是否已登录，如果没有登录则重定向到登录页面
  //   if (!isLoggedIn) {
  //     navigate('/register');
  //   }
  // }, [isLoggedIn, navigate]);
  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userid', userid);
  }, [isLoggedIn, username, userid]);

//   return (
// //     <Router>
// //   <Routes>
// //     <Route path="/register" element={<RegisterLogin setIsLoggedIn={setIsLoggedIn} setUserid={setUserid}/>} />
// //     <Route path="/todolist/:userid" element={<TodoList />} />
// //     <Route path="/" element={isLoggedIn ? <Navigate to={`/todolist/${userid}`} /> : <Navigate to="/register" />} />
// //   </Routes>
// // </Router>
//    <Router>
//    <Routes>
//        <Route path="/register" element={<RegisterLogin setIsLoggedIn={setIsLoggedIn} setUserid={setUserid} setUsername={setUsername} />} />
//        <Route path="/todolist/:userid" element={<TodoList username={username} userid={userid} /> } />
//        <Route path="/" element={isLoggedIn ? <Navigate to={`/todolist/${userid}`} /> : <Navigate to="/register" />} />
//    </Routes>
// </Router>
//   );
// }

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
