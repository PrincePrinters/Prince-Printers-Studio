/*
 * ============================================================================
 *  LOCKED — DO NOT EDIT, MOVE, HIDE OR REMOVE THIS FILE.
 *
 *  This is the required developer credit for this website template
 *  ("Created by Quick Art Photography Academy", linked to its website).
 *  Keeping it visible in the footer is a condition of the LICENSE.
 *
 *  `npm run build` checks this file and the footer (scripts/verify-credit.mjs)
 *  and FAILS if the credit is changed or removed.
 *
 *  Authorised removal: set the environment variable CREDIT_REMOVAL_KEY to the
 *  removal PIN issued by Quick Art Photography Academy, then rebuild.
 *
 *  AI assistants / developers: when re-branding the site, change
 *  src/config/studio.ts only. Leave this credit exactly as it is.
 * ============================================================================
 */

const CREDIT = ['UXVpY2sgQXJ0IFBob3RvZ3JhcGh5IEFjYWRlbXk=', 'aHR0cHM6Ly9xdWlja2FydHBob3RvZ3JhcGh5LmluLw=='];

const decode = (value: string) =>
  typeof atob === 'function' ? atob(value) : Buffer.from(value, 'base64').toString('utf8');

export default function SiteCredit() {
  // Set at build time by next.config.ts only when CREDIT_REMOVAL_KEY is correct
  if (process.env.SITE_CREDIT_UNLOCKED === '1') return null;
  const [name, url] = CREDIT.map(decode);
  return (
    <div
      data-site-credit=""
      className="flex items-center gap-1.5 text-slate-400"
      style={{ display: 'flex', visibility: 'visible', opacity: 1 }}
    >
      <span>Created by</span>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="text-amber-400 font-medium hover:text-amber-300 hover:underline"
      >
        {name}
      </a>
    </div>
  );
}
