import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import { TA } from '../models/TA.js';

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with your own secret key

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await TA.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: 'Email Already Exist' });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newTA = new TA({
      username,
      email,
      password: hashedpassword,
    });
    await newTA.save();

    // Generate JWT token
    const token = jwt.sign({ id: newTA._id, email: newTA.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ success: true, message: 'Registered', token });
  } catch (err) {
    return res.json(err);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await TA.findOne({ email });
    if (!existingUser) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ success: true, message: 'Login successful', token });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
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

router.post("/create", async (req, res) => {
  try {
    const student = new TA(req.body);
    await student.save();
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    // Update the TA
    await TA.findByIdAndUpdate(id, { username, email, password });
    return res.json({ success: true, message: "TA updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete a TA
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the TA
    await TA.findByIdAndDelete(id);
    return res.json({ success: true, message: "TA deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Protected route example
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ success: true, message: 'This is a protected route', user: req.user });
});

export { router as TArouter };
