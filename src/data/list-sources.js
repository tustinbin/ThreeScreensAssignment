/**
 * Curated Wikipedia list pages mapped to niche ids.
 * Prefer story-rich lists (incidents, notable animals) over indexes.
 * Titles should resolve on enwiki (redirects OK).
 */

export const LIST_SOURCES = [
  {
    id: "list-individual-cats",
    title: "List of individual cats",
    nicheIds: ["nature-animals"],
  },
  {
    id: "list-individual-dogs",
    title: "List of individual dogs",
    nicheIds: ["nature-animals"],
  },
  {
    id: "list-disneyland-incidents",
    title: "List of incidents at Disneyland Resort",
    nicheIds: ["parks-disney", "parks-incidents", "parks-rides"],
  },
  {
    id: "list-wdw-incidents",
    title: "List of incidents at Walt Disney World",
    nicheIds: ["parks-disney", "parks-incidents", "parks-rides"],
  },
  {
    id: "list-inventors-killed",
    title: "List of inventors killed by their own invention",
    nicheIds: ["invention-gadgets", "invention-engineering", "odd-crime"],
  },
  {
    id: "list-hoaxes",
    title: "List of hoaxes",
    nicheIds: ["odd-crime", "odd-customs"],
  },
];

/** Title words that usually mean an interesting story-list. */
export const INTERESTING_LIST_TITLE_RE =
  /\b(incidents?|accidents?|unusual|notable|famous|individual|hoaxes?|deaths?|misconceptions?|shipwrecks?|disasters?|inventors?)\b/i;

/** Title words that usually mean a boring index. */
export const BORING_LIST_TITLE_RE =
  /\b(discograph|episode|filmograph|roster|stations?|species of|bibliography|awards?\b.*\bleaders?|scoring leaders|death toll)\b/i;

export function listSourcesForNicheIds(nicheIds) {
  const set = new Set(nicheIds || []);
  if (!set.size) return [...LIST_SOURCES];
  return LIST_SOURCES.filter((source) =>
    source.nicheIds.some((id) => set.has(id))
  );
}

export function isInterestingListTitle(title) {
  const t = String(title || "");
  if (BORING_LIST_TITLE_RE.test(t)) return false;
  if (/\bincidents?\b/i.test(t)) return true;
  if (!/^list of /i.test(t)) return false;
  return INTERESTING_LIST_TITLE_RE.test(t);
}
