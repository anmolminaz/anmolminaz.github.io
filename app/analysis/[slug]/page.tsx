import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItemBySlug, getPublicationsByIds } from '@/lib/notion';
import NotionRenderer from '@/components/NotionRenderer';
import ExternalLink from '@/components/ExternalLink';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function AnalysisDetail({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItemBySlug(process.env.NOTION_ANALYSIS_DB_ID!, slug);

  if (!item) notFound();

  const relatedPublications = item.relatedPublicationIds?.length
    ? await getPublicationsByIds(item.relatedPublicationIds)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-2">
        <Link href="/analysis" className="text-xs text-teal-700 hover:underline underline-offset-2">
          ← Analysis
        </Link>
      </div>

      <article>
        <header className="mb-10 pt-4">
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.tags.map((tag) => (
                <span key={tag} className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-slate-900 leading-snug mb-4">{item.title}</h1>
          {item.summary && (
            <p className="text-base text-slate-500 leading-7 italic">{item.summary}</p>
          )}
          {item.date && (
            <time className="text-xs text-slate-400 block mt-3">
              {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
        </header>

        {item.content && (
          <div className="prose-academic">
            <NotionRenderer blocks={item.content as never[]} />
          </div>
        )}
      </article>

      {relatedPublications.length > 0 && (
        <aside className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium mb-6">Related Publications</h2>
          <div className="space-y-5">
            {relatedPublications.map((pub) => (
              <div key={pub.id}>
                <p className="text-sm font-semibold text-slate-900 leading-6 mb-1">
                  {pub.doi ? (
                    <ExternalLink
                      href={pub.doi}
                      className="underline underline-offset-2 decoration-slate-300 hover:text-teal-700 hover:decoration-teal-500 transition-all"
                    >
                      {pub.title}
                    </ExternalLink>
                  ) : pub.title}
                </p>
                <p className="text-sm text-slate-500">
                  {pub.authors && <span>{pub.authors} · </span>}
                  {pub.journal && <em>{pub.journal}</em>}
                  {pub.year > 0 && <span> · {pub.year}</span>}
                </p>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
