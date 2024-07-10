const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { message } = require('antd');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',//登陆mysql的用户名
    password: '20050127a',//登陆mysql的密码
    database: 'todolistuser',//数据库名称
    port: 3306
});

const addUser = async (username, passwordHash) => {
    const id = uuidv4();
    try {
        const [result] = await pool.query("INSERT INTO userinfo (id, name, password) VALUES (?, ?, ?)", [id, username, passwordHash]);
        return { id, username };
    } catch (err) {
        throw err;
    }
};

const findUser = async (username) => {
    try {
        const [result] = await pool.query("SELECT * FROM userinfo WHERE name = ?", [username]);
        if (result.length === 0) {
            return null;
        } else {
            return result[0];
        }
    } catch (err) {
        throw err;
    }
};
// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        const existingUser = await findUser(username);
        if (existingUser) {
            return res.status(400).json({ message: '用户名被占用' });
        }
        const user = await addUser(username, passwordHash);
        res.status(201).json({ userid: user.id, username: user.name, message: 'User registered!' });
    } catch (err) {
        console.error("Error in addUser:", err);
        res.status(400).json('Error: ' + err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUser(username);
        if(user){
            if (await bcrypt.compare(password, user.password)) {
                res.status(200).json({ userid: user.id, username: user.name });
            } else {
                res.status(400).json({ message: '密码或用户名错误' });
            }
        }
        else{
            res.status(400).json({ message: '用户名不存在' });
        }
    } catch (err) {
        console.error("Error in addUser:", err);
        res.status(400).json('Error: ' + err);
    }
});

// Add new task
app.post('/addTask', async (req, res) => {
    const { userid, taskid, taskinfo, ddl, status } = req.body;
    try {
        const [result] = await pool.query("INSERT INTO usertask (userid, taskid, taskinfo, ddl, status) VALUES (?, ?, ?, ?, ?)", [userid, taskid, taskinfo, ddl, status]);
        res.status(201).json('Task added!');
    } catch (err) {
        console.error("Error in addTask:", err);
        res.status(400).json('Error: ' + err);
    }
});

// Get tasks for a user
app.get('/getTasks/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const [result] = await pool.query("SELECT * FROM usertask WHERE userid = ?", [userid]);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error in getTasks:", err);
        res.status(400).json('Error: ' + err);
    }
});

// 更新任务完成状态的逻辑
app.post('/updateTaskStatus', async (req, res) => {
    const { taskid, status } = req.body;
    const sql = 'UPDATE usertask SET status = ? WHERE taskid = ?';
    const values = [status, taskid];
    try {
        // 使用连接池进行查询
        const [rows] = await pool.query(sql, values);
        res.status(200).send('Task status updated successfully');
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).send('Error updating task status');
    }
});

// 删除任务
app.delete('/deleteTask/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM usertask WHERE taskid = ?';
    const values = [id];
    try {
        // 使用连接池进行查询
        const [rows] = await pool.query(sql, values);
        res.status(200).send('Task delete successfully');
    } catch (error) {
        console.error('Error delete task status:', error);
        res.status(500).send('Error delete task ');
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
