// routes/gradeFinalRoutes.js
const express = require('express');
const GradeFinal = require('../models/GradeFinal');

const router = express.Router();

// Get all final grades
router.get('/', async (req, res) => {
  try {
    const grades = await GradeFinal.find();
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get final grades by course code
// In gradeFinalRoutes.js
router.get('/byCourseCode/:courseCode', async (req, res) => {
    try {
      const courseCode = req.params.courseCode;
      const grades = await GradeFinal.find({ COURSECODE: courseCode });
      res.json(grades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
