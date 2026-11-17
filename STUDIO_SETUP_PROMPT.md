# Studio Website — Setup Guide & Master Prompt

Yeh website ek **master template** hai. Studio ka naam, logo, owner profile, phone, WhatsApp,
address, social links aur SEO — sab ek hi file se aate hain:

**`src/config/studio.ts`**

Is file ko badalte hi poori website (Home, About, Contact, Gallery, Admin, footer, WhatsApp
buttons) apne aap badal jaati hai.

---

## Tarika 1 — AI se karwaiye (sabse aasaan)

1. Repo ko apne computer par kholiye (VS Code + Claude Code, ya koi AI coding tool).
2. Apna **logo** aur **owner ki photo** project ke `public/` folder mein daal dijiye.
3. Neeche **Part A** bhariye.
4. **Part A + Part B** dono copy karke AI ko dijiye.
5. AI ke kaam ke baad website check kariye, phir **"Website live kaise karein"** wale steps follow kariye.

## Tarika 2 — Khud kariye

`src/config/studio.ts` kholiye, har line ke upar Hindi mein samjhaya hua hai. Values badaliye,
save kariye — bas. (`npm run dev` chala kar http://localhost:3000 par dekh sakte hain.)

---

## Part A — Aapki Details (yahan bhariye)

Jo cheez nahi hai use khaali (`""`) chhod dijiye — website par woh button/line chhup jaayegi.

```yaml
# ---------- STUDIO / BRAND ----------
studio_name:            ""   # poora naam, e.g. "Royal Frames Studio"
name_on_logo_white:     ""   # logo ke paas safed hissa, e.g. "Royal Frames"
name_on_logo_gold:      ""   # gold hissa, e.g. "Studio"
tagline_under_logo:     ""   # e.g. "Wedding Films & Photography"
short_name:             ""   # e.g. "RFS"
legal_name:             ""   # copyright / invoice par, e.g. "Royal Frames Studio Pvt Ltd"
logo_file:              ""   # public/ mein file ka naam, e.g. "my-logo.png"
favicon_file:           ""   # browser tab icon, e.g. "my-logo.png"
website_url:            ""   # e.g. "https://royalframes.in"

# ---------- OWNER / DIRECTOR PROFILE ----------
owner_full_name:        ""   # e.g. "Rahul Kumar Verma"
owner_display_name:     ""   # website par zyadatar, e.g. "Rahul Verma"
owner_first_name:       ""   # e.g. "Rahul"
owner_salutation:       ""   # WhatsApp messages mein, e.g. "Rahul Sir"
owner_designation:      ""   # e.g. "Director"
owner_title:            ""   # e.g. "Founder & CEO"
owner_role:             ""   # e.g. "Lead Cinematographer & Founder"
owner_subtitle_line:    ""   # About page, e.g. "Founder | Wedding Filmmaker | Educator"
owner_photo_file:       ""   # public/ mein, square photo (1024x1024 best)
owner_about_photo_file: ""   # About page wali photo (same bhi chalegi)
years_experience:       ""   # e.g. "8+"
about_paragraph_1: |
  
about_paragraph_2: |
  
owner_products:              # optional: naam paragraph mein aaye to link ban jaayega
  - name: ""
    url: ""

# ---------- STATS ----------
weddings_covered:       ""   # e.g. "300+"
google_rating:          ""   # e.g. "4.8"
google_review_count:    ""   # e.g. "150+"

# ---------- CONTACT ----------
phone:                  ""   # e.g. "+91 98XXX XXXXX"
whatsapp_number:        ""   # sirf digits + country code, e.g. "9198XXXXXXXX"
email:                  ""
address_full:           ""
city:                   ""
state:                  ""
service_areas:          ""   # e.g. "Lucknow, Kanpur, Varanasi and Delhi NCR"
default_destination:    ""   # date checker mein default, e.g. "Lucknow / UP"
working_hours:          ""   # e.g. "Mon – Sat: 10 AM – 8 PM"
google_maps_link:       ""
landmarks:                   # Contact page "Getting Here"
  - ""
  - ""

# ---------- SOCIAL ----------
instagram_url:          ""
youtube_url:            ""
facebook_url:           ""

# ---------- ACADEMY / COURSE ----------
has_academy:            ""   # "yes" / "no"
academy_name:           ""
course_name:            ""   # e.g. "12-Week Wedding Filmmaking Course"
course_short_name:      ""   # button par, e.g. "12-Week Course"
academy_phone:          ""   # khaali = main phone
academy_whatsapp:       ""   # khaali = main WhatsApp

# ---------- SEO ----------
seo_title:              ""   # Google / browser tab title
seo_description:        ""   # 1–2 line

# ---------- OPTIONAL: CONTENT ----------
packages:                    # 3 packages
  - { name: "", price: "", description: "", features: ["", "", ""], most_popular: false }
  - { name: "", price: "", description: "", features: ["", "", ""], most_popular: true  }
  - { name: "", price: "", description: "", features: ["", "", ""], most_popular: false }
testimonials:                # sirf ASLI reviews
  - { couple: "", venue: "", event: "", quote: "", photo_file: "" }
featured_films:              # MP4 link + poster
  - { title: "", couple: "", venue: "", video_url: "", poster_file: "" }
portfolio_photos: ""         # public/ mein file names, comma se alag
```

---

## Part B — AI ke liye instructions (isko mat badaliye)

```text
You are working in a Next.js 16 + Tailwind v4 wedding-studio website that is a white-label
template. Read AGENTS.md first; this Next.js version has breaking changes, so check
node_modules/next/dist/docs/ before changing framework code.

All studio identity lives in src/config/studio.ts (brand, owner, stats, contact, social,
academy, products, aboutParagraphs, seo). Components already read from it.

LOCKED — never edit, move, hide or remove: src/components/SiteCredit.tsx, the <SiteCredit />
line in src/components/Footer.tsx, the credit-lock block in next.config.ts, scripts/verify-credit.mjs, the "prebuild" script in
package.json, and LICENSE. The footer credit "Created by Quick Art Photography Academy" must
stay exactly as it is (required by LICENSE; `npm run build` fails if it is changed).

TASK: Re-brand the site using the "Part A" data above.

1. Update src/config/studio.ts with the Part A values. Keep the object shape and the
   helper functions unchanged. Map fields by meaning (e.g. name_on_logo_white -> brand.nameMain,
   has_academy "no" -> academy.enabled = false).
2. Empty Part A fields: set them to '' (or [] for lists). Do not invent phone numbers,
   addresses, ratings, reviews, prices or links. Where an empty value would leave a broken
   button or link on the page, hide that element with a conditional instead.
3. Check that every file named in Part A exists in public/. If one is missing, stop and
   tell me which file is missing — do not use a placeholder.
4. Optional content (only if given in Part A) goes in src/config/content.ts:
   packages / estimatorRates, testimonials, films, portfolio, heroSlides, colorGradeImage.
   Every list starts empty and an empty list hides its section — never add sample,
   stock or invented content there.
5. Search src/ for any leftover old brand text: "Quick Art", "Anil", "Sharma", "Siwan",
   "9931086057", "9939800780", "quickart". Replace anything that is studio identity
   with studio.* values — EXCEPT the locked credit files listed above. List anything you
   left and why.
6. Run `npx tsc --noEmit` and `npm run build`; fix errors you introduced.
7. Start `npm run dev` and check /, /about, /contact, /gallery/ANYCODE, /ai-search, /blog and
   /admin at desktop width and at 375px mobile width.
8. Reply in simple Hinglish: what changed, which fields were empty and what got hidden,
   any missing files, and anything I must still do before going live.
   Do NOT commit, push or deploy unless I ask.
```

---

## Website live kaise karein (Vercel — free)

1. Code ko apne **GitHub** account par push kariye (private repo theek hai).
2. https://vercel.com par GitHub se login → **Add New → Project** → apna repo chuniye → **Deploy**.
3. Vercel → Project → **Settings → Environment Variables** mein yeh daaliye:

   | Variable | Zaroori? | Kis liye |
   |---|---|---|
   | `ADMIN_PIN` | **Haan** | Admin panel (`/admin`) ka password. Lamba aur mushkil rakhiye. Iske bina live site par admin login nahi hoga |
   | `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_DOMAIN` | **Haan** | Photo/video storage. Vercel par files local folder mein save nahi ho sakti |
   | `META_VERIFY_TOKEN` | Sirf Meta Lead Ads ke liye | Koi bhi secret shabd; Meta webhook setup mein yahi daaliye. Webhook URL: `https://aapki-site/api/webhooks/meta-leads` |
   | `META_APP_SECRET` | Meta ke liye (recommended) | Check karta hai ki lead sach mein Meta se aayi hai |
   | `META_PAGE_ACCESS_TOKEN` | Meta ke liye (recommended) | Lead ka naam / phone / email laane ke liye |

4. **Cloudflare R2 CORS** (zaroori — iske bina guests ka Download aur Selfie search kaam nahi karega):
   Cloudflare → R2 → apna bucket → **Settings → CORS Policy** mein yeh daaliye (domain apna likhiye):
   ```json
   [{ "AllowedOrigins": ["https://yourstudio.com"], "AllowedMethods": ["GET"], "AllowedHeaders": ["*"] }]
   ```
   Saath hi bucket ka **Public access** (r2.dev ya custom domain) on kariye aur wahi URL `CLOUDFLARE_R2_PUBLIC_DOMAIN` mein daaliye.
5. Variables daalne ke baad **Deployments → Redeploy**.
6. Apna domain: **Settings → Domains** mein add kariye aur DNS records domain provider par daaliye.

Aage se kuch bhi badal ke GitHub par push kariye — Vercel apne aap website update kar dega.

**Vercel ke alawa (VPS / Hostinger Node.js hosting):** `npm ci && npm run build && npm start` chalaiye
(Node 20+). R2 set na ho to photos server ki disk par `public/uploads/` mein aur leads/events `.data/`
mein save hote hain — in dono folders ka backup rakhiye aur deploy karte waqt inhe delete mat kariye.
Netlify jaisi serverless hosting par disk save nahi hoti, wahan R2 zaroori hai.
(Local computer par `ADMIN_PIN` set na ho to PIN `2026` chalta hai — sirf testing ke liye.)

---

## Guests ke liye Photos — kaise kaam karta hai

**Studio (Admin):**
1. `/admin` kholiye → PIN daaliye → **Events** tab → **Naya Event Banaiye** (code, naam, date, jagah).
   (Seedhe upload karne par bhi naya code apne-aap event ban jaata hai.)
2. Upar wale **"Photos / Videos Upload"** box mein event code likhiye (jaise `RAHUL2026` — naya code bhi chalega), folder chuniye (Haldi / Wedding / Reception…), files chuniye → **Upload Karein**.
   Photos upload hote waqt unke chehre bhi scan ho jaate hain, taaki guests ka selfie search tez chale.
3. Wahin **Guest QR Code** ban jaata hai → **QR** button se download karke print kariye, venue / invitation par lagaiye.

**Guest:**
1. Phone camera se QR scan kare — ya website par event code daale → gallery khulti hai.
2. Kisi bhi photo / video ko dekh ke **Download** kare, ya **Sab Download Karein**.
3. **Find My Photos** → selfie le → sirf uski photos dikhengi → **Meri Saari Photos Download**.
   Selfie guest ke phone se bahar nahi jaati; matching uske browser mein hoti hai.

---

## Blog

Har post ek Markdown file hai: **`content/blog/`** folder.

1. `content/blog/_template.md` copy kariye, naya naam dijiye — jaise `pre-wedding-shoot-tips.md`
   (yahi URL banega: `/blog/pre-wedding-shoot-tips`).
2. Upar title, date, excerpt, cover photo badaliye; neeche post likhiye.
3. GitHub par push kariye → post live. (`_` se shuru hone wali files nahi dikhti.)

Blog mein do starter posts hain — chahein to rakhiye, badaliye ya delete kariye.

---

## 🔒 Footer Credit (badla nahi ja sakta)

Footer mein **"Created by Quick Art Photography Academy"** (link: https://quickartphotography.in/) hamesha rahega.
Yeh [LICENSE](LICENSE) ki shart hai. Agar `src/components/SiteCredit.tsx` ya footer se ise badla / hataya gaya,
to `npm run build` ruk jaayega aur website deploy nahi hogi. Studio ki details badalne ke liye sirf
`src/config/studio.ts` badaliye.

**Credit hatane ki permission:** sirf "Created by…" wali line (baaki footer nahi) tab hategi jab hosting ke
Environment Variables mein `CREDIT_REMOVAL_KEY` = Quick Art Photography Academy ka diya hua removal PIN daala jaaye
aur website dobara build / redeploy ki jaaye. PIN ke liye https://quickartphotography.in/ par sampark kariye.

---

## ⚠️ Live karne se pehle zaroor jaaniye

**Asli aur kaam karne wale features:** event code / QR se gallery, admin se event banana/edit/delete, photo-video upload, download, selfie se face search, website inquiry form → admin leads pipeline (call logs, follow-up, stage), Meta Lead Ads webhook, blog, admin login (server par PIN check).

**Aapko khud bharna hai:** `src/config/content.ts` — packages, reviews, portfolio, films, hero photos. Jab tak khaali hai, woh sections website par nahi dikhte.

**Online payment nahi hai** — clients ko WhatsApp / UPI se payment lijiye.
