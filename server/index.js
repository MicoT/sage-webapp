const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const studentActivitiesRoutes = require('./routes/studentActivitiesRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const gradesRoutes = require('./routes/gradesRoutes');
const instructorActivitiesRoutes = require('./routes/instructorActivitiesRoutes');
const courseDataRoutes = require('./routes/courseDataRoutes');
const gradeFinalRoutes = require('./routes/gradeFinalRoutes');
const studentInstructorRouter = require('./routes/studentInstructor');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://jmtongco22:FeGRVTua4Nh8Mx1h@cluster0.2tg6os3.mongodb.net/"; // Replace this with your MongoDB connection string.
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const Schema = mongoose.Schema;
const DataSchema = new Schema({
    title: String,
    content: String
}, { timestamps: true });
const authRoutes = require('./routes/authRoutes');

const Data = mongoose.model('Data', DataSchema);

app.get('/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/data', async (req, res) => {
    const newData = new Data({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/student-activities', studentActivitiesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/grade', gradesRoutes);
app.use('/api/instructor-activities', instructorActivitiesRoutes);
app.use('/api/coursedata', courseDataRoutes);
app.use('/api/grade-final', gradeFinalRoutes);
app.use('/api/student-instructor', studentInstructorRouter);
app.use('/api/content', contentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

// index.js or App.js
