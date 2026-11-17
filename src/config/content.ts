/**
 * ============================================================
 *  WEBSITE CONTENT — aapka asli kaam, daam aur reviews yahan
 * ============================================================
 *  - Jo list khaali ([]) hai, uska section website par CHHUPA rahega.
 *  - Photos/videos: file `public/` folder mein daaliye aur yahan '/work/photo1.jpg'
 *    jaisa path likhiye. (Ya Cloudflare R2 / YouTube ka poora https:// link.)
 *  - Har list ke upar ek example comment hai — copy karke apni details bhariye.
 *  - Sirf asli content daaliye: nakli reviews ya stock photos mat lagaiye.
 */

/* ---------- 1. Home page ki badi slideshow (Hero) ---------- */
export interface HeroSlide {
  url: string;
  title: string;
  couple: string;
  venue: string;
}
/* Example:
  { url: '/work/hero-1.jpg', title: 'Varmala Moment', couple: 'Rahul & Priya', venue: 'Siwan, Bihar' },
*/
export const heroSlides: HeroSlide[] = [];

/* ---------- 2. Featured films (wedding teasers) ---------- */
export interface WeddingFilm {
  id: string;
  couple: string;
  title: string;
  venue: string;
  /** e.g. '4:35 Min Teaser' */
  duration: string;
  /** cover photo */
  poster: string;
  /** .mp4 file ka link (public/ ya R2) */
  videoUrl: string;
  storyQuote: string;
  tags: string[];
}
/* Example:
  {
    id: 'film-1', couple: 'Rahul & Priya', title: 'Siwan Royal Wedding', venue: 'Siwan, Bihar',
    duration: '4:00 Min Teaser', poster: '/work/film1.jpg', videoUrl: '/work/film1.mp4',
    storyQuote: 'Ek line film ke baare mein.', tags: ['Wedding', 'Siwan'],
  },
*/
export const films: WeddingFilm[] = [];

/* ---------- 3. Portfolio photos ---------- */
export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Wedding' | 'Pre-Wedding' | 'Cinematic Film' | 'Portraits';
  image: string;
  tag: string;
  /** khaali chhod sakte hain */
  camera: string;
}
/* Example:
  { id: 'p-1', title: 'Haldi Ceremony', category: 'Wedding', image: '/work/p1.jpg', tag: 'Haldi', camera: '' },
*/
export const portfolio: PortfolioItem[] = [];

/* ---------- 4. Color grading before/after slider ---------- */
/** Ek graded photo ka path. Khaali = section chhupa rahega. */
export const colorGradeImage = '';

/* ---------- 5. Packages (daam) ---------- */
export interface StudioPackage {
  id: string;
  name: string;
  badge?: string;
  /** e.g. '₹55,000' */
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}
/* Example:
  {
    id: 'silver', name: 'Silver', price: '₹55,000', description: 'Chhoti shaadi ke liye',
    features: ['1 Photographer', '1 Videographer', '300+ Photos'],
  },
*/
export const packages: StudioPackage[] = [];

/**
 * Custom package estimator (packages ke neeche). null = chhupa rahega.
 * Example: { perDay: 35000, perCrewPerDay: 8000, dronePerDay: 15000, perAlbum: 12000 }
 */
export const estimatorRates: {
  perDay: number;
  perCrewPerDay: number;
  dronePerDay: number;
  perAlbum: number;
} | null = null;

/* ---------- 6. Client reviews (sirf asli reviews) ---------- */
export interface Testimonial {
  couple: string;
  venue: string;
  event: string;
  /** couple ki photo (unki permission ke saath) — khaali chhod sakte hain */
  image: string;
  rating: number;
  quote: string;
}
/* Example:
  { couple: 'Rahul & Priya', venue: 'Siwan', event: 'Wedding', image: '', rating: 5, quote: 'Review ka text...' },
*/
export const testimonials: Testimonial[] = [];
