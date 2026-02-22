import express from 'express';
import HomePageContent from '../models/HomePageContent.js';

const router = express.Router();

router.get('/home', async (req, res) => {
  try {
    let doc = await HomePageContent.findOne({ key: 'home' });
    if (!doc) {
      doc = await HomePageContent.create({ key: 'home' });
    }
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const raw = doc.toObject ? doc.toObject() : doc;
    const norm = (list) => (Array.isArray(list) ? list.map((d) => ({
      name: (d && d.name != null) ? String(d.name) : '',
      imageUrl: (d && d.imageUrl != null && String(d.imageUrl).trim() !== '') ? String(d.imageUrl).trim() : '',
    })) : []);
    const studyDestinations = norm(raw.studyDestinations);
    const universityLogosRow1 = norm(raw.universityLogosRow1);
    const universityLogosRow2 = norm(raw.universityLogosRow2);
    res.json({ ...raw, studyDestinations, universityLogosRow1, universityLogosRow2 });
  } catch (err) {
    console.error('Get homepage content error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
