/**
 * Sanitization utilities to prevent XSS and injection attacks
 */

export const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (s) => map[s]);
};

export const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== 'string') return '';
  return escapeHtml(str.trim().slice(0, maxLength));
};

export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase().slice(0, 255);
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d+]/g, '').slice(0, 20);
};
