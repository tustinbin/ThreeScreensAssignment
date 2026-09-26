import { store } from "../state/store.js";
import { els } from "./dom.js";

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

export function updateActionButtons() {
  if (!store.currentFact) {
    els.factSave.classList.remove("is-saved");
    els.factSave.setAttribute("aria-label", "Save");
    els.factSave.disabled = true;
    els.factShare.disabled = true;
    els.factLike.disabled = true;
    els.factLike.classList.remove("is-liked");
    els.factLike.setAttribute("aria-label", "Add to interests");
    return;
  }

  els.factSave.disabled = false;
  els.factShare.disabled = false;
  els.factLike.disabled = false;

  const saved = store.isSaved(store.currentFact.id);
  els.factSave.classList.toggle("is-saved", saved);
  els.factSave.setAttribute("aria-label", saved ? "Saved" : "Save");

  const hearted = store.isHearted(store.currentFact.id);
  els.factLike.classList.toggle("is-liked", hearted);
  els.factLike.setAttribute("aria-label", hearted ? "Added to interests" : "Add to interests");
}

export function setFactLoading(loading) {
  store.isLoading = loading;
  document.querySelectorAll('[data-action="learn"]').forEach((btn) => {
    btn.disabled = loading;
  });
  if (!loading) return;

  store.currentFact = null;
  updateActionButtons();
  els.factStatus.hidden = true;
  setFactImage("", "");
  els.factTitle.textContent = "Finding something worth knowing…";
  els.factSummary.textContent = "One deliberate fact—not a feed, not the news.";
  els.factHighlight.hidden = true;
  els.factHighlight.textContent = "";
  els.factSource.textContent = "";
  els.factTopicLabel.textContent = store.isInterestsMode ? "Interests" : "A fact for you";
  els.factReadMore.setAttribute("aria-disabled", "true");
  els.factReadMore.href = "#";
}

export function setFactError(message) {
  store.currentFact = null;
  updateActionButtons();
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

export function renderFact(fact, { interestsMode, matchedLabel, hasSelections }) {
  els.factStatus.hidden = true;
  els.factTitle.textContent = fact.title;
  els.factSummary.textContent =
    fact.summary || "Open the article to learn more about this topic.";

  if (fact.highlight) {
    els.factHighlight.textContent = fact.highlight;
    els.factHighlight.hidden = false;
  } else {
    els.factHighlight.textContent = "";
    els.factHighlight.hidden = true;
  }

  els.factSource.textContent = "Source: Wikipedia";
  els.factTopicLabel.textContent = interestsMode
    ? matchedLabel || (hasSelections ? "Interests" : "Interests · pick niches")
    : "A fact for you";

  setFactImage(fact.imageUrl, fact.title);
  els.factReadMore.removeAttribute("aria-disabled");
  els.factReadMore.href = fact.url;
  updateActionButtons();
}
