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

// Route to fetch a fundraiser by ID with its donations
app.get('/fundraiser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch fundraiser details
        const [fundraiser] = await pool.query('SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [id]);

        if (fundraiser.length === 0) {
            return res.status(404).json({ message: 'Fundraiser not found' });
        }

        // Fetch donations for this fundraiser
        const [donations] = await pool.query('SELECT * FROM DONATION WHERE FUNDRAISER_ID = ?', [id]);

        // Combine fundraiser details with donations
        const fundraiserDetails = {
            ...fundraiser[0],
            donations
        };

        res.json(fundraiserDetails);
    } catch (error) {
        console.error('Error fetching fundraiser details with donations:', error);
        res.status(500).json({ message: 'Failed to fetch fundraiser details' });
    }
});

// Route to add a new donation for a fundraiser
app.post('/fundraiser/:id/donate', async (req, res) => {
    const { id } = req.params;
    const { donor_name, amount } = req.body;

    if (!donor_name || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid donation details' });
    }

    try {
        // Insert new donation into the database
        await pool.query(
            'INSERT INTO DONATION (DONOR_NAME, AMOUNT, FUNDRAISER_ID) VALUES (?, ?, ?)',
            [donor_name, amount, id]
        );

        // Update current funding of the fundraiser
        await pool.query(
            'UPDATE FUNDRAISER SET CURRENT_FUNDING = CURRENT_FUNDING + ? WHERE FUNDRAISER_ID = ?',
            [amount, id]
        );

        res.status(201).json({ message: 'Donation successfully added' });
    } catch (error) {
        console.error('Error adding donation:', error);
        res.status(500).json({ message: 'Failed to add donation' });
    }
});

// Route to create a new fundraiser
app.post('/fundraisers', async (req, res) => {
    const { caption, organizer, city, category_id, description, target_funding } = req.body;

    if (!caption || !organizer || !city || !category_id || !target_funding || isNaN(target_funding)) {
        return res.status(400).json({ message: 'Invalid fundraiser data' });
    }

    try {
        // Insert new fundraiser into the database
        await pool.query(
            'INSERT INTO FUNDRAISER (CAPTION, ORGANIZER, CITY, CATEGORY_ID, DESCRIPTION, TARGET_FUNDING, CURRENT_FUNDING) VALUES (?, ?, ?, ?, ?, ?, 0)',
            [caption, organizer, city, category_id, description, target_funding]
        );

        res.status(201).json({ message: 'Fundraiser successfully created' });
    } catch (error) {
        console.error('Error creating fundraiser:', error);
        res.status(500).json({ message: 'Failed to create fundraiser' });
    }
});

// Route to update an existing fundraiser by ID
app.put('/fundraiser/:id', async (req, res) => {
    const { id } = req.params;
    const { caption, organizer, city, category_id, description, target_funding, active } = req.body;

    if (!caption || !organizer || !city || !category_id || !target_funding || isNaN(target_funding) || active === undefined) {
        return res.status(400).json({ message: 'Invalid fundraiser data' });
    }

    try {
        // Update the fundraiser details in the database
        const [result] = await pool.query(
            'UPDATE FUNDRAISER SET CAPTION = ?, ORGANIZER = ?, CITY = ?, CATEGORY_ID = ?, DESCRIPTION = ?, TARGET_FUNDING = ?, ACTIVE = ? WHERE FUNDRAISER_ID = ?',
            [caption, organizer, city, category_id, description, target_funding, active, id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Fundraiser successfully updated' });
        } else {
            res.status(404).json({ message: 'Fundraiser not found' });
        }
    } catch (error) {
        console.error('Error updating fundraiser:', error);
        res.status(500).json({ message: 'Failed to update fundraiser' });
    }
});

// Route to delete a fundraiser by ID (only if there are no donations)
app.delete('/fundraiser/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the fundraiser has any donations
        const [donations] = await pool.query('SELECT * FROM DONATION WHERE FUNDRAISER_ID = ?', [id]);

        if (donations.length > 0) {
            return res.status(400).json({ message: 'Fundraiser cannot be deleted because it has donations' });
        }

        // Delete the fundraiser if there are no donations
        const [result] = await pool.query('DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?', [id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Fundraiser successfully deleted' });
        } else {
            res.status(404).json({ message: 'Fundraiser not found' });
        }
    } catch (error) {
        console.error('Error deleting fundraiser:', error);
        res.status(500).json({ message: 'Failed to delete fundraiser' });
    }
});


// Starting the server on port 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`),
    console.log('Connected to MySQL!');
});

// Exporting the pool for use in other files
module.exports = pool;

