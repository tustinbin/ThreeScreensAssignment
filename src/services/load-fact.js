import {
  fetchArticleCategoryTitles,
  fetchDykArchive,
  fetchSummaryByTitle,
  pickArchiveTarget,
} from "../api/wikipedia.js";
import { FETCH_ATTEMPTS } from "../config.js";
import { parseDykHooks } from "../domain/dyk.js";
import { buildFact, buildFactFromListEntry } from "../domain/fact.js";
import { categoriesMatchInterest } from "../domain/interests.js";
import {
  chooseHook,
  matchedInterestsForHook,
  shortlistInterestHooks,
} from "../domain/matching.js";
import { listSourcesForNicheIds } from "../data/list-sources.js";
import { shuffle } from "../lib/util.js";
import { store } from "../state/store.js";
import {
  renderFact,
  setFactError,
  setFactLoading,
} from "../ui/fact-screen.js";
import { showScreen } from "../ui/navigation.js";
import { pickListEntry } from "./list-facts.js";

const CATEGORY_CHECK_PER_MONTH = 6;
/** When niches have curated lists, don't burn dozens of DYK months first. */
const INTERESTS_WITH_LISTS_ATTEMPTS = 8;

/**
 * Interests mode: keyword shortlist, then Wikipedia category verify.
 */
async function pickInterestHook(hooks, selectedInterests, seenIds) {
  const shortlist = shortlistInterestHooks(hooks, {
    seenIds,
    selectedInterests,
    limit: CATEGORY_CHECK_PER_MONTH,
  });
  if (!shortlist.length) return { hook: null, matchedLabel: null };

  for (const candidate of shortlist) {
    let categories = [];
    try {
      categories = await fetchArticleCategoryTitles(candidate.hook.articleTitle);
    } catch (err) {
      if (candidate.bestScore >= 3) {
        return {
          hook: candidate.hook,
          matchedLabel: candidate.matched[0]?.interest.label || null,
        };
      }
      console.warn("Category verify failed", err);
      continue;
    }

    const verified = candidate.matched.filter(({ interest }) =>
      categoriesMatchInterest(categories, interest)
    );
    if (verified.length) {
      return {
        hook: candidate.hook,
        matchedLabel: verified[0].interest.label,
      };
    }
  }

  return { hook: null, matchedLabel: null };
}

async function presentListFact(listPick, selectedInterests, interestsMode) {
  const { entry, source } = listPick;
  let summary = null;
  try {
    summary = await fetchSummaryByTitle(entry.articleTitle);
  } catch (err) {
    console.warn("List entry summary failed", err);
  }

  const matchedFromSelection = selectedInterests.filter((interest) =>
    source.nicheIds.includes(interest.id)
  );
  const matchedNicheIds = matchedFromSelection.map((item) => item.id);
  const matchedLabel =
    matchedFromSelection[0]?.label ||
    (interestsMode ? "Wikipedia list" : "From a Wikipedia list");

  const fact = buildFactFromListEntry(entry, summary, matchedNicheIds);
  store.currentFact = fact;
  store.hasLoadedFact = true;
  store.markSeen(entry.id);

  renderFact(fact, {
    interestsMode,
    matchedLabel,
    hasSelections: store.selectedIds.length > 0,
  });
}

async function presentDykFact(chosen, matchedLabel, selectedInterests, interestsMode) {
  let summary = null;
  try {
    summary = await fetchSummaryByTitle(chosen.articleTitle);
  } catch (err) {
    console.warn("Summary fetch failed", err);
  }

  const matchedNicheIds = matchedInterestsForHook(chosen, selectedInterests).map(
    (item) => item.id
  );
  const fact = buildFact(chosen, summary, matchedNicheIds);

  store.currentFact = fact;
  store.hasLoadedFact = true;
  store.markSeen(chosen.id);

  renderFact(fact, {
    interestsMode,
    matchedLabel,
    hasSelections: store.selectedIds.length > 0,
  });
}

export async function loadFact() {
  if (store.isLoading) return;
  showScreen("fact");
  setFactLoading(true);

  try {
    const interestsMode = store.isInterestsMode;
    const selectedInterests = store.selectedInterests;
    const nicheIds = selectedInterests.map((item) => item.id);

    // Interests niches with curated lists: often try lists first (DYK is sparse there)
    if (
      interestsMode &&
      listSourcesForNicheIds(nicheIds).length &&
      Math.random() < 0.55
    ) {
      const listPick = await pickListEntry({
        nicheIds,
        seenIds: store.seenIds,
      });
      if (listPick) {
        await presentListFact(listPick, selectedInterests, interestsMode);
        return;
      }
    }

    let chosen = null;
    let matchedLabel = null;
    let lastError = null;
    let avoidKey = null;

    const maxAttempts =
      interestsMode && store.selectedIds.length
        ? listSourcesForNicheIds(nicheIds).length
          ? INTERESTS_WITH_LISTS_ATTEMPTS
          : FETCH_ATTEMPTS.interests
        : FETCH_ATTEMPTS.random;

    for (let attempt = 0; attempt < maxAttempts && !chosen; attempt += 1) {
      const target = pickArchiveTarget(avoidKey);
      avoidKey = target.key;
      try {
        const html = await fetchDykArchive(target.year, target.monthName);
        const hooks = shuffle(parseDykHooks(html));

        const result =
          interestsMode && selectedInterests.length
            ? await pickInterestHook(hooks, selectedInterests, store.seenIds)
            : chooseHook(hooks, {
                interestsMode: false,
                seenIds: store.seenIds,
                selectedInterests: [],
              });

        if (result.hook) {
          chosen = result.hook;
          matchedLabel = result.matchedLabel;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (chosen) {
      await presentDykFact(
        chosen,
        interestsMode ? matchedLabel : null,
        interestsMode ? selectedInterests : [],
        interestsMode
      );
      return;
    }

    // List pages are Interests-only — Random stays pure DYK
    if (interestsMode) {
      const listPick = await pickListEntry({
        nicheIds,
        seenIds: store.seenIds,
      });
      if (listPick) {
        await presentListFact(listPick, selectedInterests, interestsMode);
        return;
      }
      if (store.selectedIds.length) {
        setFactError("No facts matched your interests. Add more niches or try Random.");
        return;
      }
    }

    throw lastError || new Error("No usable fact");
  } catch (err) {
    console.error(err);
    setFactError("Wikipedia didn’t return a fact.");
  } finally {
    setFactLoading(false);
  }
}
