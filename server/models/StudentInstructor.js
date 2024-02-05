const mongoose = require('mongoose');

const StudentInstructorSchema = new mongoose.Schema({
    STUDENTNAME: { type: String, required: true },
    PROGRAM: { type: String, required: true },
    MONTH_1: { type: Number, required: true },
    MONTH_2: { type: Number, required: true },
    MONTH_3: { type: Number, required: true },
    MONTH_4: { type: Number, required: true },
    MONTH_5: { type: Number, required: true },
    MONTH_6: { type: Number, required: true },
    MONTH_7: { type: Number, required: true },
    MONTH_8: { type: Number, required: true },
    MONTH_9: { type: Number, required: true },
    MONTH_10: { type: Number, required: true },
    MONTH_11: { type: Number, required: true },
    MONTH_12: { type: Number, required: true },
    YEAR: { type: Number, required: true },
});

module.exports = mongoose.model('StudentInstructor', StudentInstructorSchema, 'student-instructor');
