import { decodeHtmlEntities, normalizeWhitespace } from "../lib/util.js";

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

/** Parse DYK archive HTML into { id, hookText, articleTitle } hooks. */
export function parseDykHooks(html) {
  const hooks = [];
  const itemPattern = /<li>\s*((?:\.\.\.|…)\s*that[\s\S]*?)<\/li>/gi;
  let match;

  while ((match = itemPattern.exec(html)) !== null) {
    const itemHtml = match[1];
    const boldLink = itemHtml.match(
      /<b>\s*(?:<[^>]+>\s*)*<a[^>]+href="\/wiki\/([^"#?]+)"[^>]*>/i
    );
    const anyLink = itemHtml.match(/href="\/wiki\/([^"#?]+)"/i);
    const rawTitle = boldLink?.[1] || anyLink?.[1];
    if (!rawTitle) continue;

    const articleTitle = wikiTitleFromHref(rawTitle);
    if (isSkippableWikiTitle(articleTitle)) continue;

    let hookText = itemHtml.replace(/<[^>]+>/g, " ");
    hookText = decodeHtmlEntities(hookText);
    hookText = normalizeWhitespace(hookText);
    hookText = hookText.replace(/^\.{3}\s*/u, "… ");
    hookText = hookText.replace(/\(pictured\)/gi, "");
    hookText = normalizeWhitespace(hookText).replace(/\s+([,.!?;:])/g, "$1");
    if (hookText.length < 24) continue;

    hooks.push({
      id: `${articleTitle}::${hookText}`.toLowerCase(),
      hookText,
      articleTitle,
    });
  }

  return hooks;
}
