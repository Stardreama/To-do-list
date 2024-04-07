import React, { useState, useRef } from 'react';
import { DatePicker, Input, Row, Col, Button, Typography, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid'
function App() {
  const titleStyle = {
    fontSize: 30,
    textAlign: "center",
  }
  const inputAdd = {
    width: 400
  }
  const { Text, Link } = Typography;
  const [toDoList, setToDoList] = useState([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const handleDateChange = (date, dateString) => {
    console.log(dateString);
    setDate(dateString)
  };
  const getName = (name) => {
    setName(name)
  }
  const handleAdd = () => {
    if (name && date) {
      console.log(name, date);
      setToDoList([
        ...toDoList,
        {
          toDoName: name,
          toDoTime: date,
          id: uuidv4()
        }
      ])
    }
    else {
      console.log("11111");
    }
  }
  const handleFinish = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handleDelete = (id) => {
    setToDoList(toDoList.filter(item => item.id !== id))
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={titleStyle}> To Do List</h1>
      <div>
        <Row>
          <Col style={inputAdd}>
            <Input placeholder="输入任务名称"  onChange={(e) => getName(e.target.value)} />
          </Col>
        </Row>
        <Row >
          <Col >
            <DatePicker onChange={handleDateChange} placeholder="选择截止时间" />
            <Button type="primary" name={name} date={date} onClick={handleAdd}>添加</Button>
          </Col>
        </Row>
      </div>
      {toDoList.map(item => (
        <div style={inputAdd}>
          <Row key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Col style={{ marginRight: 250 }}>
              <div>{item.toDoName}</div>
              <div>{item.toDoTime}</div>
            </Col>
            <Col style={{ marginRight: 30 }}>
              <Checkbox onChange={handleFinish}></Checkbox>

            </Col >
            <Col><DeleteOutlined onClick={() => handleDelete(item.id)} /></Col>
          </Row>
        </div>
      ))}

    </div>
  );
}
export default App;
