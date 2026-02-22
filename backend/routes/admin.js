import express from 'express';
import { body, validationResult } from 'express-validator';
import Partner from '../models/Partner.js';
import VaultLink from '../models/VaultLink.js';
import HomePageContent from '../models/HomePageContent.js';
import { protectAdmin } from '../middleware/auth.js';
import { sanitizeString } from '../utils/sanitize.js';
import { uploadDestinationImage } from '../middleware/upload.js';

const router = express.Router();
router.use(protectAdmin);

router.post('/upload', uploadDestinationImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }
    const url = `/uploads/destinations/${req.file.filename}`;
    res.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message || 'Upload failed.' });
  }
});

router.get('/partners', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const partners = await Partner.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    console.error('List partners error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.patch('/partners/:id/accept', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }
    if (partner.status !== 'pending') {
      return res.status(400).json({ message: 'Partner is not pending.' });
    }
    partner.status = 'accepted';
    partner.rejectionReason = undefined;
    partner.rejectedAt = undefined;
    await partner.save();
    // TODO: send email to partner (application accepted)
    res.json({ message: 'Partner accepted.', partner: await Partner.findById(partner._id).select('-password') });
  } catch (err) {
    console.error('Accept partner error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.patch('/partners/:id/reject', [
  body('rejectionReason')
    .trim()
    .notEmpty().withMessage('Rejection reason is required')
    .isLength({ max: 500 }).withMessage('Rejection reason must be 500 characters or less')
    .customSanitizer((value) => sanitizeString(value, 500)),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Rejection reason is required.', errors: errors.array() });
    }
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }
    if (partner.status !== 'pending') {
      return res.status(400).json({ message: 'Partner is not pending.' });
    }
    partner.status = 'rejected';
    partner.rejectionReason = req.body.rejectionReason.trim();
    partner.rejectedAt = new Date();
    await partner.save();
    // TODO: send email to partner (application rejected, include rejectionReason)
    res.json({ message: 'Partner rejected.', partner: await Partner.findById(partner._id).select('-password') });
  } catch (err) {
    console.error('Reject partner error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/vault/links', [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or less')
    .customSanitizer((value) => sanitizeString(value, 200)),
  body('url')
    .trim()
    .isURL().withMessage('Valid URL is required')
    .isLength({ max: 2000 }).withMessage('URL must be 2000 characters or less')
    .customSanitizer((value) => value.trim().slice(0, 2000)),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const link = await VaultLink.create({
      title: req.body.title.trim(),
      url: req.body.url.trim(),
      addedBy: req.admin._id,
    });
    res.status(201).json(link);
  } catch (err) {
    console.error('Add vault link error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/vault/links', async (req, res) => {
  try {
    const links = await VaultLink.find().sort({ createdAt: -1 }).populate('addedBy', 'email');
    res.json(links);
  } catch (err) {
    console.error('List vault links error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/vault/links/:id', async (req, res) => {
  try {
    const link = await VaultLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ message: 'Link not found.' });
    res.json({ message: 'Link deleted.' });
  } catch (err) {
    console.error('Delete vault link error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

function sanitizeStats(arr) {
  if (!Array.isArray(arr) || arr.length !== 6) return null;
  return arr.map((item) => ({
    value: sanitizeString(String(item?.value ?? ''), 50) || '0',
    label: sanitizeString(String(item?.label ?? ''), 100) || 'Label',
  }));
}
function sanitizeServices(arr) {
  if (!Array.isArray(arr) || arr.length > 50) return null;
  return arr.map((item) => ({
    title: sanitizeString(String(item?.title ?? ''), 150) || 'Service',
    description: sanitizeString(String(item?.description ?? ''), 500) || '',
  }));
}
function sanitizeSteps(arr) {
  if (!Array.isArray(arr) || arr.length > 20) return null;
  return arr.map((item) => ({
    title: sanitizeString(String(item?.title ?? ''), 150) || 'Step',
    description: sanitizeString(String(item?.description ?? ''), 400) || '',
  }));
}
function sanitizeDestinations(arr) {
  if (!Array.isArray(arr) || arr.length > 30) return null;
  return arr.map((item) => {
    const name = sanitizeString(String(item?.name ?? ''), 100) || 'Destination';
    let imageUrl = (item?.imageUrl != null && item?.imageUrl !== '') ? String(item.imageUrl).trim().slice(0, 2000) : '';
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/'))
      imageUrl = `/uploads/destinations/${imageUrl}`;
    return { name, imageUrl };
  });
}
function sanitizeLogoItems(arr) {
  if (!Array.isArray(arr) || arr.length > 30) return null;
  return arr.map((item) => {
    const name = sanitizeString(String(item?.name ?? ''), 150) || '';
    let imageUrl = (item?.imageUrl != null && item?.imageUrl !== '') ? String(item.imageUrl).trim().slice(0, 2000) : '';
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/'))
      imageUrl = `/uploads/destinations/${imageUrl}`;
    return { name, imageUrl };
  });
}

router.put('/content/home', async (req, res) => {
  try {
    const {
      stats,
      servicesSubtitle,
      servicesHeading,
      servicesParagraph,
      services,
      howItWorksHeading,
      howItWorksSubtitle,
      howItWorksSteps,
      studyDestinationsHeading,
      studyDestinationsSubheading,
      studyDestinations,
      universityLogosRow1,
      universityLogosRow2,
    } = req.body;

    let doc = await HomePageContent.findOne({ key: 'home' });
    if (!doc) doc = await HomePageContent.create({ key: 'home' });

    if (stats) {
      const sanitized = sanitizeStats(stats);
      if (sanitized) doc.stats = sanitized;
    }
    if (servicesSubtitle != null) doc.servicesSubtitle = sanitizeString(String(servicesSubtitle), 100) || doc.servicesSubtitle;
    if (servicesHeading != null) doc.servicesHeading = sanitizeString(String(servicesHeading), 200) || doc.servicesHeading;
    if (servicesParagraph != null) doc.servicesParagraph = sanitizeString(String(servicesParagraph), 500) || doc.servicesParagraph;
    if (services) {
      const sanitized = sanitizeServices(services);
      if (sanitized) doc.services = sanitized;
    }
    if (howItWorksHeading != null) doc.howItWorksHeading = sanitizeString(String(howItWorksHeading), 100) || doc.howItWorksHeading;
    if (howItWorksSubtitle != null) doc.howItWorksSubtitle = sanitizeString(String(howItWorksSubtitle), 200) || doc.howItWorksSubtitle;
    if (howItWorksSteps) {
      const sanitized = sanitizeSteps(howItWorksSteps);
      if (sanitized) doc.howItWorksSteps = sanitized;
    }
    if (studyDestinationsHeading != null) doc.studyDestinationsHeading = sanitizeString(String(studyDestinationsHeading), 100) || doc.studyDestinationsHeading;
    if (studyDestinationsSubheading != null) doc.studyDestinationsSubheading = sanitizeString(String(studyDestinationsSubheading), 200) || doc.studyDestinationsSubheading;
    if (studyDestinations) {
      const sanitized = sanitizeDestinations(studyDestinations);
      if (sanitized) {
        doc.studyDestinations = sanitized;
        doc.markModified('studyDestinations');
      }
    }
    if (universityLogosRow1) {
      const sanitized = sanitizeLogoItems(universityLogosRow1);
      if (sanitized !== null) {
        doc.universityLogosRow1 = sanitized;
        doc.markModified('universityLogosRow1');
      }
    }
    if (universityLogosRow2) {
      const sanitized = sanitizeLogoItems(universityLogosRow2);
      if (sanitized !== null) {
        doc.universityLogosRow2 = sanitized;
        doc.markModified('universityLogosRow2');
      }
    }

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error('Update homepage content error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
