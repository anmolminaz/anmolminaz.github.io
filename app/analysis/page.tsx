import Link from 'next/link';
import { getItems } from '@/lib/notion';

export default async function Analysis() {
  const items = await getItems(process.env.NOTION_ANALYSIS_DB_ID!);

  const sorted = [...items].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-3 font-medium">Methods & Data</p>
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Analysis</h1>
        <p className="text-slate-500 text-sm leading-6">
          Statistical analyses, data explorations, and methodological notes. Each piece documents the approach, tools, and key findings.
        </p>
      </div>

      {sorted.length > 0 && (
        <div className="divide-y divide-slate-100">
          {sorted.map((item) => (
            <article key={item.id} className="py-7 first:pt-0 last:pb-0 group">
              <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <Link href={`/analysis/${item.slug}`} className="inline-flex items-baseline gap-1 text-base font-semibold text-slate-900 hover:text-teal-700 underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500 transition leading-6 mb-2">
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
                <div className="sm:text-right">
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
