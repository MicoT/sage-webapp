// server/routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// Registration route
router.post('/register', [
  body('username').not().isEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 5 }),
  body('role').not().isEmpty().isIn(['CCIS-admin', 'CEA-admin', 'CHS-admin', 'ATYCB-admin', 'CAS-admin', 'super-admin']), // Updated validation for role
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, email, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Do not return the password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
