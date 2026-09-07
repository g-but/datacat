import { describe, expect, it } from 'vitest';
import { allPosts, postBySlug } from './blog';

/**
 * The content collection is committed, so it is bip-kit's trust boundary and
 * the parser is deliberately strict there: a malformed chart or stats fence
 * THROWS rather than rendering nothing. Without a test, a bad fence in a new
 * post surfaces as a 500 on the live article.
 *
 * This also pins the two things contentlayer's field schema used to enforce
 * (`title` and `date` required) now that there is no schema, and the slug
 * guard that keeps a URL segment from reaching the filesystem.
 */
describe('blog content collection', () => {
  const posts = allPosts();

  it('finds the committed posts', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it.each(posts.map((post) => [post.slug, post]))('%s parses into blocks', (_slug, post) => {
    expect(post.title).toBeTruthy();
    expect(Number.isNaN(Number(new Date(post.date)))).toBe(false);
    expect(post.blocks.length).toBeGreaterThan(0);
    expect(post.readingMinutes).toBeGreaterThan(0);

    // A TOC entry that points at a duplicated id jumps to the wrong section.
    const ids = post.toc.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('sorts newest first', () => {
    const dates = posts.map((post) => Number(new Date(post.date)));
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
  });

  it('refuses slugs that are not plain names', () => {
    // These reach `postBySlug` straight from the URL segment.
    expect(postBySlug('../../../etc/passwd')).toBeNull();
    expect(postBySlug('a/b')).toBeNull();
    expect(postBySlug('')).toBeNull();
  });

  it('returns null for a post that does not exist', () => {
    expect(postBySlug('kein-solcher-beitrag')).toBeNull();
  });
});
