// models/StudentActivity.js
const mongoose = require('mongoose');

const StudentActivitySchema = new mongoose.Schema({
  LAST_NAME: String,
  FIRST_NAME: String,
  PERSON_ID: Number,
  MONTH: Number,
  DURATION_MINUTES: Number,
  // Add other fields here as needed
});

const StudentActivity = mongoose.model('StudentActivity', StudentActivitySchema, 'student_activity-2022');

module.exports = StudentActivity;
