/* eslint-disable @next/next/no-img-element -- cover images can be local or any https URL */
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { studio } from '@/config/studio';
import { getAllPosts, formatDate } from '@/lib/blog';

export const metadata = {
  title: `Blog | ${studio.brand.name}`,
  description: `Wedding photography tips, stories and guides from ${studio.brand.name}.`,
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="py-14 sm:py-20 border-b border-slate-900 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <BookOpen className="w-4 h-4" />
            <span>{studio.brand.name} Blog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Stories, Tips &amp; <span className="gold-gradient-text">Wedding Guides</span>
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Wedding planning, photography aur filmmaking se jude useful articles.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {posts.length === 0 ? (
            <p className="text-center text-slate-400">Abhi koi post nahi hai.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/50 bg-slate-900/60 transition flex flex-col"
                >
                  <div className="aspect-[16/9] bg-slate-900 overflow-hidden">
                    {post.cover ? (
                      <img
                        src={post.cover}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <BookOpen className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-2">
                      {post.date && <span>{formatDate(post.date)}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readingMinutes} min
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                    <span className="mt-4 text-xs font-bold text-amber-400 flex items-center gap-1">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
