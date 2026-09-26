import { store } from "../state/store.js";
import { shareFact } from "../services/actions.js";
import { els } from "./dom.js";
import { updateActionButtons } from "./fact-screen.js";
import { showToast } from "./toast.js";

function removeSaved(id) {
  store.removeSaved(id);
  renderSavedList();
  updateActionButtons();
  showToast("Removed from saved");
}

export function renderSavedList() {
  els.savedList.innerHTML = "";

  if (!store.saved.length) {
    els.savedSupport.textContent = "Facts you keep for later.";
    const empty = document.createElement("p");
    empty.className = "saved-empty";
    empty.textContent = "Nothing saved yet. Save a fact from Learn to see it here.";
    els.savedList.appendChild(empty);
    return;
  }

  els.savedSupport.textContent = `${store.saved.length} saved`;

  store.saved.forEach((fact) => {
    const card = document.createElement("article");
    card.className = "saved-card";

    if (fact.imageUrl) {
      const media = document.createElement("div");
      media.className = "saved-card__media";
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
    removeBtn.addEventListener("click", () => removeSaved(fact.id));

    actions.append(shareBtn, openBtn, removeBtn);
    card.appendChild(actions);
    els.savedList.appendChild(card);
  });
}
