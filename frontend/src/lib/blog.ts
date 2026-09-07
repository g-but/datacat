import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { extractToc, parseContentBlocks, parseFrontmatter, readingTime } from 'bip-kit';
import type { ContentBlock, TocEntry } from 'bip-kit';

/**
 * The blog's content collection: markdown files in content/blog/, read from
 * disk and parsed with bip-kit.
 *
 * This replaced contentlayer, which generated a typed `.contentlayer/generated`
 * package at install/build time and compiled each post's MDX to a JS function.
 * That indirection cost this app a working blog: contentlayer 0.3.x calls a
 * React internal (`getOwner`) that React 19 removed, so the compiled body
 * crashed during prerender AND during SSR — the workaround was to render the
 * post body client-only (`next/dynamic`, `ssr: false`), which meant every
 * reader and every crawler got "Lade Inhalt…" and the article arrived only
 * after hydration. Parsing markdown into typed blocks needs no codegen, no
 * build step, and no client JS: the body is a server component again.
 *
 * Typed blocks are also the security model — markdown becomes a discriminated
 * union with no HTML or JSX passthrough, so a post cannot execute anything.
 */

export interface PostMeta {
  slug: string;
  url: string;
  title: string;
  date: string;
  summary: string;
  coverImage?: string;
  tags: string[];
}

export interface Post extends PostMeta {
  blocks: ContentBlock[];
  toc: TocEntry[];
  readingMinutes: number;
}

const CONTENT_DIR = join(process.cwd(), 'content', 'blog');

const str = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : '';

const list = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

function readPost(file: string): Post | null {
  const slug = file.replace(/\.md$/, '');
  const { meta, body } = parseFrontmatter(readFileSync(join(CONTENT_DIR, file), 'utf8'));

  // A post without a title or a date cannot be listed or sorted; failing here
  // beats rendering "Invalid Date" on the index. contentlayer enforced this
  // with `required: true` on its field schema.
  const title = str(meta.title);
  const date = str(meta.date);
  if (!title || !date) {
    throw new Error(`content/blog/${file}: frontmatter needs both \`title\` and \`date\``);
  }

  const blocks = parseContentBlocks(body);
  return {
    slug,
    url: `/blog/${slug}`,
    title,
    date,
    summary: str(meta.summary),
    coverImage: str(meta.coverImage) || undefined,
    tags: list(meta.tags),
    blocks,
    toc: extractToc(blocks),
    readingMinutes: readingTime(blocks).minutes,
  };
}

/** Every post, newest first. */
export function allPosts(): Post[] {
  let files: string[];
  try {
    files = readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md'));
  } catch {
    return [];
  }
  return files
    .map(readPost)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
}

/** One post by slug, or null. */
export function postBySlug(slug: string): Post | null {
  // Slugs arrive from the URL; only plain names may reach the filesystem.
  if (!slug || !/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    return readPost(`${slug}.md`);
  } catch (error) {
    // A malformed post must not 404 silently — that is how a broken article
    // stays broken for months. Missing file → 404; anything else → fail loud.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
