import { normalizeWhitespace } from "../lib/util.js";

const STOP_WORDS = new Set([
  "the", "and", "that", "with", "from", "this", "were", "was", "are", "for",
  "his", "her", "she", "who", "has", "had", "been", "into", "over", "after",
  "before", "their", "they", "than", "also", "which", "when", "where", "while",
  "about", "have", "one",
]);

function normalizeForCompare(text) {
  return normalizeWhitespace(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function significantTokens(text) {
  return normalizeForCompare(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function rephraseHookToStatement(hookText) {
  let text = normalizeWhitespace(hookText);
  text = text.replace(/^(?:\.\.\.|…)\s*/u, "");
  text = text.replace(/^that\s+/i, "");
  text = text.replace(/\?\s*$/u, "");
  text = normalizeWhitespace(text).replace(/\s+([,.!?;:])/g, "$1");
  if (!text) return hookText;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += ".";
  return text;
}

export function formatSummaryContext(extract) {
  const clean = normalizeWhitespace(extract);
  if (clean.length < 40) return "";
  if (clean.length <= 360) return clean;
  const clipped = clean.slice(0, 360);
  const lastStop = Math.max(
    clipped.lastIndexOf(". "),
    clipped.lastIndexOf("? "),
    clipped.lastIndexOf("! ")
  );
  if (lastStop > 120) return clipped.slice(0, lastStop + 1).trim();
  return `${clipped.trim()}…`;
}

export function isHighlightRedundant(summary, highlight) {
  if (!summary || !highlight) return true;
  const summaryNorm = normalizeForCompare(summary);
  const highlightNorm = normalizeForCompare(highlight);
  if (!highlightNorm) return true;
  if (summaryNorm.includes(highlightNorm) || highlightNorm.includes(summaryNorm)) return true;
  const summaryTokens = new Set(significantTokens(summary));
  const highlightTokens = significantTokens(highlight);
  if (!highlightTokens.length) return true;
  const overlap = highlightTokens.filter((token) => summaryTokens.has(token)).length;
  return overlap / highlightTokens.length >= 0.72;
}

/** Build the display fact model from a DYK hook + optional REST summary. */
export function buildFact(hook, summary, matchedNicheIds = []) {
  const title = summary?.title || hook.articleTitle;
  const statement = rephraseHookToStatement(hook.hookText);
  const summaryText = formatSummaryContext(summary?.extract || "");
  const showHighlight = Boolean(statement) && !isHighlightRedundant(summaryText, statement);
  const imageUrl = summary?.thumbnail?.source || summary?.originalimage?.source || "";
  const url =
    summary?.content_urls?.desktop?.page ||
    summary?.content_urls?.mobile?.page ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(hook.articleTitle.replace(/ /g, "_"))}`;

  return {
    id: hook.id,
    title,
    summary: summaryText,
    highlight: showHighlight ? statement : "",
    imageUrl,
    url,
    matchedNicheIds,
    source: "dyk",
  };
}

/** Build a fact from a curated Wikipedia list entry. */
export function buildFactFromListEntry(entry, summary, matchedNicheIds = []) {
  const title = displayTitleForListEntry(entry, summary);
  const summaryText = formatSummaryContext(entry.blurb) || entry.blurb;
  const imageUrl = summary?.thumbnail?.source || summary?.originalimage?.source || "";
  const linkedTitle = summary?.title || entry.articleTitle;
  const url =
    summary?.content_urls?.desktop?.page ||
    summary?.content_urls?.mobile?.page ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(linkedTitle.replace(/ /g, "_"))}`;

  return {
    id: entry.id,
    title,
    summary: summaryText,
    highlight: "",
    imageUrl,
    url,
    matchedNicheIds,
    source: "list",
    listTitle: entry.listTitle,
  };
}

function displayTitleForListEntry(entry, summary) {
  if (/\bincidents?\b/i.test(entry.listTitle)) {
    const place = entry.listTitle.replace(/^List of incidents at\s+/i, "").trim();
    const year = entry.blurb.match(/\b((?:19|20)\d{2})\b/);
    if (place && year) return `${place} (${year[1]})`;
    if (place) return `${place} incident`;
  }
  return summary?.title || entry.articleTitle;
}

export function buildShareText(fact) {
  const parts = [fact.title];
  if (fact.summary) parts.push("", fact.summary);
  if (fact.highlight) parts.push("", fact.highlight);
  if (fact.url) parts.push("", fact.url);
  return parts.join("\n");
}
