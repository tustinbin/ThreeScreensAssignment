const TOPICS = [
  {
    id: "history",
    label: "History",
    keywords: ["history", "historical", "war", "empire", "century", "medieval", "dynasty", "revolution"],
  },
  {
    id: "ancient",
    label: "Ancient world",
    keywords: ["ancient", "roman", "greek", "egypt", "mesopotamia", "prehistoric", "bronze age", "antiquity"],
  },
  {
    id: "biography",
    label: "People",
    keywords: ["born", "actor", "scientist", "writer", "politician", "explorer", "artist", "musician", "leader"],
  },
  {
    id: "places",
    label: "Places",
    keywords: ["city", "island", "mountain", "river", "park", "country", "town", "region", "temple", "building"],
  },
  {
    id: "science",
    label: "Science",
    keywords: ["science", "scientist", "physics", "chemistry", "biology", "astronomy", "algorithm", "discovered", "experiment"],
  },
  {
    id: "art",
    label: "Art & culture",
    keywords: ["art", "painting", "music", "film", "theatre", "culture", "museum", "novel", "poem", "dance"],
  },
  {
    id: "ideas",
    label: "Ideas",
    keywords: ["philosophy", "theory", "idea", "law", "rights", "political", "religion", "belief"],
  },
  {
    id: "exploration",
    label: "Exploration",
    keywords: ["exploration", "explorer", "voyage", "expedition", "discovered", "navigator", "map", "arctic", "ocean"],
  },
  {
    id: "literature",
    label: "Literature",
    keywords: ["literature", "novel", "poem", "poet", "author", "book", "writer", "playwright"],
  },
  {
    id: "events",
    label: "Events",
    keywords: ["battle", "treaty", "election", "disaster", "ceremony", "festival", "massacre", "independence"],
  },
];

const STORAGE_KEY = "onefact-topics";
const SEEN_KEY = "onefact-seen-hooks";
const SAVED_KEY = "onefact-saved-facts";
const SEEN_LIMIT = 400;
const ARCHIVE_START_YEAR = 2015;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const screens = {
  landing: document.getElementById("screen-landing"),
  fact: document.getElementById("screen-fact"),
  saved: document.getElementById("screen-saved"),
  interests: document.getElementById("screen-interests"),
};

const els = {
  topicGrid: document.getElementById("topic-grid"),
  factTitle: document.getElementById("fact-title"),
  factSummary: document.getElementById("fact-summary"),
  factHighlight: document.getElementById("fact-highlight"),
  factSource: document.getElementById("fact-source"),
  factStatus: document.getElementById("fact-status"),
  factReadMore: document.getElementById("fact-read-more"),
  factTopicLabel: document.getElementById("fact-topic-label"),
  factMedia: document.getElementById("fact-media"),
  factImage: document.getElementById("fact-image"),
  factSave: document.getElementById("fact-save"),
  factShare: document.getElementById("fact-share"),
  savedList: document.getElementById("saved-list"),
  savedSupport: document.getElementById("saved-support"),
  navItems: document.querySelectorAll(".nav-item"),
};

let selectedTopicIds = loadTopics();
let seenHookIds = loadSeenHooks();
let savedFacts = loadSavedFacts();
let currentFact = null;
let isLoadingFact = false;
let hasLoadedFact = false;
let toastTimer = null;

function loadTopics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => TOPICS.some((t) => t.id === id)) : [];
  } catch {
    return [];
  }
}

function saveTopics() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedTopicIds));
}

function loadSeenHooks() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function saveSeenHooks() {
  if (seenHookIds.length > SEEN_LIMIT) {
    seenHookIds = seenHookIds.slice(seenHookIds.length - SEEN_LIMIT);
  }
  localStorage.setItem(SEEN_KEY, JSON.stringify(seenHookIds));
}

function markHookSeen(id) {
  if (!seenHookIds.includes(id)) {
    seenHookIds.push(id);
    saveSeenHooks();
  }
}

function loadSavedFacts() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSavedFacts() {
  localStorage.setItem(SAVED_KEY, JSON.stringify(savedFacts));
}

function isFactSaved(id) {
  return savedFacts.some((fact) => fact.id === id);
}

function updateNav(activeName) {
  els.navItems.forEach((item) => {
    const isActive = item.getAttribute("data-nav") === activeName;
    item.classList.toggle("is-active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    const active = key === name;
    el.classList.toggle("screen--active", active);
    el.hidden = !active;
  });
  // Landing is first-load only — no nav highlight there
  updateNav(name === "landing" ? null : name);
  if (name === "saved") renderSavedList();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function renderTopics() {
  els.topicGrid.innerHTML = "";
  TOPICS.forEach((topic) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "topic" + (selectedTopicIds.includes(topic.id) ? " topic--selected" : "");
    btn.textContent = topic.label;
    btn.setAttribute("aria-pressed", selectedTopicIds.includes(topic.id) ? "true" : "false");
    btn.addEventListener("click", () => {
      if (selectedTopicIds.includes(topic.id)) {
        selectedTopicIds = selectedTopicIds.filter((id) => id !== topic.id);
      } else {
        selectedTopicIds = [...selectedTopicIds, topic.id];
      }
      saveTopics();
      renderTopics();
    });
    els.topicGrid.appendChild(btn);
  });
}

function setFactImage(imageUrl, altText) {
  if (!imageUrl) {
    els.factMedia.hidden = true;
    els.factMedia.classList.remove("has-image");
    els.factMedia.setAttribute("aria-hidden", "true");
    els.factImage.hidden = true;
    els.factImage.removeAttribute("src");
    els.factImage.alt = "";
    return;
  }
  els.factMedia.hidden = false;
  els.factMedia.classList.add("has-image");
  els.factMedia.setAttribute("aria-hidden", "false");
  els.factImage.hidden = false;
  els.factImage.src = imageUrl;
  els.factImage.alt = altText || "";
}

function updateSaveButton() {
  if (!currentFact) {
    els.factSave.classList.remove("is-saved");
    els.factSave.setAttribute("aria-label", "Save");
    els.factSave.disabled = true;
    els.factShare.disabled = true;
    return;
  }
  els.factSave.disabled = false;
  els.factShare.disabled = false;
  const saved = isFactSaved(currentFact.id);
  els.factSave.classList.toggle("is-saved", saved);
  els.factSave.setAttribute("aria-label", saved ? "Saved" : "Save");
}

function setFactLoading(loading) {
  isLoadingFact = loading;
  document.querySelectorAll('[data-action="learn"]').forEach((btn) => {
    btn.disabled = loading;
  });
  if (loading) {
    currentFact = null;
    updateSaveButton();
    els.factStatus.hidden = true;
    setFactImage("", "");
    els.factTitle.textContent = "Finding something worth knowing…";
    els.factSummary.textContent = "One deliberate fact—not a feed, not the news.";
    els.factHighlight.hidden = true;
    els.factHighlight.textContent = "";
    els.factSource.textContent = "";
    els.factTopicLabel.textContent = "A fact for you";
    els.factReadMore.setAttribute("aria-disabled", "true");
    els.factReadMore.href = "#";
  }
}

function setFactError(message) {
  currentFact = null;
  updateSaveButton();
  els.factStatus.hidden = false;
  els.factStatus.textContent = message;
  setFactImage("", "");
  els.factTitle.textContent = "Couldn’t load a fact right now";
  els.factSummary.textContent =
    "Try again in a moment. Still one clear idea—not a pile of headlines.";
  els.factHighlight.hidden = true;
  els.factHighlight.textContent = "";
  els.factSource.textContent = "";
  els.factReadMore.setAttribute("aria-disabled", "true");
  els.factReadMore.href = "#";
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

async function fetchSummaryByTitle(title) {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  return fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`);
}

function pickArchiveTarget(avoidKey) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const options = [];

  for (let year = ARCHIVE_START_YEAR; year <= currentYear; year += 1) {
    const lastMonth = year === currentYear ? currentMonthIndex : 11;
    for (let monthIndex = 0; monthIndex <= lastMonth; monthIndex += 1) {
      const key = `${year}/${MONTH_NAMES[monthIndex]}`;
      if (key !== avoidKey) options.push({ year, monthName: MONTH_NAMES[monthIndex], key });
    }
  }

  return options[Math.floor(Math.random() * options.length)];
}

async function fetchDykArchive(year, monthName) {
  const page = `Wikipedia:Did_you_know_archive/${year}/${monthName}`;
  const url =
    "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
      action: "parse",
      page,
      prop: "text",
      format: "json",
      origin: "*",
      redirects: "1",
    });
  const data = await fetchJson(url);
  const html = data?.parse?.text?.["*"];
  if (!html) throw new Error("Empty archive");
  return html;
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

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

function rephraseHookToStatement(hookText) {
  let text = (hookText || "").trim();
  text = text.replace(/^(?:\.\.\.|…)\s*/u, "");
  text = text.replace(/^that\s+/i, "");
  text = text.replace(/\?\s*$/u, "");
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/\s+([,.!?;:])/g, "$1");
  if (!text) return hookText;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/[.!?]$/.test(text)) text += ".";
  return text;
}

function formatSummaryContext(extract) {
  const clean = (extract || "").replace(/\s+/g, " ").trim();
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

function normalizeForCompare(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function significantTokens(text) {
  const stop = new Set([
    "the",
    "and",
    "that",
    "with",
    "from",
    "this",
    "were",
    "was",
    "are",
    "for",
    "his",
    "her",
    "she",
    "who",
    "has",
    "had",
    "been",
    "into",
    "over",
    "after",
    "before",
    "their",
    "they",
    "than",
    "also",
    "which",
    "when",
    "where",
    "while",
    "about",
    "have",
    "one",
  ]);
  return normalizeForCompare(text)
    .split(" ")
    .filter((word) => word.length > 2 && !stop.has(word));
}

/** Keep summary; hide highlight when it mostly repeats the summary. */
function isHighlightRedundant(summary, highlight) {
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

function parseDykHooks(html) {
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
    hookText = hookText.replace(/\s+/g, " ").trim();
    hookText = hookText.replace(/^\.{3}\s*/u, "… ");
    hookText = hookText.replace(/\(pictured\)/gi, "").replace(/\s+/g, " ").trim();
    hookText = hookText.replace(/\s+([,.!?;:])/g, "$1");

    if (hookText.length < 24) continue;

    const id = `${articleTitle}::${hookText}`.toLowerCase();
    hooks.push({ id, hookText, articleTitle });
  }

  return hooks;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSelectedTopics() {
  return TOPICS.filter((topic) => selectedTopicIds.includes(topic.id));
}

function hookMatchesTopic(hook, topic) {
  const haystack = `${hook.articleTitle} ${hook.hookText}`.toLowerCase();
  return topic.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function chooseHook(hooks) {
  const unused = hooks.filter((hook) => !seenHookIds.includes(hook.id));
  const pool = unused.length ? unused : hooks;
  if (!pool.length) return { hook: null, matchedTopic: null };

  const selected = getSelectedTopics();
  if (selected.length) {
    const preferred = pool.filter((hook) =>
      selected.some((topic) => hookMatchesTopic(hook, topic))
    );
    if (preferred.length) {
      const hook = preferred[Math.floor(Math.random() * preferred.length)];
      const matchedTopic =
        selected.find((topic) => hookMatchesTopic(hook, topic)) || selected[0];
      return { hook, matchedTopic };
    }
  }

  return {
    hook: pool[Math.floor(Math.random() * pool.length)],
    matchedTopic: null,
  };
}

function buildShareText(fact) {
  const parts = [fact.title];
  if (fact.summary) parts.push("", fact.summary);
  if (fact.highlight) parts.push("", fact.highlight);
  if (fact.url) parts.push("", fact.url);
  return parts.join("\n");
}

async function shareFact(fact) {
  if (!fact) return;
  const text = buildShareText(fact);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
      return;
    }
  } catch (err) {
    console.warn(err);
  }
  // Fallback
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand("copy");
    showToast("Copied to clipboard");
  } catch {
    showToast("Couldn’t copy");
  }
  area.remove();
}

function toggleSaveCurrentFact() {
  if (!currentFact) return;
  if (isFactSaved(currentFact.id)) {
    savedFacts = savedFacts.filter((fact) => fact.id !== currentFact.id);
    persistSavedFacts();
    updateSaveButton();
    showToast("Removed from saved");
    return;
  }
  savedFacts = [
    {
      id: currentFact.id,
      title: currentFact.title,
      summary: currentFact.summary,
      highlight: currentFact.highlight,
      imageUrl: currentFact.imageUrl,
      url: currentFact.url,
      savedAt: Date.now(),
    },
    ...savedFacts,
  ];
  persistSavedFacts();
  updateSaveButton();
  showToast("Saved");
}

function removeSavedFact(id) {
  savedFacts = savedFacts.filter((fact) => fact.id !== id);
  persistSavedFacts();
  renderSavedList();
  updateSaveButton();
  showToast("Removed from saved");
}

function renderSavedList() {
  els.savedList.innerHTML = "";
  if (!savedFacts.length) {
    els.savedSupport.textContent = "Facts you keep for later.";
    const empty = document.createElement("p");
    empty.className = "saved-empty";
    empty.textContent = "Nothing saved yet. Save a fact from Learn to see it here.";
    els.savedList.appendChild(empty);
    return;
  }

  els.savedSupport.textContent = `${savedFacts.length} saved`;

  savedFacts.forEach((fact) => {
    const card = document.createElement("article");
    card.className = "saved-card";

    const media = document.createElement("div");
    media.className = "saved-card__media";
    if (fact.imageUrl) {
      const img = document.createElement("img");
      img.src = fact.imageUrl;
      img.alt = fact.title;
      media.appendChild(img);
      card.appendChild(media);
    }

    const title = document.createElement("h3");
    title.className = "saved-card__title";
    title.textContent = fact.title;
    card.appendChild(title);

    if (fact.summary) {
      const summary = document.createElement("p");
      summary.className = "saved-card__summary";
      summary.textContent = fact.summary;
      card.appendChild(summary);
    }

    if (fact.highlight) {
      const highlight = document.createElement("p");
      highlight.className = "saved-card__highlight";
      highlight.textContent = fact.highlight;
      card.appendChild(highlight);
    }

    const actions = document.createElement("div");
    actions.className = "saved-card__actions";

    const shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.className = "btn btn--ghost";
    shareBtn.textContent = "Share";
    shareBtn.addEventListener("click", () => shareFact(fact));

    const openBtn = document.createElement("a");
    openBtn.className = "btn btn--secondary";
    openBtn.href = fact.url || "#";
    openBtn.target = "_blank";
    openBtn.rel = "noopener noreferrer";
    openBtn.textContent = "Read more";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn--ghost";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeSavedFact(fact.id));

    actions.append(shareBtn, openBtn, removeBtn);
    card.appendChild(actions);
    els.savedList.appendChild(card);
  });
}

async function loadFact() {
  if (isLoadingFact) return;
  showScreen("fact");
  setFactLoading(true);

  try {
    let chosen = null;
    let matchedTopic = null;
    let lastError = null;
    let avoidKey = null;

    for (let attempt = 0; attempt < 6 && !chosen; attempt += 1) {
      const target = pickArchiveTarget(avoidKey);
      avoidKey = target.key;
      try {
        const html = await fetchDykArchive(target.year, target.monthName);
        const hooks = shuffle(parseDykHooks(html));
        const result = chooseHook(hooks);
        if (result.hook) {
          chosen = result.hook;
          matchedTopic = result.matchedTopic;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!chosen) {
      throw lastError || new Error("No usable DYK hook");
    }

    let summary = null;
    try {
      summary = await fetchSummaryByTitle(chosen.articleTitle);
    } catch (err) {
      console.warn("Summary fetch failed", err);
    }

    const displayTitle = summary?.title || chosen.articleTitle;
    const statement = rephraseHookToStatement(chosen.hookText);
    const summaryText = formatSummaryContext(summary?.extract || "");
    const showHighlight = Boolean(statement) && !isHighlightRedundant(summaryText, statement);
    const imageUrl = summary?.thumbnail?.source || summary?.originalimage?.source || "";
    const pageUrl =
      summary?.content_urls?.desktop?.page ||
      summary?.content_urls?.mobile?.page ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(chosen.articleTitle.replace(/ /g, "_"))}`;

    els.factStatus.hidden = true;
    els.factTitle.textContent = displayTitle;
    els.factSummary.textContent =
      summaryText || "Open the article to learn more about this topic.";
    if (showHighlight) {
      els.factHighlight.textContent = statement;
      els.factHighlight.hidden = false;
    } else {
      els.factHighlight.textContent = "";
      els.factHighlight.hidden = true;
    }
    els.factSource.textContent = "Source: Wikipedia";
    els.factTopicLabel.textContent = matchedTopic ? matchedTopic.label : "A fact for you";
    setFactImage(imageUrl, displayTitle);

    els.factReadMore.removeAttribute("aria-disabled");
    els.factReadMore.href = pageUrl;

    currentFact = {
      id: chosen.id,
      title: displayTitle,
      summary: summaryText,
      highlight: showHighlight ? statement : "",
      imageUrl,
      url: pageUrl,
    };
    updateSaveButton();

    markHookSeen(chosen.id);
    hasLoadedFact = true;
  } catch (err) {
    console.error(err);
    setFactError("Wikipedia didn’t return a fact.");
  } finally {
    setFactLoading(false);
  }
}

document.querySelectorAll("[data-nav]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-nav");

    if (el.hasAttribute("data-action-nav") && target === "fact") {
      if (!hasLoadedFact) {
        loadFact();
      } else {
        showScreen("fact");
      }
      return;
    }

    if (target === "saved" || target === "interests" || target === "fact") {
      if (target === "fact" && !hasLoadedFact) {
        loadFact();
        return;
      }
      showScreen(target);
    }
  });
});

document.querySelectorAll('[data-action="learn"]').forEach((el) => {
  el.addEventListener("click", () => {
    loadFact();
  });
});

els.factReadMore.addEventListener("click", (event) => {
  if (els.factReadMore.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
  }
});

els.factSave.addEventListener("click", () => {
  toggleSaveCurrentFact();
});

els.factShare.addEventListener("click", () => {
  shareFact(currentFact);
});

renderTopics();
updateSaveButton();
showScreen("landing");
