import { ArticleBody, setHighlighterLoader } from 'bip-kit/react';
import { MermaidBlock } from 'bip-kit/react/mermaid';
import type { ContentBlock } from 'bip-kit';

/**
 * The post body — bip-kit's reference renderer with datacat's wiring.
 *
 * The loader registration is load-bearing for this app's `output: standalone`
 * build: bip-kit's zero-config shiki load goes through a dynamic import that
 * bundlers and Next's file tracer cannot see, so a standalone deploy would
 * silently ship without shiki and lose highlighting, while dev looked fine.
 * The literal `() => import('shiki')` lives HERE, in our code, where the
 * bundler resolves it into the server chunk. Do not "clean up" this call.
 *
 * MermaidBlock lives on its own bip-kit subpath and reaches `mermaid` through
 * a dynamic import inside an effect, so the library is a lazy chunk the
 * browser only fetches for a post that actually contains a diagram. Wiring it
 * costs nothing at load time and means a diagram works the day someone writes
 * one, instead of silently rendering as source.
 */
setHighlighterLoader(() => import('shiki'));

export function ArticleBodyServer({ blocks }: { blocks: ContentBlock[] }) {
  return <ArticleBody blocks={blocks} components={{ mermaid: MermaidBlock }} />;
}
