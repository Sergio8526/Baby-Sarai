const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Gladys8526',
  database: 'baby_sarai',
});

module.exports = pool;