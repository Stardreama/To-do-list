import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register_login.css';

const RegisterLogin = ({ setIsLoggedIn,setUserid,setUsername }) => {
    //const [isRegister, setIsRegister] = useState(false);
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(" handlesubmit");
        const submitter = e.nativeEvent.submitter;
        const url = submitter.name === 'register' ? 'http://localhost:3000/register' : 'http://localhost:3000/login';
        const action = submitter.name === 'register' ? 'Registration' : 'Login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        console.log(response);
        if (response.ok) {
        // if (true) {
            const data = await response.json();
            setIsLoggedIn(true);
            console.log(" response id=",data.userid);
            setUserid(data.userid);  // 假设后端返回的JSON中包含userId字段
            setUsername(data.username);
            console.log(" ---test---");
            navigate(`/todolist/${data.userid}`);
        } else {
            alert(`${action} failed`);
        }
    };

    return (
    <div className="outer-background">
    <form action="" className="login" onSubmit={handleSubmit}>
    <p>Login</p>
    <input type="text" placeholder="用户名" name='username' value={username} onChange={(e)=>{
         setLocalUsername(e.target.value)
    }}/>
    <input type="password" placeholder="密码" name='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
    <input type="submit" className="btn" name='register' value="注  册" />
    <input type="submit" className="btn" name='login' value="登  录" />
</form>
    </div>
    );
};

export default RegisterLogin;
