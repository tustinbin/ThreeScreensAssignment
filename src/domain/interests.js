import { DEFAULT_LEAVES, findDefaultLeaf, childIdsForParent } from "../data/interest-tree.js";
import { slugify } from "../lib/util.js";

export function resolveInterest(id, additions = []) {
  return findDefaultLeaf(id) || additions.find((item) => item.id === id) || null;
}

export function resolveSelectedInterests(selectedIds, additions = []) {
  return selectedIds.map((id) => resolveInterest(id, additions)).filter(Boolean);
}

/**
 * Leaf-only keywords for hook text matching.
 * Parent category keywords are intentionally NOT inherited (they caused Film bleed).
 */
export function interestKeywords(interest) {
  if (interest.keywords?.length) {
    return [...new Set(interest.keywords.map((item) => String(item).toLowerCase()))];
  }

  const label = String(interest.label || "").toLowerCase();
  const parts = label.split(/\s+/).filter((part) => part.length > 2);
  return [...new Set([label, ...parts])];
}

/** Terms used to verify an article via Wikipedia categories. */
export function categoryMatchTerms(interest) {
  const terms = [
    ...(interest.categoryHints || []),
    ...interestKeywords(interest),
    String(interest.label || ""),
  ];
  return [
    ...new Set(
      terms
        .map((item) => String(item).toLowerCase().trim())
        .filter((item) => item.length >= 4)
    ),
  ];
}

export function categoriesMatchInterest(categoryTitles, interest) {
  const terms = categoryMatchTerms(interest);
  if (!terms.length) return false;

  const cats = (categoryTitles || []).map((title) =>
    String(title)
      .replace(/^Category:/i, "")
      .toLowerCase()
  );

  return terms.some((term) =>
    cats.some((cat) => {
      if (cat.includes(term)) return true;
      if (term.includes(cat) && cat.length >= 6) return true;
      return false;
    })
  );
}

export function countSelectedInParent(parentId, selectedIds) {
  return childIdsForParent(parentId).filter((id) => selectedIds.includes(id)).length;
}

export function parentSelectionState(parentId, selectedIds) {
  const childIds = childIdsForParent(parentId);
  const selectedCount = childIds.filter((id) => selectedIds.includes(id)).length;
  return {
    childIds,
    selectedCount,
    total: childIds.length,
    allSelected: childIds.length > 0 && selectedCount === childIds.length,
    noneSelected: selectedCount === 0,
  };
}

function stripCategoryPrefix(name) {
  return String(name || "").replace(/^Category:/i, "").trim();
}

export function isUsableCategory(name) {
  const cleaned = stripCategoryPrefix(name);
  if (cleaned.length < 3 || cleaned.length > 48) return false;
  if (/^\d{4}/.test(cleaned)) return false;
  if (/^\d+(st|nd|rd|th)-century/i.test(cleaned)) return false;
  if (
    /^(Articles |Pages |All |Wikipedia |CS1 |Use |Webarchive|Redirects |Disambiguation|Living people|Births |Deaths |Establishments |People from )/i.test(
      cleaned
    )
  ) {
    return false;
  }
  if (/\b(stubs?|templates?|categories|maintenance|wikidata|infobox)\b/i.test(cleaned)) {
    return false;
  }
  if (/\bfrom .+ County\b/i.test(cleaned)) return false;
  return true;
}

function categoryQuality(name) {
  const cleaned = stripCategoryPrefix(name);
  const words = cleaned.split(/\s+/).length;
  let score = 10 - words;
  if (/women|men|male|female/i.test(cleaned)) score -= 1;
  if (/actresses|actors|singers/i.test(cleaned) && words > 3) score -= 1;
  return score;
}

export function categoryToInterest(name) {
  const label = stripCategoryPrefix(name);
  const lower = label.toLowerCase();
  const parts = lower.split(/\s+/).filter((part) => part.length > 2);
  return {
    id: slugify(label, { prefix: "add-" }),
    label,
    keywords: [lower, ...parts],
    categoryHints: [lower],
    source: "category",
  };
}

/** Turn Wikipedia category titles into addition niches, ranked by usefulness. */
export function categoriesToAdditions(categoryTitles) {
  return categoryTitles
    .filter(isUsableCategory)
    .sort((a, b) => categoryQuality(b) - categoryQuality(a))
    .map(categoryToInterest);
}

export function isDefaultInterestId(id) {
  return DEFAULT_LEAVES.some((leaf) => leaf.id === id);
}
