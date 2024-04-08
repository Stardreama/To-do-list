import React, { useState, useEffect } from 'react';
import { DatePicker, Input, Row, Col, Button, Typography, Checkbox, message } from 'antd';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
function App() {
  const titleStyle = {
    fontSize: 30,
    textAlign: "center",
  }
  const inputAdd = {
    width: 400
  }
  useEffect(() => {
    document.title = "Todo List";
  }, []);
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(0)
  const [toDoList, setToDoList] = useState([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [objectDateNow, setObjectDateNow] = useState(moment().format('YYYY-MM-DD'))
  const [keyValue, setKeyValue] = useState('')
  const handleDateChange = (date, dateString) => {
    console.log(dateString);
    console.log("------");
    console.log(moment(dateString).format("YYYY-MM-DD"));
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
      console.log(name, date);
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
      console.log("11111");
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {contextHolder}
      <h1 style={titleStyle}> To Do List</h1>
      <div>
        <Row>
          <Col style={inputAdd}>
            <Input placeholder="输入任务名称" value={name} onChange={(e) => getName(e.target.value)} />
          </Col>
        </Row>
        <Row >
          <Col >
            <DatePicker onChange={handleDateChange} key={keyValue} placeholder="选择截止时间" />
            <Button type="primary" name={name} date={date} onClick={handleAdd}>添加</Button>
          </Col>
        </Row>
        {flag > 0 || (<div style={{ marginLeft: 150, marginTop: 100 }}>
          <InboxOutlined style={{ fontSize: 50, color: '#e6e6e6' }} />
          <div style={{ color: '#e6e6e6' }}> No Data</div>
        </div>)}
      </div>
      {toDoList.map(item => (
        <div style={inputAdd}>
          <Row key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Col style={{ marginRight: 250 }}>
              {item.isFinished ? (<div style={objectDateNow > item.targetTime ? { color: 'red', textDecoration: 'line-through' } : { color: 'black', textDecoration: 'line-through' }}>{item.toDoName}</div>) : (<div style={objectDateNow > item.targetTime ? { color: 'red' } : { color: 'black' }}>{item.toDoName}</div>)}
              {item.isFinished ? (<div style={objectDateNow > item.targetTime ? { color: 'red', textDecoration: 'line-through' } : { color: 'black', textDecoration: 'line-through' }}>{item.toDoTime}</div>) : (<div style={objectDateNow > item.targetTime ? { color: 'red' } : { color: 'black' }}>{item.toDoTime}</div>)}
              {objectDateNow > item.targetTime ? (console.log('red', '当前时间为', objectDateNow, '目标', item.targetTime)) : console.log('black', '当前时间为', objectDateNow, '目标', item.targetTime)}
            </Col>
            <Col style={{ marginRight: 30 }}>
              <Checkbox onChange={() => handleFinish(item.id)}></Checkbox>
            </Col >
            <Col><DeleteOutlined onClick={() => handleDelete(item.id)} /></Col>
          </Row>
        </div>
      ))
      }
    </div >
  );
}
export default App;
