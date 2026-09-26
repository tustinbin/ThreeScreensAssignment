import { store } from "../state/store.js";
import { els } from "./dom.js";
import { showToast } from "./toast.js";

export function updateModeToggle() {
  els.modeRandom.classList.toggle("is-active", store.mode === "random");
  els.modeInterests.classList.toggle("is-active", store.mode === "interests");
}

export function setFactMode(mode, { silent = false } = {}) {
  store.setMode(mode);
  updateModeToggle();
  if (!silent) {
    showToast(store.isInterestsMode ? "Interests mode" : "Random mode");
  }
}
