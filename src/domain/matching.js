import { pickRandom } from "../lib/util.js";
import { interestKeywords } from "./interests.js";

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Stronger = better. Phrases beat long tokens; tiny tokens are ignored. */
export function keywordStrength(keyword) {
  const k = String(keyword || "")
    .toLowerCase()
    .trim();
  if (!k) return 0;
  const words = k.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return 3;
  if (k.length >= 8) return 2;
  if (k.length >= 5) return 1;
  return 0;
}

export function keywordHits(haystack, keyword) {
  const k = String(keyword || "")
    .toLowerCase()
    .trim();
  if (!k) return false;
  if (k.includes(" ")) return haystack.includes(k);
  const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(k)}(?:[^a-z0-9]|$)`, "i");
  return re.test(haystack);
}

export function scoreInterestAgainstHook(interest, hook) {
  const haystack = `${hook.articleTitle} ${hook.hookText}`.toLowerCase();
  let best = 0;
  interestKeywords(interest).forEach((keyword) => {
    const strength = keywordStrength(keyword);
    if (strength > 0 && keywordHits(haystack, keyword)) {
      best = Math.max(best, strength);
    }
  });
  return best;
}

export function interestMatchesHook(interest, hook) {
  return scoreInterestAgainstHook(interest, hook) > 0;
}

export function matchedInterestsForHook(hook, selectedInterests) {
  return selectedInterests
    .map((interest) => ({
      interest,
      score: scoreInterestAgainstHook(interest, hook),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.interest);
}

/**
 * Rank DYK hooks that pass leaf-keyword matching for Interests mode.
 * Returns { hook, matched: [{ interest, score }], bestScore }[].
 */
export function shortlistInterestHooks(
  hooks,
  { seenIds, selectedInterests, limit = 12 }
) {
  const unused = hooks.filter((hook) => !seenIds.includes(hook.id));
  const pool = unused.length ? unused : hooks;
  if (!pool.length || !selectedInterests.length) return [];

  const scored = [];
  pool.forEach((hook) => {
    const matched = selectedInterests
      .map((interest) => ({
        interest,
        score: scoreInterestAgainstHook(interest, hook),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matched.length) {
      scored.push({
        hook,
        matched,
        bestScore: matched[0].score,
      });
    }
  });

  scored.sort((a, b) => b.bestScore - a.bestScore || Math.random() - 0.5);
  return scored.slice(0, limit);
}

/**
 * Pick a hook from a month pool.
 * Random mode: any unused hook.
 * Interests mode: keyword shortlist only (caller verifies categories).
 */
export function chooseHook(hooks, { interestsMode, seenIds, selectedInterests }) {
  const unused = hooks.filter((hook) => !seenIds.includes(hook.id));
  const pool = unused.length ? unused : hooks;
  if (!pool.length) return { hook: null, matchedLabel: null };

  if (!interestsMode || !selectedInterests.length) {
    return { hook: pickRandom(pool), matchedLabel: null };
  }

  const shortlist = shortlistInterestHooks(hooks, {
    seenIds,
    selectedInterests,
    limit: 1,
  });
  if (!shortlist.length) return { hook: null, matchedLabel: null };

  const pick = shortlist[0];
  return {
    hook: pick.hook,
    matchedLabel: pick.matched[0]?.interest.label || null,
  };
}
