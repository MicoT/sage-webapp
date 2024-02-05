const mongoose = require('mongoose');

const courseDataSchema = new mongoose.Schema({
  Code: { type: String, required: true },
  Sec: { type: String, required: true },
  Mode: { type: String, required: true },
  Title: { type: String, required: true },
  Instructor: { type: String, required: true }
});

const CourseData = mongoose.model('CourseData', courseDataSchema, 'coursedatas');

module.exports = CourseData;
