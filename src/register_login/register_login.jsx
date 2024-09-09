import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './register_login.css';

const RegisterLogin = ({ setIsLoggedIn, setUserid, setUsername, IsLoggedIn }) => {

    useEffect(() => {
        document.title = "Todo List";
    }, []);

    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const usernameRegex = /^[\w-]{4,16}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*? ])[\S]{6,}$/;
        if (!usernameRegex.test(username)) {
            message.error('用户名无效:请确保用户名为4到16位的字母、数字、下划线或减号');
            return;
        }
        if (!passwordRegex.test(password)) {
            message.error('密码无效:请确保密码至少6位,包括至少1个字母、1个数字和1个特殊字符');
            return;
        }
        const submitter = e.nativeEvent.submitter;
        const url = submitter.name === 'register' ? '/api/register' : '/api/login';
        const action = submitter.name === 'register' ? '注册' : '登陆';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                message.success(submitter.name === 'register' ? '注册成功' : '登陆成功');
                setUserid(data.userid);
                setUsername(data.username);
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('userid', data.userid);
                sessionStorage.setItem('sessionStarted', 'true');
                navigate(`/todolist/${data.userid}`);
            } else {
                const errorData = await response.json();
                message.error(`${action} 失败: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error(`${action} 失败`);
        }
    };

    return (
        <div className="outer-background">
            <form action="" className="login" onSubmit={handleSubmit} autoComplete="off">
                <p>Login</p>
                <input type="text" placeholder="用户名" name='username' value={username} onChange={(e) => {
                    setLocalUsername(e.target.value)
                }} />
                <input type="password" placeholder="密码" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" className="btn" name='register' value="注  册" />
                <input type="submit" className="btn" name='login' value="登  录" />
            </form>
        </div>
    );
};

export default RegisterLogin;
