import Link from 'next/link';
import { getResearchItems } from '@/lib/notion';

export default async function Research() {
  const items = await getResearchItems();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-3 font-medium">Projects & Investigations</p>
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Research</h1>
        <p className="text-slate-500 text-sm leading-6">
          Ongoing and completed research projects spanning epidemiology, maternal and child health, and infectious disease.
        </p>
      </div>

      {items.length > 0 && (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <article key={item.id} className="py-7 first:pt-0 last:pb-0 group">
              <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <Link href={`/research/${item.slug}`} className="inline-flex items-baseline gap-1 text-base font-semibold text-slate-900 hover:text-teal-700 underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500 transition leading-6 mb-2">
                    {item.title} <span className="text-teal-600">→</span>
                  </Link>
                  {item.summary && (
                    <p className="text-sm text-slate-500 leading-6 mb-3">{item.summary}</p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sm:text-right shrink-0">
                  {item.date && (
                    <time className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </time>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
