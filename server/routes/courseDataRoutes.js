const express = require('express');
const CourseData = require('../models/CourseData');

const router = express.Router();

// Get all course data
router.get('/', async (req, res) => {
  try {
    const courseData = await CourseData.find();
    res.json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add more routes as needed...

module.exports = router;
