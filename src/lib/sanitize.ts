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

/**
 * Client-side Rate Limiter.
 * Prevents spam on form submissions.
 */
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export const checkRateLimit = (
  actionKey: string,
  maxAttempts: number = 3,
  windowMs: number = 60000
): { allowed: boolean; retryAfterSeconds: number } => {
  const now = Date.now();
  const entry = rateLimitMap.get(actionKey);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(actionKey, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.expiresAt - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
};
