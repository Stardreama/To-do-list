const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20050127a',
    database: 'todolistuser',
    port: 3306
});

// Initialize MySQL database
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '20050127a',
//     database: 'todolistuser',
//     port:3306
// });

// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL00000000');

//     // Create users table if it doesn't exist
//     // db.query(`
//     //     CREATE TABLE IF NOT EXISTS users (
//     //         id INT AUTO_INCREMENT PRIMARY KEY,
//     //         username VARCHAR(255) NOT NULL UNIQUE,
//     //         password VARCHAR(255) NOT NULL
//     //     )
//     // `, (err, result) => {
//     //     if (err) throw err;
//     //     console.log('Users table ready');
//     // });
// });

// Helper functions
// const addUser = (username, passwordHash) => {
//     return new Promise((resolve, reject) => {
//         console.log("generateid");
//         const id = uuidv4();
//         console.log("---adduser---id-",id,"--name-",username);
//         db.query("INSERT INTO userinfo (id,name, password) VALUES (?,?, ?)", [id,username, passwordHash], (err, result) => {
//             if (err) reject(err);
//             console.log("到这里了");
//             resolve();
//             console.log("end");
//         });
//         console.log("***1231223--*");
//     });
// };
const addUser = async (username, passwordHash) => {
    const id = uuidv4();
    try {
        const [result] = await pool.query("INSERT INTO userinfo (id, name, password) VALUES (?, ?, ?)", [id, username, passwordHash]);
        return { id, username }; // 返回包含 id 和 username 的对象
    } catch (err) {
        throw err;
    }
};
// const findUser = (username) => {
//     return new Promise((resolve, reject) => {
//         db.query("SELECT * FROM userinfo WHERE name = ?", [username], (err, result) => {
//             if (err) reject(err);
//             else {
//                 if (result.length === 0) {
//                     console.log("finduserError");
//                     resolve(null); // or you can reject with a custom error
//                 } else {
//                     resolve(result[0]);
//                 }
//             }
//         });
//     });
// };
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
    console.log("----serverAddUser-----");
    console.log(username, "----", password);
    try {
        const user = await addUser(username, passwordHash); await addUser(username, passwordHash);
        console.log(user);
        console.log("2222");
        res.status(201).json({ userid: user.id, username: user.name, message: 'User registered!' });
    } catch (err) {
        console.error("Error in addUser:", err); // 捕获并打印错误
        res.status(400).json('Error: ' + err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, "---", password);
    try {
        console.log("*1111*");
        const user = await findUser(username);
        console.log("*2222*");
        if (user && await bcrypt.compare(password, user.password)) {

            res.status(200).json({ userid: user.id, username: user.name, message: 'Login successful' });
            console.log(user);
            console.log("*3333*");
        } else {
            res.status(400).json('Invalid username or password');
            console.log("*4444*");
        }
        console.log("*5555*");
    } catch (err) {
        console.log("*6666*");
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
        console.log(" gettask,userid=",userid);
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
app.delete('/deleteTask/:id', async(req, res) => {
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
