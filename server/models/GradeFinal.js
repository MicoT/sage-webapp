// models/GradeFinal.js
const mongoose = require('mongoose');

const gradeFinalSchema = new mongoose.Schema({
  STUDENTNAME: { type: String, required: true },
  COURSENAME: { type: String, required: true },
  COURSECODE: { type: String, required: true },
  PROGRAM: { type: String, required: true },
  YEARLEVEL: { type: String, required: true },
  TERM: { type: String, required: true },
  "M1 Grade": { type: String, required: true },
  "M2 Grade": { type: String, required: true },
  "M3 Grade": { type: String, required: true }
}, {
  collection: 'grade-final'
});

module.exports = mongoose.model('GradeFinal', gradeFinalSchema);
