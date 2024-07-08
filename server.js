const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Initialize MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20050127a',
    database: 'todolistuser',
    port:3306
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL00000000');

    // Create users table if it doesn't exist
    // db.query(`
    //     CREATE TABLE IF NOT EXISTS users (
    //         id INT AUTO_INCREMENT PRIMARY KEY,
    //         username VARCHAR(255) NOT NULL UNIQUE,
    //         password VARCHAR(255) NOT NULL
    //     )
    // `, (err, result) => {
    //     if (err) throw err;
    //     console.log('Users table ready');
    // });
});

// Helper functions
const addUser = (username, passwordHash) => {
    return new Promise((resolve, reject) => {
        console.log("generateid");
        const id = uuidv4();
        console.log("---adduser---id-",id,"--name-",username);
        db.query("INSERT INTO userinfo (id,name, password) VALUES (?,?, ?)", [id,username, passwordHash], (err, result) => {
            if (err) reject(err);
            console.log("到这里了");
            resolve();
            console.log("end");
        });
        console.log("***1231223--*");
    });
};

const findUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM userinfo WHERE name = ?", [username], (err, result) => {
            if (err) reject(err);
            else {
                if (result.length === 0) {
                    console.log("finduserError");
                    resolve(null); // or you can reject with a custom error
                } else {
                    resolve(result[0]);
                }
            }
        });
    });
};

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("----serverAddUser-----");
    console.log(username,"----",password);
    try {
        await addUser(username, passwordHash);
        console.log("2222");
        res.status(201).json({ userid: user.id,username: user.name, message: 'User registered!' });
    } catch (err) {
        console.error("Error in addUser:", err); // 捕获并打印错误
        res.status(400).json('Error: ' + err);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username,"---",password);
    try {
        console.log("*1111*");
        const user = await findUser(username);
        console.log("*2222*");
        if (user && await bcrypt.compare(password, user.password)) {
            
            res.status(200).json({ userid: user.id,username: user.name, message: 'Login successful' });
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
app.post('/addTask', (req, res) => {
    const { userId, taskid, taskinfo, ddl } = req.body;
    db.query("INSERT INTO usertask (userid, taskid, taskinfo, ddl) VALUES (?, ?, ?, ?)", [userId, taskid, taskinfo, ddl], (err, result) => {
        if (err) {
            console.error("Error in addtask:", err);
            res.status(400).json('Error: ' + err);
        } else {
            res.status(201).json('Task added!');
        }
    });
});

// Get tasks for a user
app.get('/getTasks/:userId', (req, res) => {
    const { userId } = req.params;
    db.query("SELECT * FROM usertask WHERE userid = ?", [userId], (err, result) => {
        if (err) {
            console.error("Error in getTask:", err);
            res.status(400).json('Error: ' + err);
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
