import Link from 'next/link';
import { getBlogPosts } from '@/lib/notion';

export default async function Writing() {
  const posts = await getBlogPosts();

  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-3 font-medium">Commentary & Notes</p>
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Writing</h1>
        <p className="text-slate-500 text-sm leading-6">
          Analysis, commentary, and reflections on epidemiology, research methods, and public health.
        </p>
      </div>

      {sorted.length > 0 && (
        <div className="divide-y divide-slate-100">
          {sorted.map((post) => (
            <article key={post.id} className="py-7 first:pt-0 last:pb-0 grid sm:grid-cols-[1fr_auto] gap-4 items-start group">
              <div>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-baseline gap-1 text-base font-semibold text-slate-900 hover:text-teal-700 underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500 transition leading-6 mb-2">
                  {post.title} <span className="text-teal-600">→</span>
                </Link>
                {post.summary && (
                  <p className="text-sm text-slate-500 leading-6 mb-3">{post.summary}</p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <time className="text-xs text-slate-400 whitespace-nowrap sm:text-right pt-0.5">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
