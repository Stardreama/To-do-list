import React from 'react';
import { DatePicker, Space, Input,Row,Col } from 'antd';
const onChange = (date, dateString) => {
  console.log(date, dateString);
};
function App() {
  const all_style={
    width:500
  }
  const titleStyle = {
    fontSize: 30,
    textAlign: "center",
  }
  const contentStyle = {
    textAlign: "center",
  }
  return (
    <div >
      <h1 style={titleStyle}> To Do List</h1>
      <div style={contentStyle}>
        <div >
          <Input placeholder="输入任务名称" style={{ width: 500 }} />
        </div>
        <div>
          <Space direction="vertical">
            <DatePicker onChange={onChange} placeholder="选择截止时间" />
          </Space>
        </div>
      </div>
    </div>
  );
}

export default App;
