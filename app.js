const TOPICS = [
  { id: "history", label: "History", query: "history" },
  { id: "ancient", label: "Ancient world", query: "ancient civilization" },
  { id: "biography", label: "People", query: "biography historical figure" },
  { id: "places", label: "Places", query: "historic place landmark" },
  { id: "science", label: "Science", query: "history of science discovery" },
  { id: "art", label: "Art & culture", query: "art history culture" },
  { id: "ideas", label: "Ideas", query: "philosophy political theory" },
  { id: "exploration", label: "Exploration", query: "exploration discovery voyage" },
  { id: "literature", label: "Literature", query: "literature author classic" },
  { id: "events", label: "Events", query: "historical event" },
];

const STORAGE_KEY = "onefact-topics";

const screens = {
  landing: document.getElementById("screen-landing"),
  fact: document.getElementById("screen-fact"),
  interests: document.getElementById("screen-interests"),
};

const els = {
  topicGrid: document.getElementById("topic-grid"),
  factTitle: document.getElementById("fact-title"),
  factBody: document.getElementById("fact-body"),
  factSource: document.getElementById("fact-source"),
  factStatus: document.getElementById("fact-status"),
  factReadMore: document.getElementById("fact-read-more"),
  factTopicLabel: document.getElementById("fact-topic-label"),
};

let selectedTopicIds = loadTopics();
let isLoadingFact = false;

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

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    const active = key === name;
    el.classList.toggle("screen--active", active);
    el.hidden = !active;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
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

function pickTopic() {
  if (!selectedTopicIds.length) return null;
  const id = selectedTopicIds[Math.floor(Math.random() * selectedTopicIds.length)];
  return TOPICS.find((t) => t.id === id) || null;
}

function setFactLoading(loading) {
  isLoadingFact = loading;
  document.querySelectorAll('[data-action="learn"]').forEach((btn) => {
    btn.disabled = loading;
  });
  if (loading) {
    els.factStatus.hidden = true;
    els.factTitle.textContent = "Finding one good fact…";
    els.factBody.textContent = "One deliberate excerpt—no feed, no scroll.";
    els.factSource.textContent = "";
    els.factReadMore.setAttribute("aria-disabled", "true");
    els.factReadMore.href = "#";
  }
}

function setFactError(message) {
  els.factStatus.hidden = false;
  els.factStatus.textContent = message;
  els.factTitle.textContent = "Couldn’t load a fact right now";
  els.factBody.textContent =
    "Check your connection and try Next fact again. The goal is still one clear idea—not a pile of headlines.";
  els.factSource.textContent = "";
  els.factReadMore.setAttribute("aria-disabled", "true");
  els.factReadMore.href = "#";
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

async function fetchRandomSummary() {
  return fetchJson("https://en.wikipedia.org/api/rest_v1/page/random/summary");
}

async function fetchSummaryByTitle(title) {
  const encoded = encodeURIComponent(title);
  return fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`);
}

async function searchTitles(query) {
  const url =
    "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      srlimit: "12",
      srnamespace: "0",
      format: "json",
      origin: "*",
    });
  const data = await fetchJson(url);
  return (data.query && data.query.search) || [];
}

function isUsableSummary(summary) {
  if (!summary || summary.type === "disambiguation") return false;
  const extract = (summary.extract || "").trim();
  return extract.length > 80;
}

async function loadFact() {
  if (isLoadingFact) return;
  showScreen("fact");
  setFactLoading(true);

  const topic = pickTopic();
  els.factTopicLabel.textContent = topic ? topic.label : "Open exploration";

  try {
    let summary = null;

    if (topic) {
      const results = await searchTitles(topic.query);
      const shuffled = [...results].sort(() => Math.random() - 0.5);
      for (const hit of shuffled) {
        try {
          const candidate = await fetchSummaryByTitle(hit.title);
          if (isUsableSummary(candidate)) {
            summary = candidate;
            break;
          }
        } catch {
          // try next search hit
        }
      }
    }

    if (!summary) {
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const candidate = await fetchRandomSummary();
        if (isUsableSummary(candidate)) {
          summary = candidate;
          break;
        }
      }
    }

    if (!summary) throw new Error("No usable article");

    const extract = summary.extract.trim();
    els.factStatus.hidden = true;
    els.factTitle.textContent = summary.title;
    els.factBody.textContent = extract;
    els.factSource.textContent = "Source: Wikipedia (one excerpt, on purpose)";
    els.factReadMore.removeAttribute("aria-disabled");
    els.factReadMore.href = summary.content_urls?.desktop?.page || summary.content_urls?.mobile?.page || "#";
  } catch (err) {
    console.error(err);
    setFactError("Wikipedia didn’t return a fact. Try again in a moment.");
  } finally {
    setFactLoading(false);
  }
}

document.querySelectorAll("[data-nav]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-nav");
    if (target === "landing" || target === "interests" || target === "fact") {
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

renderTopics();
showScreen("landing");
