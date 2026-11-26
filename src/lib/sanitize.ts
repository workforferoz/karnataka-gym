/**
 * Lightweight input sanitizers for Karnataka Gym forms.
 * Safe for client and server without external dependencies.
 */

export const sanitizeString = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const sanitizePhone = (phone: string): { isValid: boolean; sanitized: string } => {
  const digitsOnly = phone.replace(/\D/g, '');
  let clean = digitsOnly;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    clean = digitsOnly.substring(2);
  }
  const isValid = /^[6-9]\d{9}$/.test(clean);
  return { isValid, sanitized: clean };
};

export const sanitizeEmail = (email: string): { isValid: boolean; sanitized: string } => {
  const clean = sanitizeString(email).toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  return { isValid, sanitized: clean };
};
