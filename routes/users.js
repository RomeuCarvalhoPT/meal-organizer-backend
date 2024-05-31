const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret'; // Keep this in an environment variable in production


router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // hash and salt the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create a new user record in the database
  const user = await User.create({ username, password: hashedPassword });
  res.json(user);
});



router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // retrieve the user record from the database based on the email address
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // verify the password against the hashed password stored in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // generate a JWT and return it to the client
  const token = jwt.sign({ id: user.userId }, secret);
  res.json({ token });
});



module.exports = router;
