/**
 * Shared text-analysis AI chain for the backend (Groq -> OpenRouter free tier).
 *
 * WHY THIS EXISTS: llm-analysis.js and aiAnalysisService.js used to construct
 * their own `OpenAI` client, hardcode `model: 'gpt-4'`, and throw/skip outright
 * whenever OPENAI_API_KEY was unset. That is a single vendor, single model,
 * hardcoded — the moment OpenAI has a billing hiccup, an outage, or retires
 * gpt-4, every text-analysis feature in this app goes dead with no recovery
 * until someone notices and redeploys. This module gives both services a real
 * multi-vendor fallback chain via `@bitbaum/ai-kit` (from npm), the same
 * package already adopted across the fleet for exactly this failure mode.
 *
 * SCOPE: this is for plain chat-completion TEXT calls only. Vision/image
 * analysis (imageIngestionService.js, videoIngestionService.js's frame
 * analysis, frontend openaiVisionService.ts) and audio transcription
 * (Whisper) are NOT covered here — ai-kit's free chain carries no vision- or
 * audio-capable free models, so forcing those onto this chain would silently
 * degrade output quality rather than provide a real fallback. Those stay on
 * OpenAI, documented as a known limitation.
 *
 * `ai-kit` ships ESM-only; this file is CommonJS (matches the rest of
 * backend/), so it is loaded via a cached dynamic `import()` rather than
 * `require()`.
 */

let aiKitPromise = null;
function loadAIKit() {
  if (!aiKitPromise) {
    aiKitPromise = import('@bitbaum/ai-kit');
  }
  return aiKitPromise;
}

let health = null;
async function getHealthTracker() {
  if (!health) {
    const { createHealthTracker } = await loadAIKit();
    health = createHealthTracker({ downAfter: 3 });
  }
  return health;
}

/** Informational health snapshot for the /health endpoint. Never gates status. */
async function getAIHealth() {
  const tracker = await getHealthTracker();
  return tracker.getHealth();
}

/**
 * The chain's usable links. Returns [] when neither GROQ_API_KEY nor
 * OPENROUTER_API_KEY is configured.
 *
 * THE PER-VENDOR DEDUPE THAT USED TO BE HERE IS GONE, and its removal is the
 * point rather than a tidy-up. It kept one link per vendor on the reasoning
 * that "a second model at the same vendor draws on the same daily budget, so
 * it is not a real fallback". That is true of the DAILY case and only of the
 * daily case — and it threw away the retry that rescues the two failures that
 * actually happen more often: a model id the vendor retired, and a model that
 * is momentarily busy while the rest of the vendor is fine.
 *
 * `complete()` makes the distinction per FAILURE KIND instead of up front: a
 * daily 429 condemns the whole vendor (so the dedupe's real benefit is kept),
 * while a 404 or a capacity 429 demotes to that vendor's next model. Strictly
 * more chain, not less.
 */
async function getChainLinks() {
  const { freeChain, usableChain } = await loadAIKit();
  return usableChain(freeChain('DATACAT'), process.env);
}

/** True if at least one free-tier vendor key is configured. */
async function isChainConfigured() {
  const links = await getChainLinks();
  return links.length > 0;
}

/**
 * Best-effort extraction of a JSON object from a chat completion's text.
 *
 * Free-tier models are not guaranteed to honour OpenAI's `response_format:
 * json_object` the way gpt-4 does, so instead of relying on that flag we ask
 * for JSON in the prompt and parse leniently here — the same pattern already
 * used by the frontend's openaiVisionService.ts for the same reason.
 */
function parseJSONLoose(content) {
  if (!content) throw new Error('Empty response from model');
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found in model response');
    return JSON.parse(match[0]);
  }
}

/**
 * Run one chat completion down the free-tier chain, returning raw text.
 *
 * Throws `ChainExhaustedError` (from ai-kit) when no vendor is configured or
 * every configured vendor refused — callers decide whether that means "skip
 * this analysis" or "surface an error," matching how the pre-chain code
 * already handled a missing OPENAI_API_KEY per call site.
 *
 * ── What `complete()` brought that the hand-rolled `attempt` could not ──────
 * The loop below used to end at `chat failed (${res.status}): ${detail}` — the
 * response body was fetched, sliced to 200 characters, and read by nothing.
 * The three kinds of HTTP 429 share that status code and want OPPOSITE
 * responses, and only that body tells them apart:
 *
 *   capacity — a burst. Demoting to the next link is right.
 *   daily    — the vendor's whole org-wide budget is spent, so every other
 *              model there is already dead. The vendor is skipped for the rest
 *              of the walk instead of being asked once per model.
 *   size     — one request exceeded the per-minute allowance by itself. The
 *              next model down has a SMALLER ceiling, so demoting is strictly
 *              worse; the walk stops and the caller is told to send less.
 *
 * It also gives each link its own deadline. The old `fetch` had none at all,
 * so a vendor that accepted the connection and never answered held an ingestion
 * job open indefinitely — and the fallback beneath it was never reached.
 */
async function chatText({ system, prompt, temperature = 0.3, maxTokens = 2000 }) {
  const { complete } = await loadAIKit();
  const chain = await getChainLinks();
  const tracker = await getHealthTracker();

  const result = await complete({
    chain,
    health: tracker,
    temperature,
    maxTokens,
    messages: system
      ? [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ]
      : [{ role: 'user', content: prompt }],
    onLinkFailure: (link, error) => {
      console.warn(
        `AI chain link failed (${link.provider.id}/${link.model}):`,
        error instanceof Error ? error.message : error,
      );
    },
  });

  return {
    content: result.text,
    model: result.id,
    usage: result.raw?.usage,
  };
}

/** Same as `chatText`, but parses the response as JSON (leniently). */
async function chatJSON(options) {
  const result = await chatText(options);
  return {
    ...result,
    json: parseJSONLoose(result.content),
  };
}

module.exports = {
  chatText,
  chatJSON,
  isChainConfigured,
  getAIHealth,
  parseJSONLoose,
};
