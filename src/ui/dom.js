/** Central DOM refs — query once at boot. */

function requireEl(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

export const screens = {
  landing: requireEl("screen-landing"),
  fact: requireEl("screen-fact"),
  saved: requireEl("screen-saved"),
  interests: requireEl("screen-interests"),
};

export const els = {
  nicheGroups: requireEl("niche-groups"),
  selectedSection: requireEl("selected-section"),
  selectedGrid: requireEl("selected-grid"),
  additionsGrid: requireEl("additions-grid"),
  additionsEmpty: requireEl("additions-empty"),
  additionsSection: requireEl("additions-section"),
  defaultsSectionTitle: requireEl("defaults-section-title"),
  interestsTitle: requireEl("interests-title"),
  interestsSupport: requireEl("interests-support"),
  clearAllNiches: requireEl("clear-all-niches"),
  factTitle: requireEl("fact-title"),
  factSummary: requireEl("fact-summary"),
  factHighlight: requireEl("fact-highlight"),
  factSource: requireEl("fact-source"),
  factStatus: requireEl("fact-status"),
  factReadMore: requireEl("fact-read-more"),
  factTopicLabel: requireEl("fact-topic-label"),
  factMedia: requireEl("fact-media"),
  factImage: requireEl("fact-image"),
  factSave: requireEl("fact-save"),
  factLike: requireEl("fact-like"),
  factShare: requireEl("fact-share"),
  modeRandom: requireEl("mode-random"),
  modeInterests: requireEl("mode-interests"),
  savedList: requireEl("saved-list"),
  savedSupport: requireEl("saved-support"),
  navItems: document.querySelectorAll(".nav-item"),
};
