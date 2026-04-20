import Link from 'next/link';
import { getResearchItems, getBlogPosts, getPublications, getProfileItems } from '@/lib/notion';
import AuthorList from '@/components/AuthorList';
import ExternalLink from '@/components/ExternalLink';

export default async function Home() {
  const [researchItems, blogPosts, publications, profileItems] = await Promise.all([
    getResearchItems(),
    getBlogPosts(),
    getPublications(),
    getProfileItems(),
  ]);

  const hero = profileItems.find(i => i.type === 'Hero');
  const experience = profileItems.filter(i => i.type === 'Experience');
  const education = profileItems.filter(i => i.type === 'Education');

  const heroTagline = hero?.organization;
  const heroBio = hero?.summary;
  const heroCredentials = hero?.detail;

  const featuredResearch = researchItems.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);

  const sortedPubs = [...publications].sort((a, b) => (b.year || 0) - (a.year || 0));
  const featuredPublications = sortedPubs.filter(p => p.featured).slice(0, 3);
  const displayPublications = featuredPublications.length > 0
    ? featuredPublications
    : sortedPubs.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-20">

      {/* Hero */}
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.4em] text-teal-700 mb-4 font-medium">
          {heroTagline}
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-tight mb-5">
          Anmol Minaz
        </h1>
        <p className="text-lg text-slate-600 leading-8 mb-2">
          {heroBio}
        </p>
        <p className="text-base text-slate-500 leading-7 mb-6">
          {heroCredentials}
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link href="/cv-resume" className="btn-secondary">View CV</Link>
          <Link href="/publications" className="btn-primary">Publications</Link>
          <Link href="/contact" className="text-sm font-medium text-slate-500 hover:text-teal-700 transition underline underline-offset-2 decoration-slate-300 hover:decoration-teal-600">
            Get in touch →
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <ExternalLink
            href="https://scholar.google.com/citations?user=anmolminaz"
            className="text-teal-700 font-medium hover:text-teal-800 transition underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600"
          >
            Google Scholar
          </ExternalLink>
          <span className="text-slate-300">·</span>
          <ExternalLink
            href="https://www.linkedin.com/in/anmol-minaz"
            className="text-slate-400 hover:text-teal-700 transition underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500"
          >
            LinkedIn
          </ExternalLink>
          <span className="text-slate-300">·</span>
          <a
            href="mailto:anmol.minaz@alumni.emory.edu"
            className="text-slate-400 hover:text-teal-700 transition underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500"
          >
            anmol.minaz@alumni.emory.edu
          </a>
        </div>
      </section>

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-6 font-medium">Experience</h2>
          <div className="space-y-8">
            {experience.map((item) => (
              <div key={item.id} className="grid sm:grid-cols-[1fr_auto] gap-1 sm:gap-8 items-start">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500 mb-2">{item.organization}</p>
                  {item.summary && <p className="text-sm text-slate-600 leading-6">{item.summary}</p>}
                </div>
                <p className="text-sm text-slate-400 whitespace-nowrap sm:text-right pt-0.5">{item.period}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-6 font-medium">Education</h2>
          <div className="space-y-6">
            {education.map((item) => (
              <div key={item.id} className="grid sm:grid-cols-[1fr_auto] gap-1 sm:gap-8 items-start">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.organization}</p>
                  {item.detail && <p className="text-sm text-slate-400 mt-1">{item.detail}</p>}
                </div>
                <p className="text-sm text-slate-400 whitespace-nowrap sm:text-right">{item.period}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Publications */}
      {displayPublications.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium">Selected Publications</h2>
            <Link href="/publications" className="text-xs text-teal-700 hover:text-teal-800 font-medium underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-all">
              All publications →
            </Link>
          </div>
          <div className="space-y-5 divide-y divide-slate-100">
            {displayPublications.map((pub) => (
              <div key={pub.id} className="pt-5 first:pt-0">
                <p className="pub-title text-sm leading-6 text-slate-800 font-medium mb-1">
                  {pub.doi ? (
                    <ExternalLink href={pub.doi} className="underline underline-offset-2 decoration-slate-300 hover:text-teal-700 hover:decoration-teal-500 transition-all">
                      {pub.title}
                    </ExternalLink>
                  ) : pub.title}
                </p>
                <p className="text-sm text-slate-500">
                  <AuthorList authors={pub.authors} />
                  {pub.journal && <> · <em>{pub.journal}</em></>}
                  {pub.year > 0 && <> · {pub.year}</>}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Research */}
      {featuredResearch.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium">Research</h2>
            <Link href="/research" className="text-xs text-teal-700 hover:text-teal-800 font-medium underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-all">
              All research →
            </Link>
          </div>
          <div className="space-y-5 divide-y divide-slate-100">
            {featuredResearch.map((item) => (
              <div key={item.id} className="pt-5 first:pt-0">
                <Link href={`/research/${item.slug}`} className="text-sm font-medium text-slate-900 hover:text-teal-700 underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500 transition-all">
                  {item.title} →
                </Link>
                {item.summary && <p className="text-sm text-slate-500 mt-1">{item.summary}</p>}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Writing */}
      {latestPosts.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium">Writing</h2>
            <Link href="/blog" className="text-xs text-teal-700 hover:text-teal-800 font-medium underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-all">
              All writing →
            </Link>
          </div>
          <div className="space-y-4 divide-y divide-slate-100">
            {latestPosts.map((post) => (
              <article key={post.id} className="pt-4 first:pt-0 flex items-baseline justify-between gap-4">
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-slate-900 hover:text-teal-700 underline underline-offset-2 decoration-slate-200 hover:decoration-teal-500 transition-all">
                  {post.title} →
                </Link>
                <time className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </time>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
