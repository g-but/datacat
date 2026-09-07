/**
 * The chain is the feature, so the chain is what gets tested.
 *
 * `chatText` used to build its own `fetch` inside `tryChain`'s `attempt`, and
 * that hand-rolled half is where the defects were. It ended a failed request at
 * `chat failed (${res.status}): ${detail.slice(0, 200)}` — the body was
 * fetched, truncated, and read by nothing — so a spent daily budget and a
 * one-second burst produced the same message and the same behaviour, and only
 * one of them can be fixed by trying again.
 *
 * Every test here therefore drives its failure through a real response body,
 * because the body is the only thing that distinguishes the three kinds of 429.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

/** A chat-completions response carrying `content`. Built PER CALL. */
function completion(content) {
  return new Response(JSON.stringify({ choices: [{ message: { content } }], usage: {} }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Real `Response` objects, never `{ ok, json }` look-alikes, and a factory
 * rather than a value: one `Response` body can be read only once, so a shared
 * instance makes link two fail with "Body has already been read" — a fake
 * failure standing in front of the real one, inside the tests that check the
 * fallback.
 */
let fetchMock;

/** Which vendor each POST went to, in order. */
function vendors() {
  return fetchMock.mock.calls.map(([url]) =>
    String(url).includes('groq') ? 'groq' : 'openrouter',
  );
}

beforeEach(() => {
  process.env.GROQ_API_KEY = 'gsk_test';
  process.env.OPENROUTER_API_KEY = 'sk-or-test';
  fetchMock = vi.fn(async () => completion('an answer'));
  vi.stubGlobal('fetch', fetchMock);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe('chatText', () => {
  it('returns the first link that answers', async () => {
    const { chatText } = await import('./aiChain.js');

    const result = await chatText({ prompt: 'hi' });

    expect(result.content).toBe('an answer');
    expect(result.model).toMatch(/^groq\//);
  });

  it('tries a SECOND model at the same vendor when the first id is retired', async () => {
    // This is what the removed per-vendor dedupe cost. It kept one link per
    // vendor on the reasoning that a second model shares the daily budget —
    // true of the DAILY case only, and it threw away the retry that rescues a
    // retired id, which is the failure that actually keeps happening.
    let call = 0;
    fetchMock.mockImplementation(async () => {
      call += 1;
      return call === 1
        ? new Response('{"error":{"code":"model_not_found"}}', { status: 404 })
        : completion('the next model answered');
    });
    const { chatText } = await import('./aiChain.js');

    const result = await chatText({ prompt: 'hi' });

    expect(result.content).toBe('the next model answered');
    expect(vendors()[0]).toBe('groq');
    expect(vendors()[1]).toBe('groq');
  });

  it('a DAILY 429 skips the rest of that vendor and crosses to the next', async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes('groq')
        ? new Response(
            JSON.stringify({
              error: { message: 'Rate limit reached for model per day. Limit 100000, used 100000.' },
            }),
            { status: 429 },
          )
        : completion('openrouter answered'),
    );
    const { chatText } = await import('./aiChain.js');

    const result = await chatText({ prompt: 'hi' });

    expect(result.content).toBe('openrouter answered');
    // Asked ONCE. Groq's other models draw on the same exhausted org-wide
    // budget, so trying them buys a dead round trip and the identical error —
    // the one thing the old dedupe was actually right about, kept.
    expect(vendors().filter((v) => v === 'groq')).toHaveLength(1);
  });

  it('a SIZE 429 stops the walk — the next model has a SMALLER ceiling', async () => {
    fetchMock.mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            error: {
              message:
                'Request too large for model with 12000 tokens per minute. Limit 12000, Requested 15000.',
            },
          }),
          { status: 429 },
        ),
    );
    const { chatText } = await import('./aiChain.js');

    await expect(chatText({ prompt: 'hi' })).rejects.toThrow();

    // Demoting cannot help; the cure is a shorter prompt. Asserting only that
    // it threw would not show this, since everything failing throws too — what
    // distinguishes "stopped" from "tried them all" is the request not made.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('an empty 200 is a failure, not an empty analysis stored as fact', async () => {
    let call = 0;
    fetchMock.mockImplementation(async () => {
      call += 1;
      return call === 1 ? completion('') : completion('a real answer');
    });
    const { chatText } = await import('./aiChain.js');

    const result = await chatText({ prompt: 'hi' });

    expect(result.content).toBe('a real answer');
  });

  it('every link failing throws, naming each one rather than only the last', async () => {
    fetchMock.mockImplementation(async () => new Response('boom', { status: 500 }));
    const { chatText } = await import('./aiChain.js');

    const error = await chatText({ prompt: 'hi' }).then(
      () => null,
      (e) => e,
    );

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/groq/);
    expect(error.message).toMatch(/openrouter/);
  });

  it('no keys configured means no request is made at all', async () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    const { chatText } = await import('./aiChain.js');

    await expect(chatText({ prompt: 'hi' })).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('parseJSONLoose', () => {
  it('reads a bare JSON object', async () => {
    const { parseJSONLoose } = await import('./aiChain.js');
    expect(parseJSONLoose('{"a":1}')).toEqual({ a: 1 });
  });

  it('digs the object out of prose, because free models wrap it', async () => {
    const { parseJSONLoose } = await import('./aiChain.js');
    expect(parseJSONLoose('Sure!\n```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it('refuses empty content rather than returning a hollow object', async () => {
    const { parseJSONLoose } = await import('./aiChain.js');
    expect(() => parseJSONLoose('')).toThrow(/Empty response/);
  });
});
