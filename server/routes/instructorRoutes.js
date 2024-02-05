const express = require('express');
const Instructor = require('../models/Instructor');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find({
      // Add any filtering logic here
    });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
