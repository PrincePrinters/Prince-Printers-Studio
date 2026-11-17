import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminLoginAvailable, isAdminRequest, loginWithPin } from '@/lib/admin-auth';

/** GET: is the current browser logged in as admin? */
export async function GET(request: Request) {
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}

/** POST { pin }: log in and set a secure cookie */
export async function POST(request: Request) {
  if (!adminLoginAvailable()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Admin PIN set nahi hai. Terminal mein "npm run set-admin-pin" chalaiye aur push kariye.',
      },
      { status: 503 }
    );
  }

  let body: { pin?: string } = {};
  try {
    body = await request.json();
  } catch {
    // ignore
  }

  const token = loginWithPin(String(body.pin || ''));
  if (!token) {
    return NextResponse.json({ success: false, error: 'Galat PIN.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

/** DELETE: log out */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
