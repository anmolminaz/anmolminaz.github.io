import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItemBySlug } from '@/lib/notion';
import NotionRenderer from '@/components/NotionRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;
  const post = await getItemBySlug(process.env.NOTION_BLOG_DB_ID!, slug);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-2">
        <Link href="/blog" className="text-xs text-teal-700 hover:underline underline-offset-2">
          ← Writing
        </Link>
      </div>

      <article>
        <header className="mb-10 pt-4">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-slate-900 leading-snug mb-4">{post.title}</h1>
          {post.summary && (
            <p className="text-base text-slate-500 leading-7 italic mb-3">{post.summary}</p>
          )}
          {post.date && (
            <time className="text-xs text-slate-400 block">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
        </header>

        {post.content && (
          <div className="prose-academic">
            <NotionRenderer blocks={post.content as never[]} />
          </div>
        )}
      </article>
    </div>
  );
}
