const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors({
  origin: '*',  // หรือ '*' หากต้องการให้เข้าถึงจากทุกที่
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running'); // หรือส่ง response อื่นๆ ตามต้องการ
});
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

app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body); 

  const { username, password } = req.body;  

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM tb_user WHERE username = ?';
  connection.execute(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ success: false, message: 'Error querying database' });
    }

    if (results.length > 0) {
      const user = results[0];  

      if (user.password === password) {
        res.status(200).json({ success: true, message: 'Login successful', user: user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
module.exports = app;