/*
 * LOCKED — required developer credit check (see LICENSE).
 * Runs automatically before `npm run build`. Do not edit or remove.
 */
import { readFileSync } from 'node:fs';
import { createHash, scryptSync, timingSafeEqual } from 'node:crypto';

const fail = (msg) => {
  console.error('\n\x1b[31m✖ Build stopped: ' + msg + '\x1b[0m');
  console.error('  The footer credit "Created by Quick Art Photography Academy" (https://quickartphotography.in/)');
  console.error('  is required by the LICENSE and must stay unchanged. Restore src/components/SiteCredit.tsx and the footer.\n');
  process.exit(1);
};

const read = (p) => {
  try {
    return readFileSync(new URL('../' + p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  } catch {
    fail(p + ' is missing.');
  }
};

const KEY_HASH = 'adc6ab7cd01344fad84b4521ea1c4f84:57e3d33f8df09d1d967078e6564d04b296d2859912e9e8b6d6461316c4b597d9';
const key = process.env.CREDIT_REMOVAL_KEY;
if (key) {
  const [salt, hash] = KEY_HASH.split(':');
  const test = scryptSync(key, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  if (timingSafeEqual(test, Buffer.from(hash, 'hex'))) {
    console.log('✓ Credit removal authorised (CREDIT_REMOVAL_KEY)');
    process.exit(0);
  }
  fail('CREDIT_REMOVAL_KEY is wrong.');
}

const nextConfig = read('next.config.ts');
if (!nextConfig.includes(KEY_HASH) || !nextConfig.includes('SITE_CREDIT_UNLOCKED: creditUnlocked() ? "1" : "0"')) {
  fail('the credit lock in next.config.ts was modified.');
}

const credit = read('src/components/SiteCredit.tsx');
const hash = createHash('sha256').update(credit).digest('hex');
if (hash !== '520ab177a89272b386362897012c2dd0b936d573690d5e2d694aa1e312fdb0cc') fail('src/components/SiteCredit.tsx was modified.');

const footer = read('src/components/Footer.tsx');
const active = footer
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
if (!/import\s+SiteCredit\s+from\s+['"]\.\/SiteCredit['"]/.test(active) || !active.includes('<SiteCredit />')) {
  fail('the credit was removed from src/components/Footer.tsx.');
}

console.log('✓ Site credit verified');
