// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secret_key'); // Replace 'secret_key' with your actual secret key

  User.findById(decoded.id, (err, user) => {
    if (err) return res.status(500).send('Server error');
    if (!user) return res.status(404).send('User not found');

    // Return the necessary user information
    res.json({ username: user.username });
  });
});

module.exports = router;
