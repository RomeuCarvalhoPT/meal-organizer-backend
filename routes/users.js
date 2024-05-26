const express = require('express');
const bcrypt = require('bcryptjs');
const { Users } = require('./../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Keep this in an environment variable in production

router.post('/register', async (req, res) => {
  const data = req.body;
  const  username = data.username;
  const  password = data.password;

  try {
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new Users({ username, password: hashedPassword });
    await newUser.save();
   // const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});




router.post('/login', async (req, res) => {
  const data = req.body;
  const { username, password } = data;

  try {
    const user = await Users.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});




module.exports = router;
