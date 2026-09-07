/**
 * Route params are asynchronous in Next 15+.
 *
 * In a **development** server, `ctx.params` is a proxy that still answers
 * synchronous property reads (with a console warning). In a **production**
 * build it is a plain `Promise` with no own properties, so `ctx.params.id`
 * silently evaluates to `undefined`. Verified against a local production build
 * of this app: `/api/paramcheck/hello-123` returned
 * `{"sync":null,"awaited":"hello-123"}`.
 *
 * That asymmetry is why four route handlers shipped with `ctx.params as {...}`
 * and nobody noticed: everything works locally, and in production the id
 * reaches Prisma as `undefined` — which Prisma reads as "no filter", so
 * `findFirst({ where: { id: undefined, isPublished: true } })` returns an
 * arbitrary published form belonging to anyone.
 *
 * Reading a route param through this helper is the only supported way in this
 * codebase; `no-restricted-syntax` in eslint.config.mjs rejects the sync form.
 */
export type RouteContext<K extends string> = { params: Promise<Record<K, string>> };

/**
 * Resolve one route param, or `null` when it is missing or empty. Callers must
 * handle `null` — an absent id must never reach a query as `undefined`.
 */
export async function getRouteParam<K extends string>(
  ctx: RouteContext<K>,
  key: K,
): Promise<string | null> {
  const params = await ctx.params;
  const value = params?.[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}
