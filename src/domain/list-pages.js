import { decodeHtmlEntities, normalizeWhitespace } from "../lib/util.js";
import {
  BORING_LIST_TITLE_RE,
  INTERESTING_LIST_TITLE_RE,
  isInterestingListTitle,
} from "../data/list-sources.js";

const MIN_ENTRY_CHARS = 70;
const MAX_ENTRY_CHARS = 420;

function wikiTitleFromHref(hrefTitle) {
  try {
    return decodeURIComponent(hrefTitle).replace(/_/g, " ");
  } catch {
    return hrefTitle.replace(/_/g, " ");
  }
}

function isSkippableWikiTitle(title) {
  return /^(File|Image|Wikipedia|Talk|Template|Category|Help|Portal|Special|User|Draft):/i.test(
    title
  );
}

function plainTextFromHtml(html) {
  let text = String(html || "").replace(/<[^>]+>/g, " ");
  text = decodeHtmlEntities(text);
  return normalizeWhitespace(text).replace(/\s+([,.!?;:])/g, "$1");
}

function firstSentence(text) {
  const clean = normalizeWhitespace(text);
  const match = clean.match(/^(.+?[.!?])(\s|$)/);
  if (match && match[1].length >= 40) return match[1];
  if (clean.length <= 220) return clean;
  return `${clean.slice(0, 217).trim()}…`;
}

function scoreListTitle(title) {
  const t = String(title || "");
  if (BORING_LIST_TITLE_RE.test(t)) return 0;
  let score = 1;
  if (INTERESTING_LIST_TITLE_RE.test(t)) score += 2;
  if (/\bincidents?\b/i.test(t)) score += 2;
  if (/^list of individual /i.test(t)) score += 2;
  if (/unusual|hoax|misconception/i.test(t)) score += 1;
  return score;
}

function scoreEntry(text, articleTitle) {
  let score = 0;
  if (text.length >= MIN_ENTRY_CHARS) score += 1;
  if (text.length >= 110) score += 1;
  if (/[.!?]/.test(text)) score += 1;
  const shortName = articleTitle.toLowerCase().split("(")[0].trim();
  if (shortName && text.toLowerCase().includes(shortName)) score += 1;
  if (
    /\b(was|were|became|helped|killed|died|discovered|known for|worked|arrested|rescued)\b/i.test(
      text
    )
  ) {
    score += 1;
  }
  return score;
}

function linkCandidates(itemHtml) {
  const candidates = [];
  const bold = itemHtml.match(
    /<b>\s*(?:<[^>]+>\s*)*<a[^>]+href="\/wiki\/([^"#?]+)"[^>]*>([\s\S]*?)<\/a>/i
  );
  if (bold) {
    candidates.push({
      href: bold[1],
      text: plainTextFromHtml(bold[2]),
      priority: 3,
    });
  }

  const linkPattern = /<a[^>]+href="\/wiki\/([^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkPattern.exec(itemHtml)) !== null) {
    candidates.push({
      href: match[1],
      text: plainTextFromHtml(match[2]),
      priority: 1,
    });
  }
  return candidates;
}

function pickArticleTitle(itemHtml, blurb) {
  const blurbLower = blurb.toLowerCase();
  const ranked = linkCandidates(itemHtml)
    .map((item) => {
      const title = wikiTitleFromHref(item.href);
      if (isSkippableWikiTitle(title) || /^List of /i.test(title)) return null;

      let score = item.priority;
      const label = (item.text || title).toLowerCase();
      if (label && blurbLower.startsWith(label.slice(0, Math.min(12, label.length)))) {
        score += 4;
      } else if (label && label.length >= 4 && blurbLower.includes(label)) {
        score += 1;
      }
      if (/language|script|alphabet|romanization/i.test(title)) score -= 3;
      return { title, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.title || null;
}

/**
 * Parse a Wikipedia list page HTML into story-like entries.
 * @returns {{ id, articleTitle, blurb, listTitle, score }[]}
 */
export function parseListEntries(html, listTitle) {
  if (!isInterestingListTitle(listTitle) && !/\bincidents?\b/i.test(listTitle)) {
    return [];
  }

  const entries = [];
  const seen = new Set();
  const itemPattern = /<li>([\s\S]*?)<\/li>/gi;
  let match;

  while ((match = itemPattern.exec(html)) !== null) {
    const itemHtml = match[1];
    if (/mw-empty-elt/i.test(itemHtml)) continue;
    if (/<(ul|ol|table)\b/i.test(itemHtml)) continue;
    if (/ISBN|mw-parser-output\s+cite|citation/i.test(itemHtml)) continue;

    let blurb = plainTextFromHtml(itemHtml);
    if (blurb.length < MIN_ENTRY_CHARS) continue;
    if (/^list of /i.test(blurb)) continue;
    if (/^acts of god\b/i.test(blurb)) continue;
    if (blurb.length < 90 && !/[.!?]/.test(blurb)) continue;

    const articleTitle = pickArticleTitle(itemHtml, blurb);
    if (!articleTitle) continue;

    if (blurb.length > MAX_ENTRY_CHARS) {
      const clipped = blurb.slice(0, MAX_ENTRY_CHARS);
      const stop = Math.max(
        clipped.lastIndexOf(". "),
        clipped.lastIndexOf("? "),
        clipped.lastIndexOf("! ")
      );
      blurb =
        stop > 80 ? clipped.slice(0, stop + 1).trim() : `${clipped.trim()}…`;
    }

    const score = scoreEntry(blurb, articleTitle);
    if (score < 2) continue;

    const id = `list::${listTitle}::${articleTitle}::${blurb.slice(0, 48)}`.toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);

    entries.push({
      id,
      articleTitle,
      blurb,
      highlight: firstSentence(blurb),
      listTitle,
      score,
      source: "list",
    });
  }

  return entries;
}

export function scoreListPage(listTitle, entryCount) {
  return scoreListTitle(listTitle) * 10 + Math.min(40, entryCount);
}

export { isInterestingListTitle, firstSentence };
