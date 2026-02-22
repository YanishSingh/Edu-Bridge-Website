import express from 'express';
import { body, validationResult } from 'express-validator';
import Admin from '../models/Admin.js';
import { signAdminToken } from '../middleware/auth.js';
import { sanitizeEmail } from '../utils/sanitize.js';

const router = express.Router();

router.post('/login', [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email must be 255 characters or less')
    .customSanitizer((value) => sanitizeEmail(value)),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 200 }).withMessage('Password must be 200 characters or less'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = signAdminToken(admin._id);
    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

export default router;
