/**
 * ============================================================
 *  STUDIO CONFIG — poori website ki details sirf yahan badliye
 * ============================================================
 *  Studio ka naam, logo, owner profile, phone, WhatsApp, address,
 *  social links aur SEO yahin se poori website mein dikhte hain.
 *  Kisi field ko '' (khaali) chhodne par uska button/line chhup jaata hai
 *  (jahan aisa ho sakta hai).
 *
 *  Photos/logo: file ko `public/` folder mein daaliye aur yahan
 *  '/file-name.png' likhiye.
 */

export const studio = {
  brand: {
    /** Poora naam — titles, footer, copyright mein */
    name: 'Prince Printers & Studio',
    /** Logo ke paas naam do hisson mein: pehla safed, doosra gold */
    nameMain: 'Prince Printers',
    nameHighlight: '& Studio',
    /** Logo ke neeche chhoti line */
    tagline: 'Photography, Studio & Printing Solutions',
    /** Chhota naam / initials */
    shortName: 'PPS',
    /** Company / legal naam — copyright line mein */
    legalName: 'Prince Printers & Studio',
    /** Footer copyright ka saal */
    copyrightYear: '2026',
    logo: '/prince-logo.png',
    favicon: '/prince-logo.png',
    /** Live website ka address, e.g. 'https://mystudio.in' */
    websiteUrl: '',
  },

  owner: {
    /** Poora naam — About page heading */
    fullName: 'Mr. Dinesh Mandal',
    /** Website par zyadatar yeh naam dikhega */
    displayName: 'Dinesh Mandal',
    /** Chat button ke liye, e.g. "Chat with Dinesh" */
    firstName: 'Dinesh',
    /** WhatsApp messages mein sambodhan, e.g. "Hello Dinesh Sir" */
    salutation: 'Dinesh Sir',
    /** Designation — e.g. "Director", "Founder" */
    designation: 'Owner & Founder',
    title: 'Mr',
    role: 'Owner & Lead Photographer',
    subtitleLine: 'Owner & Founder | Photography & Printing Services',
    photo: '/dinesh-mandal.jpg',
    aboutPhoto: '/dinesh-mandal.jpg',
    yearsExperience: '12+',
  },

  stats: {
    weddingsCovered: '250+',
    googleRating: '4.9',
    googleReviewCount: '150+',
  },

  contact: {
    /** Main booking phone (display format) */
    phone: '+91 98357 58765',
    /** WhatsApp number: sirf digits, country code ke saath */
    whatsapp: '919835758765',
    email: 'studioprintersprince@gmail.com',
    address: 'Vill- Kashitar, Karmatar, Jamtara, Jharkhand',
    city: 'Karmatar, Jamtara',
    state: 'Jharkhand',
    /** Shoot ke liye kin shehron/areas mein jaate hain */
    serviceAreas: 'Block Road Kashitar, Karmatar, Jamtara',
    /** Contact form / date checker mein default shehar */
    defaultDestination: 'Karmatar / Jamtara',
    workingHours: 'Mon – Sat: 9:00 AM – 8:00 PM IST',
    googleMapsUrl:
      'https://maps.google.com/?q=Vill-+Kashitar,+Karmatar,+Jamtara+Jharkhand',
    /** Studio tak pahunchne ke landmarks (Contact page) */
    landmarks: [
      'Near Block Road, Kashitar, Karmatar',
      'Convenient access across Karmatar & Jamtara district',
      'Visit our studio for instant photo printing, portraits & digital services',
    ],
  },

  social: {
    instagram: 'https://instagram.com/printersprince',
    youtube: 'https://www.youtube.com/results?search_query=PRINCE+PRINTERS+%26+STUDIO',
    facebook: 'https://www.facebook.com/search/top?q=Prince%20Printers%20%26%20Studio',
  },

  /** Academy / course. enabled: false karne par academy wale buttons chhup jaate hain */
  academy: {
    enabled: false,
    name: 'Prince Printers & Studio',
    courseName: 'Photography & Digital Editing Masterclass',
    courseShortName: 'Photography Masterclass',
    /** Admissions ka alag phone/WhatsApp (khaali = contact.phone use hoga) */
    phone: '',
    whatsapp: '',
  },

  /** About page par owner ke products/brands ke links (khaali list = kuch nahi dikhega) */
  products: [],

  /** About page ke founder section ke paragraphs */
  aboutParagraphs: [
    'Prince Printers & Studio ki shuruat 22 March 2018 (22/03/2018) ko Mr. Dinesh Mandal dwara ki gayi thi, jinhe photography, studio portraits aur digital printing services mein 12+ varsho ka lamba aur vishwasneeya anubhav hai.',
    'Kashitar, Karmatar, Jamtara mein sthit hamara studio wedding photography, candid shoots, passport photos, high-quality color printing, lamination, scanning, photocopy, online form filling aur graphic design ki sampoorna suvidha pradan karta hai.',
  ],

  seo: {
    title: 'Prince Printers & Studio | Photography & Printing Services in Jamtara',
    description:
      'Prince Printers & Studio by Dinesh Mandal in Kashitar, Karmatar, Jamtara. Professional wedding photography, color printing, lamination, and digital studio services.',
    themeColor: '#f59e0b',
  },
} as const;

/* ---------- Helpers (inhe badalne ki zaroorat nahi) ---------- */

/** "+91 99310 86057" -> "tel:+919931086057" */
export function telLink(phone: string = studio.contact.phone) {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}

/** WhatsApp chat link, optional pre-filled message */
export function whatsappLink(message?: string, number: string = studio.contact.whatsapp) {
  const base = `https://wa.me/${number.replace(/[^0-9]/g, '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const academyPhone = studio.academy.phone || studio.contact.phone;
export const academyWhatsapp = studio.academy.whatsapp || studio.contact.whatsapp;
