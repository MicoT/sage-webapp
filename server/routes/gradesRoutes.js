const express = require('express');
const Grade = require('../models/Grade');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const grade = await Grade.find({
      // Add any filtering logic here
    });
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
