// server/db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Tham1234!', // Match your database.sql password
  database: 'cleaning_app', // Match your database.sql DB name
});

module.exports = db;
