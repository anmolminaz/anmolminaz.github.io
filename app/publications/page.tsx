import Link from 'next/link';
import { getPublications, getResearchItems, getItems } from '@/lib/notion';
import { Publication, NotionItem, ResearchItem } from '@/types';
import AuthorList from '@/components/AuthorList';
import ExternalLink from '@/components/ExternalLink';

function groupByYear(pubs: Publication[]): Record<number, Publication[]> {
  return pubs.reduce((acc, pub) => {
    const year = pub.year || 0;
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);
}

type SlugMap = Map<string, { title: string; slug: string }>;

function buildSlugMap(items: (NotionItem | ResearchItem)[]): SlugMap {
  return new Map(items.map(i => [i.id, { title: i.title, slug: i.slug }]));
}

export default async function Publications() {
  const [publications, researchItems, analysisItems] = await Promise.all([
    getPublications(),
    getResearchItems(),
    getItems(process.env.NOTION_ANALYSIS_DB_ID!),
  ]);

  const researchMap = buildSlugMap(researchItems);
  const analysisMap = buildSlugMap(analysisItems);

  const sorted = [...publications].sort((a, b) => (b.year || 0) - (a.year || 0));
  const grouped = groupByYear(sorted);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-14">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-3 font-medium">Academic Work</p>
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Publications</h1>
        <p className="text-slate-500 text-sm leading-6">
          Peer-reviewed articles, systematic reviews, and reports.
        </p>
      </div>

      {years.length > 0 && (
        <div className="space-y-14">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">{year || 'Undated'}</h2>
              <ol className="space-y-8">
                {grouped[year].map((pub) => {
                  const relatedResearch = pub.relatedResearchIds
                    .map(id => researchMap.get(id))
                    .filter((x): x is { title: string; slug: string } => !!x);

                  const relatedAnalysis = pub.relatedAnalysisIds
                    .map(id => analysisMap.get(id))
                    .filter((x): x is { title: string; slug: string } => !!x);

                  const hasSeeAlso = relatedResearch.length > 0 || relatedAnalysis.length > 0;

                  return (
                    <li key={pub.id}>
                      <p className="pub-title text-sm font-semibold text-slate-900 leading-6 mb-1">
                        {pub.doi ? (
                          <ExternalLink
                            href={pub.doi}
                            className="underline underline-offset-2 decoration-slate-300 hover:text-teal-700 hover:decoration-teal-500 transition-all"
                          >
                            {pub.title}
                          </ExternalLink>
                        ) : pub.title}
                      </p>

                      <p className="text-sm text-slate-600 leading-6">
                        <AuthorList authors={pub.authors} />
                      </p>

                      <p className="text-sm text-slate-500 leading-6">
                        {pub.journal && <em>{pub.journal}</em>}
                        {pub.year > 0 && pub.journal && <span>. {pub.year}.</span>}
                      </p>

                      {hasSeeAlso && (
                        <p className="text-xs text-slate-400 mt-2 leading-5">
                          <span className="font-medium text-slate-500">See also: </span>
                          {relatedResearch.map((r, i) => (
                            <span key={r.slug}>
                              {i > 0 && ', '}
                              <Link
                                href={`/research/${r.slug}`}
                                className="text-teal-700 underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-all"
                              >
                                {r.title}
                              </Link>
                              <span className="text-slate-300 ml-1">[research]</span>
                            </span>
                          ))}
                          {relatedResearch.length > 0 && relatedAnalysis.length > 0 && ', '}
                          {relatedAnalysis.map((a, i) => (
                            <span key={a.slug}>
                              {relatedResearch.length === 0 && i > 0 && ', '}
                              <Link
                                href={`/analysis/${a.slug}`}
                                className="text-teal-700 underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-all"
                              >
                                {a.title}
                              </Link>
                              <span className="text-slate-300 ml-1">[analysis]</span>
                            </span>
                          ))}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
