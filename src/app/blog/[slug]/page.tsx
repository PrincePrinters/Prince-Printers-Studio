/* eslint-disable @next/next/no-img-element -- cover images can be local or any https URL */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { studio, whatsappLink } from '@/config/studio';
import { getAllSlugs, getPost, formatDate } from '@/lib/blog';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: `Blog | ${studio.brand.name}` };
  return {
    title: `${post.title} | ${studio.brand.name}`,
    description: post.excerpt,
    openGraph: post.cover ? { images: [post.cover] } : undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 mb-6">
            <ArrowLeft className="w-4 h-4" /> All Posts
          </Link>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">{post.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span>{post.author || studio.brand.name}</span>
            {post.date && <span>&bull; {formatDate(post.date)}</span>}
            <span className="flex items-center gap-1">
              &bull; <Clock className="w-3 h-3" /> {post.readingMinutes} min read
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {t}
                </span>
              ))}
            </div>
          )}

          {post.cover && (
            <img src={post.cover} alt={post.title} className="mt-8 w-full aspect-[16/9] object-cover rounded-2xl sm:rounded-3xl border border-slate-800" />
          )}

          <div className="blog-content mt-8 sm:mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div className="mt-12 p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white">Apni shaadi ki date book karni hai?</div>
              <div className="text-xs text-slate-400 mt-1">{studio.brand.name} se seedha baat kariye.</div>
            </div>
            <a
              href={whatsappLink(`Hello ${studio.owner.salutation}, I read your blog "${post.title}" and want to know about wedding packages.`)}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
