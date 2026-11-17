/**
 * Blog posts are simple Markdown files in `content/blog/`.
 * Naya post = naya `.md` file. File ka naam hi URL banta hai:
 *   content/blog/wedding-tips.md  ->  /blog/wedding-tips
 *
 * File ke upar yeh header (frontmatter) rakhiye:
 * ---
 * title: Post ka title
 * date: 2026-11-04
 * excerpt: 1–2 line summary (listing page par dikhegi)
 * cover: /blog/cover.jpg        (optional – public/ folder ki image ya https link)
 * author: Studio ka naam         (optional)
 * tags: Wedding, Tips            (optional)
 * ---
 */
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  author: string;
  tags: string[];
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

function parseFile(slug: string, raw: string): BlogPost {
  const meta: Record<string, string> = {};
  let body = raw;
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fm) {
    body = raw.slice(fm[0].length);
    for (const line of fm[1].split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z_]+):\s*(.*)$/);
      if (m) meta[m[1].toLowerCase()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: meta.title || slug.replace(/-/g, ' '),
    date: meta.date || '',
    excerpt: meta.excerpt || body.replace(/[#*_>`[\]()!-]/g, '').trim().slice(0, 160),
    cover: meta.cover || '',
    author: meta.author || '',
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body, { async: false }) as string,
  };
}

function slugs(): string[] {
  try {
    return fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
      .map((f) => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  'use cache';
  return slugs()
    .map((slug) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { html, ...meta } = parseFile(slug, fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8'));
      return meta;
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  'use cache';
  if (!/^[a-zA-Z0-9-][a-zA-Z0-9-_]*$/.test(slug)) return null;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parseFile(slug, fs.readFileSync(file, 'utf8'));
}

export async function getAllSlugs(): Promise<string[]> {
  return slugs();
}

export function formatDate(date: string) {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d.getTime()) ? date : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
