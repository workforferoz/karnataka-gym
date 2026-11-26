// Security utilities for Admin Authentication and Session Management
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'kg_admin_session';
const SESSION_DURATION_SECONDS = 12 * 60 * 60; // 12 hours

interface SessionPayload {
  username: string;
  role: 'admin';
  iat: number;
  exp: number;
}

// Memory cache for login rate limiting (IP-based)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkLoginRateLimit(ip: string, maxAttempts = 5, lockTimeMs = 15 * 60 * 1000): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Lock expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  const remaining = Math.max(0, maxAttempts - record.count);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function recordFailedLogin(ip: string, maxAttempts = 5, lockTimeMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockTimeMs;
  }

  loginAttempts.set(ip, record);
}

export function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

function getSecretKeyBytes(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || 'karnataka-gym-hubballi-secure-secret-key-2026-fallback';
  return new TextEncoder().encode(secret);
}

async function getHmacCryptoKey(): Promise<CryptoKey> {
  const keyBytes = getSecretKeyBytes();
  return crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function createSessionToken(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    username,
    role: 'admin',
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = btoa(payloadString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const key = await getHmacCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadBase64) as unknown as BufferSource
  );
  const signatureBase64 = arrayBufferToBase64Url(signatureBuffer);

  return `${payloadBase64}.${signatureBase64}`;
}

export async function verifySessionToken(token: string): Promise<{ valid: boolean; username?: string }> {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false };
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false };
    }

    const [payloadBase64, signatureBase64] = parts;
    const key = await getHmacCryptoKey();
    const signatureBytes = base64UrlToUint8Array(signatureBase64);

    const isSignatureValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      new TextEncoder().encode(payloadBase64) as unknown as BufferSource
    );

    if (!isSignatureValid) {
      return { valid: false };
    }

    // Decode payload
    let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const payloadJson = atob(base64);
    const payload: SessionPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false };
    }

    if (payload.role !== 'admin') {
      return { valid: false };
    }

    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return false;
  const result = await verifySessionToken(cookie);
  return result.valid;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;
    const { valid } = await verifySessionToken(token);
    return valid;
  } catch {
    return false;
  }
}

// Constant-time string comparison to resist timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let mismatch = a.length === b.length ? 0 : 1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const charA = a.charCodeAt(i) || 0;
    const charB = b.charCodeAt(i) || 0;
    mismatch |= charA ^ charB;
  }
  return mismatch === 0;
}
