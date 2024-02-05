const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  STUDENTLASTNAME: String,
  STUDENTFIRSTNAME: String,
  COURSENAME: String,
  COURSENUMBER: String,
  COURSECODE: String,
  GRADETYPE: String,
  GRADE: String
});

module.exports = mongoose.model('Grade', gradeSchema, 'grade');
