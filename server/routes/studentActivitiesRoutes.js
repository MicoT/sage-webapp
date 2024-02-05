// routes/studentActivitiesRoutes.js
const express = require('express');
const StudentActivity = require('../models/StudentActivity'); // Import the model you just created

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activities = await StudentActivity.find({});
    res.json(activities);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
