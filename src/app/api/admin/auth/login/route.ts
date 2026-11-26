import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionToken,
  ADMIN_COOKIE_NAME,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
  constantTimeCompare,
} from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    // Rate limiting check
    const rateCheck = checkLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Account locked for ${rateCheck.retryAfterSeconds} seconds.`,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'KarnatakaGym@2026!';

    const isUserMatch = constantTimeCompare(username, expectedUsername);
    const isPassMatch = constantTimeCompare(password, expectedPassword);

    if (!isUserMatch || !isPassMatch) {
      recordFailedLogin(ip);
      const updatedRate = checkLoginRateLimit(ip);
      return NextResponse.json(
        {
          error: 'Invalid admin credentials.',
          remainingAttempts: updatedRate.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Success: clear rate limit record & create signed session token
    clearLoginAttempts(ip);
    const token = await createSessionToken(username);

    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      user: { username },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;
  } catch (err) {
    console.error('[admin-login] Error processing login:', err);
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
