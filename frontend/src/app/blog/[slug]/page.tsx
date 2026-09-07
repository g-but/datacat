// created_date: 2025-07-10
// last_modified_date: 2026-09-07
// last_modified_summary: "Post body renders server-side through bip-kit; contentlayer's client-only MDX escape hatch is gone."

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ReadingProgress, Toc } from 'bip-kit/react';
import { allPosts, postBySlug } from '@/lib/blog';
import { ROUTES } from '@/lib/routes';
import { ArticleBodyServer } from '../ArticleBodyServer';
import '../blog.css';

export const generateStaticParams = async () => allPosts().map((post) => ({ slug: post.slug }));

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return { title: 'Beitrag nicht gefunden' };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = postBySlug(slug);

  if (!post) {
    return notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-12">
      <ReadingProgress />

      {post.coverImage && (
        <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
          <Image
            src={post.coverImage}
            alt="Cover"
            width={800}
            height={400}
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
        {post.title}
      </h1>
      <p className="mb-8 mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('de-CH')}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} Min. Lesezeit</span>
      </p>

      <Toc items={post.toc} title="Inhalt" />

      <ArticleBodyServer blocks={post.blocks} />

      {/* CTA */}
      <div className="mt-16 border-t border-gray-200 pt-10 text-center dark:border-gray-700">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Teste den Universal Form Builder selbst
        </h2>
        <Link
          href={ROUTES.builder}
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Zum Builder →
        </Link>
      </div>
    </article>
  );
}
