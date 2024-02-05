const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
  LAST_NAME: String,
  FIRST_NAME: String,
  INSTITUTION_ROLE: String,
  COURSENAME: String,
  COURSENUMBER: String,
  COURSECODE: String,
});

module.exports = mongoose.model('Instructor', InstructorSchema, 'instructor');
