const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'autorack.proxy.rlwy.net',
  user: 'root',
  password: 'LISvrMfvsbSaehHHdoyhzvEqomBspTSb',
  database: 'railway',
  port: 55588,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
