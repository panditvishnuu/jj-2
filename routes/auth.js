// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = new User({
    username,
    password: hashedPassword,
    role, // Ensure this is set appropriately
  });

  try {
    const savedUser = await user.save();
    res.json({ userId: savedUser._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Username not found" });

  // Validate password
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "Invalid password" });

  // Create and assign token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.header("Authorization", token).json({ token });
});

module.exports = router;
