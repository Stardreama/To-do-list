import React, { useState } from 'react';
import { DatePicker, Input, Row, Col, Button, Flex } from 'antd';
function App() {
  const titleStyle = {
    fontSize: 30,
    textAlign: "center",
  }
  const inputAdd = {
    width: 400
  }
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
    }
    else {
      console.log("11111");
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={titleStyle}> To Do List</h1>
      <div>
        <Row>
          <Col style={inputAdd}>
            <Input placeholder="输入任务名称" onChange={(e) => getName(e.target.value)} />
          </Col>
        </Row>
        <Row >
          <Col >
            <DatePicker onChange={handleDateChange} placeholder="选择截止时间" />
            <Button type="primary" name={name} date={date} onClick={handleAdd}>添加</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default App;
