import express from 'express';
import { body, validationResult } from 'express-validator';
import Partner from '../models/Partner.js';
import { signPartnerToken } from '../middleware/auth.js';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '../utils/sanitize.js';

const router = express.Router();

const signupValidation = [
  body('institutionName')
    .trim()
    .notEmpty().withMessage('Institution name is required')
    .isLength({ max: 200 }).withMessage('Institution name must be 200 characters or less')
    .customSanitizer((value) => sanitizeString(value, 200)),
  body('address.country')
    .trim()
    .notEmpty().withMessage('Country is required')
    .isLength({ max: 100 }).withMessage('Country must be 100 characters or less')
    .customSanitizer((value) => sanitizeString(value, 100)),
  body('address.stateProvince')
    .trim()
    .notEmpty().withMessage('State/Province is required')
    .isLength({ max: 100 }).withMessage('State/Province must be 100 characters or less')
    .customSanitizer((value) => sanitizeString(value, 100)),
  body('address.cityDistrict')
    .trim()
    .notEmpty().withMessage('City/District is required')
    .isLength({ max: 100 }).withMessage('City/District must be 100 characters or less')
    .customSanitizer((value) => sanitizeString(value, 100)),
  body('address.areaLocalLevel')
    .trim()
    .notEmpty().withMessage('Area/Local level is required')
    .isLength({ max: 100 }).withMessage('Area/Local level must be 100 characters or less')
    .customSanitizer((value) => sanitizeString(value, 100)),
  body('address.wardNumber')
    .trim()
    .notEmpty().withMessage('Ward number is required')
    .isLength({ max: 10 }).withMessage('Ward number must be 10 characters or less')
    .customSanitizer((value) => sanitizeString(value, 10)),
  body('address.street')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Street must be 200 characters or less')
    .customSanitizer((value) => value ? sanitizeString(value, 200) : ''),
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isLength({ max: 20 }).withMessage('Phone number must be 20 characters or less')
    .customSanitizer((value) => sanitizePhone(value)),
  body('mobileNumber')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .isLength({ max: 20 }).withMessage('Mobile number must be 20 characters or less')
    .customSanitizer((value) => sanitizePhone(value)),
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email must be 255 characters or less')
    .customSanitizer((value) => sanitizeEmail(value)),
  body('password')
    .isLength({ min: 6, max: 200 }).withMessage('Password must be between 6 and 200 characters'),
];

router.post('/signup', signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { institutionName, address, phoneNumber, mobileNumber, email, password } = req.body;
    const existing = await Partner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const partner = await Partner.create({
      institutionName,
      address: {
        country: address?.country || 'Nepal',
        stateProvince: address?.stateProvince,
        cityDistrict: address?.cityDistrict,
        areaLocalLevel: address?.areaLocalLevel,
        wardNumber: address?.wardNumber,
        street: address?.street || '',
      },
      phoneNumber,
      mobileNumber,
      email,
      password,
    });
    // TODO: send email to admin (new partner signup) and to partner (application received)
    res.status(201).json({
      message: 'Signup successful. Your account is pending admin approval. You will receive an email once approved or if rejected.',
      partner: {
        id: partner._id,
        institutionName: partner.institutionName,
        email: partner.email,
        status: partner.status,
      },
    });
  } catch (err) {
    console.error('Partner signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

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
    const partner = await Partner.findOne({ email }).select('+password');
    if (!partner) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const match = await partner.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (partner.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending approval. You will receive an email once approved.' });
    }
    if (partner.status === 'rejected') {
      return res.status(403).json({
        message: 'Your application was rejected.',
        rejectionReason: partner.rejectionReason || 'No reason provided.',
      });
    }
    const token = signPartnerToken(partner._id);
    res.json({
      message: 'Login successful',
      token,
      partner: {
        id: partner._id,
        institutionName: partner.institutionName,
        email: partner.email,
        status: partner.status,
      },
    });
  } catch (err) {
    console.error('Partner login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

export default router;
