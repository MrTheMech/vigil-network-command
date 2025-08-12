// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // replace if needed
  password: 'ANUprajwal',         // replace with your password
  database: 'drug_detection_db'  // create this or replace with your DB name
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID', db.threadId);
});

module.exports = db;
