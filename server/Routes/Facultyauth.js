import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import { faculty } from '../models/Faculty.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';  // Ensure you replace this with a secure key

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await faculty.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email Already Exist" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newFaculty = new faculty({
      username,
      email,
      password: hashedpassword,
    });
    await newFaculty.save();

    // Generate JWT token
    const token = jwt.sign({ id: newFaculty._id, email: newFaculty.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ success: true, message: "Registered", token });
  } catch (err) {
    return res.json(err);
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await faculty.findOne({ email });
    if (!existingUser) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Protected route example
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ success: true, message: "This is a protected route", user: req.user });
});

export { router as Facultyrouter };
