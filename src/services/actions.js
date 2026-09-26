import { fetchArticleCategoryTitles } from "../api/wikipedia.js";
import { buildShareText } from "../domain/fact.js";
import { store } from "../state/store.js";
import { updateActionButtons } from "../ui/fact-screen.js";
import { renderInterests } from "../ui/interests-screen.js";
import { showToast } from "../ui/toast.js";
import { els } from "../ui/dom.js";

export async function shareFact(fact) {
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

export function toggleSaveCurrentFact() {
  if (!store.currentFact) return;
  const saved = store.toggleSave(store.currentFact);
  updateActionButtons();
  showToast(saved ? "Saved" : "Removed from saved");
}

export async function heartCurrentFact() {
  if (!store.currentFact) return;

  const nowHearted = store.toggleHeart(store.currentFact.id);
  updateActionButtons();

  if (!nowHearted) {
    showToast("Removed");
    return;
  }

  els.factLike.disabled = true;
  try {
    const titles = await fetchArticleCategoryTitles(store.currentFact.title);
    const addedCount = store.mergeAdditionsFromCategories(titles);
    if (addedCount) renderInterests();
    showToast(addedCount > 1 ? `Added ${addedCount} to interests` : "Added to interests");
  } catch (err) {
    console.warn(err);
    showToast("Added to interests");
  } finally {
    updateActionButtons();
  }
}
