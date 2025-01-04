const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// ใช้ CORS และ Body Parser
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

// เส้นทางหลัก
app.get('/', (req, res) => {
  res.send('Server is running');
});

// เชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: 'autorack.proxy.rlwy.net',
  user: 'root',
  password: 'AkzhzdvDwdkgqGbFIiNHIoDYgwptRmvb',
  database: 'railway',
  port: 43563,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database!');
});

// API สำหรับการล็อกอิน
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const query = 'SELECT password FROM tb_user WHERE username = ?';
  connection.execute(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ success: false, message: 'Error querying database' });
    }

    if (results.length > 0) {
      const user = results[0];

      if (user.password === password) {
        res.status(200).json({
          success: true,
          message: 'Login successful',
          user: {
            firstname: user.firstname,
            lastname: user.lastname,
            queue: user.queue === true,
          },
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password...' });
    }
  });
});


// API สำหรับการดึงข้อมูลผู้ใช้ตาม username
app.post('/api/getUserData', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  const query = 'SELECT firstname, lastname, queue FROM tb_user WHERE username = ?';
  connection.execute(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ success: false, message: 'Error querying database..' });
    }

    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({
        success: true,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          queue: user.queue === true,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
