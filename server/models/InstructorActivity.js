const mongoose = require('mongoose');

const InstructorActivitySchema = new mongoose.Schema({
  LAST_NAME: String,
  FIRST_NAME: String,
  PERSON_ID: Number,
  MONTH: Number,
  DURATION_MINUTES: Number
});

module.exports = mongoose.model('InstructorActivity', InstructorActivitySchema, 'instructor-activity');
