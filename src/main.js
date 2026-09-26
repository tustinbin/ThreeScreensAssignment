/**
 * One Fact — bootstrap
 *
 * Layout:
 *   data/     static interest tree + curated list sources
 *   domain/   pure logic (DYK parse, list parse, matching, fact shaping)
 *   api/      Wikipedia HTTP
 *   state/    single store + persistence
 *   ui/       DOM rendering
 *   services/ orchestration (load fact, list facts, save/heart/share)
 */

import { heartCurrentFact, shareFact, toggleSaveCurrentFact } from "./services/actions.js";
import { loadFact } from "./services/load-fact.js";
import { els } from "./ui/dom.js";
import { updateActionButtons } from "./ui/fact-screen.js";
import { bindInterestsScreen, renderInterests } from "./ui/interests-screen.js";
import { setFactMode, updateModeToggle } from "./ui/mode-toggle.js";
import { showScreen } from "./ui/navigation.js";
import { store } from "./state/store.js";

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-nav");

      if (el.hasAttribute("data-action-nav") && target === "fact") {
        if (!store.hasLoadedFact) loadFact();
        else showScreen("fact");
        return;
      }

      if (target === "saved" || target === "interests" || target === "fact") {
        if (target === "fact" && !store.hasLoadedFact) {
          loadFact();
          return;
        }
        showScreen(target);
      }
    });
  });
}

function bindActions() {
  document.querySelectorAll('[data-action="learn"]').forEach((el) => {
    el.addEventListener("click", () => loadFact());
  });

  document.querySelectorAll("[data-mode]").forEach((el) => {
    el.addEventListener("click", () => {
      setFactMode(el.getAttribute("data-mode"));
    });
  });

  els.factReadMore.addEventListener("click", (event) => {
    if (els.factReadMore.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
    }
  });

  els.factSave.addEventListener("click", () => toggleSaveCurrentFact());
  els.factShare.addEventListener("click", () => shareFact(store.currentFact));
  els.factLike.addEventListener("click", () => heartCurrentFact());
}

bindNavigation();
bindActions();
bindInterestsScreen();
updateModeToggle();
renderInterests();
updateActionButtons();
showScreen("landing");
