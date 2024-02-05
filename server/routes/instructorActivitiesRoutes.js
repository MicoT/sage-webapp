const express = require('express');
const InstructorActivity = require('../models/InstructorActivity');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activities = await InstructorActivity.find({});
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
