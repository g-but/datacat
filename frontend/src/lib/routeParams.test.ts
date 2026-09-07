import { describe, it, expect } from 'vitest';
import { getRouteParam } from './routeParams';

describe('getRouteParam', () => {
  it('resolves a param from the awaited params promise', async () => {
    const ctx = { params: Promise.resolve({ id: 'form-123' }) };
    expect(await getRouteParam(ctx, 'id')).toBe('form-123');
  });

  it('returns null for a missing param instead of undefined', async () => {
    // `undefined` reaching a Prisma `where` means "no filter" — the exact
    // failure this helper exists to prevent.
    const ctx = { params: Promise.resolve({} as Record<'id', string>) };
    expect(await getRouteParam(ctx, 'id')).toBeNull();
  });

  it('returns null for an empty param', async () => {
    const ctx = { params: Promise.resolve({ id: '' }) };
    expect(await getRouteParam(ctx, 'id')).toBeNull();
  });

  it('never reads the promise synchronously', async () => {
    // A production build hands the handler a bare promise with no own
    // properties. Reading `.id` off it yields undefined; awaiting works.
    const bare = Promise.resolve({ id: 'form-123' });
    expect((bare as unknown as Record<string, string>).id).toBeUndefined();
    expect(await getRouteParam({ params: bare }, 'id')).toBe('form-123');
  });
});
