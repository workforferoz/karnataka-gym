import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const { valid, username } = await verifySessionToken(token);
  return NextResponse.json({
    authenticated: valid,
    username: valid ? username : undefined,
  });
}
