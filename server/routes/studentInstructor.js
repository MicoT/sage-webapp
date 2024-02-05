const express = require('express');
const router = express.Router();
const StudentInstructor = require('../models/StudentInstructor');

// Get all entries
router.get('/', async (req, res) => {
    try {
        const entries = await StudentInstructor.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new entry
router.post('/', async (req, res) => {
    const entry = new StudentInstructor({
        STUDENTNAME: req.body.STUDENTNAME,
        PROGRAM: req.body.PROGRAM,
        MONTH_1: req.body.MONTH_1,
        MONTH_2: req.body.MONTH_2,
        MONTH_3: req.body.MONTH_3,
        MONTH_4: req.body.MONTH_4,
        MONTH_5: req.body.MONTH_5,
        MONTH_6: req.body.MONTH_6,
        MONTH_7: req.body.MONTH_7,
        MONTH_8: req.body.MONTH_8,
        MONTH_9: req.body.MONTH_9,
        MONTH_10: req.body.MONTH_10,
        MONTH_11: req.body.MONTH_11,
        MONTH_12: req.body.MONTH_12,
        YEAR: req.body.YEAR
    });

    try {
        const newEntry = await entry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
