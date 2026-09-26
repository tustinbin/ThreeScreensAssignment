import {
  CATEGORIES_PER_HEART,
  MAX_ADDITIONS,
  SEEN_LIMIT,
  STORAGE_KEYS,
} from "../config.js";
import { childIdsForParent } from "../data/interest-tree.js";
import { loadJson, loadStringList, saveJson } from "../lib/storage.js";
import {
  categoriesToAdditions,
  isDefaultInterestId,
  resolveSelectedInterests,
} from "../domain/interests.js";

function loadMode() {
  const raw = localStorage.getItem(STORAGE_KEYS.mode);
  if (raw === "interests" || raw === "curated") return "interests";
  return "random";
}

function loadAdditions() {
  const parsed = loadJson(STORAGE_KEYS.additions, []);
  return Array.isArray(parsed)
    ? parsed.filter((item) => item && item.id && item.label)
    : [];
}

function loadSaved() {
  const parsed = loadJson(STORAGE_KEYS.saved, []);
  return Array.isArray(parsed) ? parsed : [];
}

/** Single mutable app state + persistence. UI and services talk only through this. */
export const store = {
  mode: loadMode(),
  selectedIds: loadStringList(STORAGE_KEYS.niches),
  additions: loadAdditions(),
  seenIds: loadStringList(STORAGE_KEYS.seen),
  saved: loadSaved(),
  heartedIds: loadStringList(STORAGE_KEYS.hearted),
  currentFact: null,
  isLoading: false,
  hasLoadedFact: false,
  /** Parent category ids currently expanded on the Interests screen. */
  expandedParentIds: new Set(),
  expandedSeeded: false,

  get isInterestsMode() {
    return this.mode === "interests";
  },

  get selectedInterests() {
    return resolveSelectedInterests(this.selectedIds, this.additions);
  },

  setMode(mode) {
    this.mode = mode === "interests" || mode === "curated" ? "interests" : "random";
    localStorage.setItem(STORAGE_KEYS.mode, this.mode);
    return this.mode;
  },

  persistNiches() {
    saveJson(STORAGE_KEYS.niches, this.selectedIds);
  },

  toggleNiche(id) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter((item) => item !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
      this.setMode("interests");
    }
    this.persistNiches();
    return this.selectedIds;
  },

  /** Select or clear every child niche under a parent category. */
  setGroupSelection(parentId, selectAll) {
    const childIds = childIdsForParent(parentId);
    if (!childIds.length) return;

    if (selectAll) {
      const merged = new Set([...this.selectedIds, ...childIds]);
      this.selectedIds = [...merged];
      this.setMode("interests");
    } else {
      const drop = new Set(childIds);
      this.selectedIds = this.selectedIds.filter((id) => !drop.has(id));
    }
    this.persistNiches();
  },

  clearAllNiches() {
    this.selectedIds = [];
    this.persistNiches();
  },

  toggleParentExpanded(parentId) {
    if (this.expandedParentIds.has(parentId)) {
      this.expandedParentIds.delete(parentId);
    } else {
      this.expandedParentIds.add(parentId);
    }
  },

  removeAddition(id) {
    this.additions = this.additions.filter((item) => item.id !== id);
    this.selectedIds = this.selectedIds.filter((item) => item !== id);
    saveJson(STORAGE_KEYS.additions, this.additions);
    this.persistNiches();
  },

  /** Merge Wikipedia-derived niches into Your additions. Returns how many were new. */
  mergeAdditionsFromCategories(categoryTitles) {
    const candidates = categoriesToAdditions(categoryTitles).slice(0, CATEGORIES_PER_HEART);
    let addedCount = 0;
    candidates.forEach((interest) => {
      if (this.additions.some((item) => item.id === interest.id)) return;
      if (isDefaultInterestId(interest.id)) return;
      this.additions = [interest, ...this.additions].slice(0, MAX_ADDITIONS);
      addedCount += 1;
    });
    if (addedCount) saveJson(STORAGE_KEYS.additions, this.additions);
    return addedCount;
  },

  markSeen(id) {
    if (this.seenIds.includes(id)) return;
    this.seenIds.push(id);
    if (this.seenIds.length > SEEN_LIMIT) {
      this.seenIds = this.seenIds.slice(this.seenIds.length - SEEN_LIMIT);
    }
    saveJson(STORAGE_KEYS.seen, this.seenIds);
  },

  isSaved(id) {
    return this.saved.some((fact) => fact.id === id);
  },

  isHearted(id) {
    return this.heartedIds.includes(id);
  },

  toggleSave(fact) {
    if (!fact) return false;
    if (this.isSaved(fact.id)) {
      this.saved = this.saved.filter((item) => item.id !== fact.id);
      saveJson(STORAGE_KEYS.saved, this.saved);
      return false;
    }
    this.saved = [
      {
        id: fact.id,
        title: fact.title,
        summary: fact.summary,
        highlight: fact.highlight,
        imageUrl: fact.imageUrl,
        url: fact.url,
        savedAt: Date.now(),
      },
      ...this.saved,
    ];
    saveJson(STORAGE_KEYS.saved, this.saved);
    return true;
  },

  removeSaved(id) {
    this.saved = this.saved.filter((fact) => fact.id !== id);
    saveJson(STORAGE_KEYS.saved, this.saved);
  },

  toggleHeart(factId) {
    if (this.isHearted(factId)) {
      this.heartedIds = this.heartedIds.filter((id) => id !== factId);
      saveJson(STORAGE_KEYS.hearted, this.heartedIds);
      return false;
    }
    this.heartedIds = [...this.heartedIds, factId];
    saveJson(STORAGE_KEYS.hearted, this.heartedIds);
    return true;
  },
};
