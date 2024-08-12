import React, { useState, useEffect } from 'react';
import { DatePicker, Input, Row, Col, Button, Checkbox, message } from 'antd';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import '../App.css'
function TodoList({ username, userid, setIsLoggedIn, isLoggedIn }) {
    const navigate = useNavigate(); 
    const [messageApi, contextHolder] = message.useMessage();
    const [flag, setFlag] = useState(0)
    const [toDoList, setToDoList] = useState([])
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [objectDateNow, setObjectDateNow] = useState(moment().format('YYYY-MM-DD'))
    const [keyValue, setKeyValue] = useState('')

    useEffect(() => {
        document.title = "Todo List";
        const timer = setInterval(() => {
            setObjectDateNow(moment().format('YYYY-MM-DD'))
        }, 60000)
        return () => clearInterval(timer)
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getTasks/${userid}`);
                const tasks = await response.json();
                setToDoList(tasks.map(task => ({
                    id: task.taskid,
                    toDoName: task.taskinfo,
                    toDoTime: moment(task.ddl).format('YYYY-MM-DD'),
                    isFinished: task.status === 1,
                    targetTime: moment(task.ddl).format('YYYY-MM-DD')
                })));
                setFlag(tasks.length)
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, [userid]);
    const handleLogout = () => {

        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        message.success('成功退出登录');
        setIsLoggedIn(false);
        navigate('/register');
    };

    const handleDateChange = (date, dateString) => {
        setDate(moment(dateString).format("YYYY-MM-DD"))
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: '请输入任务名称和截止时间',
        });
    };

    const getName = (name) => {
        setName(name)
    }
    const handleAdd = async () => {
        if (name && date) {
            const targetTime = moment(date).format("YYYY-MM-DD");
            const newTask = {
                id: uuidv4(),
                toDoName: name,
                toDoTime: date,
                isFinished: false,
                targetTime: targetTime
            };
            try {
                const response = await fetch('http://localhost:3000/addTask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userid, taskid: newTask.id, taskinfo: name, ddl: date, status: 0 })
                });
                if (response.ok) {
                    setToDoList([...toDoList, newTask]);
                    setKeyValue(new Date());
                    setFlag(flag + 1);
                    setName('');
                    setDate('');
                } else {
                    throw new Error('Failed to add task');
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
        else {
            error()
        }
    }
    const handleFinish = async (id) => {
        const updatedTask = toDoList.find(task => task.id === id);
        const newStatus = !updatedTask.isFinished;
        try {
            const response = await fetch('http://localhost:3000/updateTaskStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskid: id, status: newStatus ? 1 : 0 })
            });
            if (response.ok) {
                setToDoList(toDoList.map(task =>
                    task.id === id ? { ...task, isFinished: newStatus } : task
                ));
            } else {
                throw new Error('Failed to update task status');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/deleteTask/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                message.success('任务删除成功');
                setToDoList(toDoList.filter(item => item.id !== id));
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            message.error('删除任务失败');
        }
    };
    return (
        <div className='box'>
            {contextHolder}
            <h1 className='title'> To Do List</h1>
            <h3 style={{ display: 'inline' }}>
    用户 <span style={{ color: 'blue' }}>{username}</span>，欢迎你的使用！
    <Button type="primary" onClick={handleLogout}>退出登录</Button>
</h3>

            <div >
                <Row>
                    <Col className='inputAdd'>
                        <Input placeholder="输入任务名称" value={name} onChange={(e) => getName(e.target.value)} />
                    </Col>
                </Row>
                <Row >
                    <Col >
                        <DatePicker onChange={handleDateChange} key={keyValue} placeholder="选择截止时间" />
                        <Button type="primary" name={name} date={date} onClick={handleAdd}>添加</Button>
                    </Col>
                </Row>
                {flag > 0 || (<div className='nodata'>
                    <InboxOutlined className='InboxOutlined' />
                    <div> No Data</div>
                </div>)}
            </div>
            {toDoList.map(item => (
                <div className='content'>
                    <Row key={item.id} className='row'>
                        <Col className='col'>
                            {item.isFinished ? (<div className='finish'>{item.toDoName}</div>) : (<div className={objectDateNow > item.targetTime ? 'overtime' : 'intime'}>{item.toDoName}</div>)}
                            {item.isFinished ? (<div className='finish'>{item.toDoTime}</div>) : (<div className={objectDateNow > item.targetTime ? 'overtime' : 'intime'}>{item.toDoTime}</div>)}
                        </Col>
                        <Col className='checkrow'>
                            <Checkbox checked={item.isFinished ? true : false} onChange={() => handleFinish(item.id)}></Checkbox>
                        </Col >
                        <Col><DeleteOutlined onClick={() => handleDelete(item.id)} className='checkrow' /></Col>
                    </Row>
                </div>
            ))
            }
        </div >
    );
}
export default TodoList;
