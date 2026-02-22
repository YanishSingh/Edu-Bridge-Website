import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import connectDB from './config/db.js';
import partnerAuthRoutes from './routes/partnerAuth.js';
import adminAuthRoutes from './routes/adminAuth.js';
import adminRoutes from './routes/admin.js';
import partnerRoutes from './routes/partner.js';
import contentRoutes from './routes/content.js';
import { signupLimiter, loginLimiter, apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', (req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

app.get('/api/health', apiLimiter, (req, res) => {
  res.json({ status: 'OK', message: 'Edu-Bridge API is running' });
});

app.use('/api/partner/signup', signupLimiter);
app.use('/api/partner/login', loginLimiter);
app.use('/api/admin/auth/login', loginLimiter);
app.use('/api/partner', partnerAuthRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

