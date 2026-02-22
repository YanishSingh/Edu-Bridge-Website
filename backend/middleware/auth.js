import jwt from 'jsonwebtoken';
import Partner from '../models/Partner.js';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'edu-bridge-secret-change-in-production';

export const protectPartner = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const partner = await Partner.findById(decoded.id).select('-password');
    if (!partner) {
      return res.status(401).json({ message: 'Partner not found.' });
    }
    if (partner.status !== 'accepted') {
      return res.status(403).json({ message: 'Your account is not yet approved. Please wait for admin approval.' });
    }
    req.partner = partner;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found.' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

export const signPartnerToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

export const signAdminToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
};
