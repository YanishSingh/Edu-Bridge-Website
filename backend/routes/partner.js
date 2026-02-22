import express from 'express';
import VaultLink from '../models/VaultLink.js';
import { protectPartner } from '../middleware/auth.js';

const router = express.Router();
router.use(protectPartner);

router.get('/vault/links', async (req, res) => {
  try {
    const links = await VaultLink.find().sort({ createdAt: -1 }).select('-addedBy');
    res.json(links);
  } catch (err) {
    console.error('Partner vault links error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
