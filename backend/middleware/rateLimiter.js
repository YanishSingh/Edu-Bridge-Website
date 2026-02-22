import rateLimit from 'express-rate-limit';

const isDevelopment = process.env.NODE_ENV === 'development';

// Helper to check if request is from localhost
const isLocalhost = (req) => {
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const forwarded = req.headers['x-forwarded-for'];
  const host = req.headers.host;
  
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip?.startsWith('127.') ||
    ip?.startsWith('::ffff:127.') ||
    forwarded?.includes('127.0.0.1') ||
    host?.includes('localhost') ||
    host?.includes('127.0.0.1')
  );
};

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 100 : 3, // Much more lenient in development
  message: { message: 'Too many signup attempts. Please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    return isDevelopment && isLocalhost(req);
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 5, // Much more lenient in development
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for localhost in development
    return isDevelopment && isLocalhost(req);
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 200 : 100, // More lenient in development
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
