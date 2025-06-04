const express = require('express');
const path = require('path');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

// === MySQL Connection Pool Setup ===
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust if needed
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Optional: Test connection once at startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL database (pool)');
  connection.release();
});

// === Serve Frontend ===
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
