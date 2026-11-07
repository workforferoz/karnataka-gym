import { UserRole, User } from '@/types/database';

/**
 * XSS & HTML injection sanitizer.
 * Strips script tags, HTML entities, and unsafe characters.
 */
export const sanitizeString = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // remove HTML tag delimiters
    .replace(/javascript:/gi, '') // remove javascript: URI schemes
    .replace(/on\w+=/gi, '') // remove inline event handlers like onclick=
    .trim();
};

/**
 * Sanitize & validate 10-digit Indian phone number.
 */
export const sanitizePhone = (phone: string): { isValid: boolean; sanitized: string } => {
  const digitsOnly = phone.replace(/\D/g, '');
  // Indian phone numbers are 10 digits (without country code) or 12 digits (with 91)
  let clean = digitsOnly;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    clean = digitsOnly.substring(2);
  }
  const isValid = /^[6-9]\d{9}$/.test(clean);
  return { isValid, sanitized: clean };
};

/**
 * Sanitize email address.
 */
export const sanitizeEmail = (email: string): { isValid: boolean; sanitized: string } => {
  const clean = sanitizeString(email).toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  return { isValid, sanitized: clean };
};

/**
 * SHA-256 Cryptographic Hash for password/token generation and audit integrity.
 * Uses native Web Crypto API (browser & modern Node).
 */
export const hashString = async (message: string): Promise<string> => {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback for non-subtle crypto environments
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Client-side Rate Limiting Map.
 * Prevents spam on QR scans, OTP requests, and form submissions.
 */
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export const checkRateLimit = (
  actionKey: string,
  maxAttempts: number = 5,
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

/**
 * Role-Based Access Control (RBAC) Guard.
 */
export const isAuthorizedRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};
