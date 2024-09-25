const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promises with MySQL for async/await
const app = express();

app.use(cors());
app.use(express.json()); // In order to parse application/json
const PORT = 3000;

// Creatimg a connection pool to the database
const pool = mysql.createPool({
    host: 'localhost', // DB hostname
    user: 'root', // DB username
    password: 'Iamsneha2004#', // DB password
    database: 'crowd_db' // Database name

});

// Route to fetch all fundraisers
app.get('/fundraisers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM FUNDRAISER');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching fundraisers:', error);
        res.status(500).json({ message: 'Failed to fetch fundraisers' });
    }
});

// Route to fetch a single fundraiser by ID
app.get('/fundraiser/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Fundraiser not found' });
        }
    } catch (error) {
        console.error('Error fetching fundraiser:', error);
        res.status(500).json({ message: 'Failed to fetch fundraiser' });
    }
});

// Route to fetch categories
app.get('/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM CATEGORY');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});

// Route to search fundraisers based on query parameters (organizer, city, category)
app.get('/search', async (req, res) => {
    let query = 'SELECT * FROM FUNDRAISER WHERE 1=1'; // Basic query that always returns true
    const queryParams = [];

    if (req.query.organizer) {
        query += ' AND ORGANIZER LIKE ?';
        queryParams.push(`%${req.query.organizer}%`);
    }
    if (req.query.city) {
        query += ' AND CITY LIKE ?';
        queryParams.push(`%${req.query.city}%`);
    }
    if (req.query.category) {
        query += ' AND CATEGORY_ID = ?';
        queryParams.push(req.query.category);
    }

    try {
        const [rows] = await pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error searching fundraisers:', error);
        res.status(500).json({ message: 'Failed to search fundraisers' });
    }
});

// Route to donate to a fundraiser
app.post('/fundraiser/:id/donate', async (req, res) => {
    const { amount } = req.body;
    const fundraiserId = req.params.id;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid donation amount' });
    }

    try {
        // Updating the CURRENT_FUNDING for the fundraiser
        const [result] = await pool.query(
            'UPDATE FUNDRAISER SET CURRENT_FUNDING = CURRENT_FUNDING + ? WHERE FUNDRAISER_ID = ?',
            [amount, fundraiserId]
        );

        if (result.affectedRows > 0) {
            // Fetching the updated fundraiser data
            const [rows] = await pool.query('SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [fundraiserId]);
            res.json({ message: 'Thank you for your donation!', updatedFundraiser: rows[0] });
        } else {
            res.status(404).json({ message: 'Fundraiser not found' });
        }
    } catch (error) {
        console.error('Error processing donation:', error);
        res.status(500).json({ message: 'Failed to process donation' });
    }
});

// Starting the server on port 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`),
    console.log('Connected to MySQL!');
});

// Exporting the pool for use in other files
module.exports = pool;

