// routes/contentRoutes.js

const express = require('express');
const Content = require('../models/Content'); // Import your model
const router = express.Router();

// Get all contents
router.get('/', async (req, res) => {
    try {
        const contents = await Content.find();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add more routes as needed...

module.exports = router;
