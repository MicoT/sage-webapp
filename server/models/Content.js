// models/Content.js

const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    LAST_NAME: String,
    FIRST_NAME: String,
    COURSE_NAME: String,
    COURSE_ITEM_NAME: String,
    ITEM_TYPE: String,
    ROW_INSERTED_TIME: Date
});

const Content = mongoose.model('Content', ContentSchema, 'content');

module.exports = Content;
