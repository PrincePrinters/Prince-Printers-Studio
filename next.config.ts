import type { NextConfig } from "next";
import { scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

// LOCKED — footer credit unlock (see LICENSE). The credit is hidden only when
// CREDIT_REMOVAL_KEY matches this salted scrypt hash. Do not edit.
function creditUnlocked(): boolean {
  const key = process.env.CREDIT_REMOVAL_KEY;
  if (!key) return false;
  const [salt, hash] = "adc6ab7cd01344fad84b4521ea1c4f84:57e3d33f8df09d1d967078e6564d04b296d2859912e9e8b6d6461316c4b597d9".split(":");
  const test = scryptSync(key, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return timingSafeEqual(test, Buffer.from(hash, "hex"));
}

// LOCKED — second credit check. Runs on every `next dev` and `next build`
// (even if the prebuild script is removed). Do not edit. See LICENSE.
function assertCredit(): void {
  if (creditUnlocked()) return;
  const read = (p: string) => {
    try {
      return readFileSync(path.join(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");
    } catch {
      return "";
    }
  };
  const credit = read("src/components/SiteCredit.tsx");
  const footer = read("src/components/Footer.tsx")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const ok =
    createHash("sha256").update(credit).digest("hex") === "520ab177a89272b386362897012c2dd0b936d573690d5e2d694aa1e312fdb0cc" &&
    /import\s+SiteCredit\s+from\s+['"]\.\/SiteCredit['"]/.test(footer) &&
    footer.includes("<SiteCredit />");
  if (!ok) {
    throw new Error(
      'Footer credit "Created by Quick Art Photography Academy" was changed or removed. ' +
        "It is required by the LICENSE. Restore it, or set CREDIT_REMOVAL_KEY (authorised removal only)."
    );
  }
}
assertCredit();

const nextConfig: NextConfig = {
  env: {
    SITE_CREDIT_UNLOCKED: creditUnlocked() ? "1" : "0",
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "commondatastorage.googleapis.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
