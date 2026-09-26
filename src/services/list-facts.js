import { fetchParsedPageHtml } from "../api/wikipedia.js";
import { listSourcesForNicheIds } from "../data/list-sources.js";
import { parseListEntries, scoreListPage } from "../domain/list-pages.js";
import { pickRandom, shuffle } from "../lib/util.js";

/** Session cache: list title → parsed entries */
const listEntryCache = new Map();

export async function loadListEntries(listTitle) {
  if (listEntryCache.has(listTitle)) {
    return listEntryCache.get(listTitle);
  }

  try {
    const { html, title } = await fetchParsedPageHtml(listTitle);
    const entries = parseListEntries(html, title);
    const pageScore = scoreListPage(title, entries.length);
    // Drop weak parses (too few story entries)
    const usable = pageScore >= 12 && entries.length >= 5 ? entries : [];
    listEntryCache.set(listTitle, usable);
    return usable;
  } catch (err) {
    console.warn("List page fetch failed", listTitle, err);
    listEntryCache.set(listTitle, []);
    return [];
  }
}

/**
 * Pick an unused list entry for the given niche ids (or any curated list if empty).
 * @returns {{ entry, source } | null}
 */
export async function pickListEntry({ nicheIds = [], seenIds = [] } = {}) {
  const sources = shuffle(listSourcesForNicheIds(nicheIds));

  for (const source of sources) {
    const entries = await loadListEntries(source.title);
    if (!entries.length) continue;

    const unused = entries.filter((entry) => !seenIds.includes(entry.id));
    const pool = unused.length ? unused : entries;
    if (!pool.length) continue;

    // Prefer higher-scored blurbs
    pool.sort((a, b) => b.score - a.score || Math.random() - 0.5);
    const top = pool.slice(0, Math.max(5, Math.ceil(pool.length / 3)));
    return {
      entry: pickRandom(top),
      source,
    };
  }

  return null;
}
