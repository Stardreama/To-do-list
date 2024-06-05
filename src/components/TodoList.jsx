import React, { useState, useEffect } from 'react';
import { DatePicker, Input, Row, Col, Button, Checkbox, message } from 'antd';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import '../App.css'
function TodoList() {

    const [messageApi, contextHolder] = message.useMessage();
    const [flag, setFlag] = useState(0)
    const [toDoList, setToDoList] = useState([])
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [objectDateNow, setObjectDateNow] = useState(moment().format('YYYY-MM-DD'))
    const [keyValue, setKeyValue] = useState('')

    useEffect(() => {
        document.title = "Todo List";
        const storedToDoList = localStorage.getItem('toDoList')
        if (storedToDoList) {
            setToDoList(JSON.parse(storedToDoList))
        }
        const timer = setInterval(() => {
            setObjectDateNow(moment().format('YYYY-MM-DD'))
        }, 60000)
        return () => clearInterval(timer)
    }, []);
    useEffect(() => {
        localStorage.setItem('toDoList', JSON.stringify(toDoList));
        setFlag(toDoList.length)
    }, [toDoList]);

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
    const handleAdd = () => {
        if (name && date) {
            const targetTime = moment(date).format("YYYY-MM-DD");
            setToDoList([
                ...toDoList,
                {
                    toDoName: name,
                    toDoTime: date,
                    id: uuidv4(),
                    isFinished: false,
                    targetTime: targetTime
                }
            ])
            setKeyValue(new Date())
            setFlag(flag + 1)
            setName('')
            setDate('')
        }
        else {
            error()
        }
    }
    const handleFinish = (id) => {
        setToDoList(toDoList.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    isFinished: !item.isFinished
                }
            }
            else {
                return item
            }
        }))
    };
    const handleDelete = (id) => {
        setToDoList(toDoList.filter(item => item.id !== id))
        setFlag(flag - 1)
    }
    return (
        <div className='box'>
            {contextHolder}
            <h1 className='title'> To Do List</h1>
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
