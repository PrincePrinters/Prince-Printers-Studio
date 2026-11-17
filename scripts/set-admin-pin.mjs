/*
 * Set / change the admin panel PIN without touching hosting settings.
 *
 *   npm run set-admin-pin
 *
 * Asks for the new PIN (hidden), stores only a scrypt hash in src/config/admin-pin.ts.
 * Then: git add . && git commit -m "Update admin PIN" && git push
 */
import { writeFileSync } from 'node:fs';
import { randomBytes, scryptSync, createHash } from 'node:crypto';

function askHidden(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    let value = '';
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (ch) => {
      if (ch === '\r' || ch === '\n' || ch === '\u0004') {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off('data', onData);
        process.stdout.write('\n');
        resolve(value);
      } else if (ch === '\u0003') {
        process.exit(1);
      } else if (ch === '\u007f' || ch === '\b') {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    stdin.on('data', onData);
  });
}

const pin = (process.argv[2] ?? (await askHidden('Naya admin PIN likhiye (min 8 akshar): '))).trim();
if (pin.length < 8) {
  console.error('✖ PIN kam se kam 8 akshar ka hona chahiye.');
  process.exit(1);
}
if (!process.argv[2]) {
  const again = (await askHidden('Dobara likhiye: ')).trim();
  if (again !== pin) {
    console.error('✖ Dono PIN match nahi hue.');
    process.exit(1);
  }
}

const salt = randomBytes(16).toString('hex');
const token = scryptSync(pin, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex');
const check = createHash('sha256').update(token).digest('hex');

writeFileSync(
  new URL('../src/config/admin-pin.ts', import.meta.url),
  `/**
 * Admin panel PIN (hashed — the real PIN is never stored here).
 *
 * Set or change it with:   npm run set-admin-pin
 * then commit and push. (Alternative: set ADMIN_PIN in your hosting's Environment
 * Variables — that takes priority over this file.)
 *
 * Empty = no PIN set (admin login is disabled on the live site; local dev uses "2026").
 */
export const ADMIN_PIN_HASH = '${salt}:${check}';
`
);

console.log('✓ Admin PIN set ho gaya (src/config/admin-pin.ts).');
console.log('  Ab push kariye:  git add . && git commit -m "Update admin PIN" && git push');
