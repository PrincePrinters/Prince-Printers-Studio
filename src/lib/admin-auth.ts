import crypto from 'crypto';
import { ADMIN_PIN_HASH } from '@/config/admin-pin';

export const ADMIN_COOKIE = 'studio_admin';

/*
 * Where the admin PIN comes from (first match wins):
 *  1. ADMIN_PIN environment variable (hosting settings)
 *  2. ADMIN_PIN_HASH in src/config/admin-pin.ts  (set with `npm run set-admin-pin`)
 *  3. Local development only: "2026"
 * On the live site with neither 1 nor 2, admin login is disabled.
 */

const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const;

type Mode = { kind: 'plain'; pin: string } | { kind: 'hash'; salt: string; check: string } | null;

function mode(): Mode {
  const env = process.env.ADMIN_PIN?.trim();
  if (env) return { kind: 'plain', pin: env };
  const [salt, check] = (ADMIN_PIN_HASH || '').split(':');
  if (salt && check && /^[0-9a-f]{64}$/.test(check)) return { kind: 'hash', salt, check };
  if (process.env.NODE_ENV !== 'production') return { kind: 'plain', pin: '2026' };
  return null;
}

export function adminLoginAvailable() {
  return mode() !== null;
}

const sha256 = (v: string) => crypto.createHash('sha256').update(v).digest('hex');
const safeEqual = (a: string, b: string) =>
  a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Returns the session token to put in the cookie if the PIN is correct, otherwise null.
 * Hash mode: token = scrypt(pin, salt); the repo only stores sha256(token), so neither the
 * PIN nor a valid cookie can be derived from the public code.
 */
export function loginWithPin(input: string): string | null {
  const m = mode();
  const pin = (input || '').trim();
  if (!m || !pin) return null;
  if (m.kind === 'plain') {
    return safeEqual(pin, m.pin)
      ? crypto.createHmac('sha256', m.pin).update('studio-admin-session-v1').digest('hex')
      : null;
  }
  const token = crypto.scryptSync(pin, m.salt, 32, SCRYPT).toString('hex');
  return safeEqual(sha256(token), m.check) ? token : null;
}

/** Reads the admin cookie from a request and checks it. */
export function isAdminRequest(request: Request) {
  const m = mode();
  if (!m) return false;
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.split(/;\s*/).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return false;
  const value = decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1));
  if (!/^[0-9a-f]{64}$/.test(value)) return false;
  if (m.kind === 'plain') {
    const expected = crypto.createHmac('sha256', m.pin).update('studio-admin-session-v1').digest('hex');
    return safeEqual(value, expected);
  }
  return safeEqual(sha256(value), m.check);
}
