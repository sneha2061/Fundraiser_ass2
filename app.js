// app.js 
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
const PORT = 3000;

// Setup connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost', // MySQL server
  user: 'root',      // MySQL username
  password: 'Iamsneha2004#',      // MySQL password
  database: 'crowd_db'
});

// Connect to MySQL
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

// 1. Get all active fundraisers
app.get('/fundraisers', (req, res) => {
  const query = `
    SELECT f.*, c.NAME AS category_name 
    FROM FUNDRAISER f 
    JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
    WHERE f.ACTIVE = TRUE;
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 2. Get all categories
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM CATEGORY;';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 3. Search fundraisers based on criteria
app.get('/search', (req, res) => {
  const { organizer, city, category } = req.query;
  let query = `
    SELECT f.*, c.NAME AS category_name 
    FROM FUNDRAISER f 
    JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
    WHERE f.ACTIVE = TRUE
  `;
  const conditions = [];
  if (organizer) conditions.push(`f.ORGANIZER LIKE '%${organizer}%'`);
  if (city) conditions.push(`f.CITY LIKE '%${city}%'`);
  if (category) conditions.push(`f.CATEGORY_ID = ${category}`);

  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ');
  }

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 4. Get details of a specific fundraiser by ID
app.get('/fundraiser/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT f.*, c.NAME AS category_name 
    FROM FUNDRAISER f 
    JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
    WHERE f.FUNDRAISER_ID = ?;
  `;
  connection.query(query, [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the connection for use in other files
module.exports = connection;
