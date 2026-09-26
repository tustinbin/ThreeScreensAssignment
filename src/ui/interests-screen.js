import { INTEREST_TREE } from "../data/interest-tree.js";
import { parentSelectionState } from "../domain/interests.js";
import { store } from "../state/store.js";
import { els } from "./dom.js";
import { updateModeToggle } from "./mode-toggle.js";
import { showToast } from "./toast.js";

function refreshAfterSelection() {
  updateModeToggle();
  renderInterests();
}

function onToggleNiche(id) {
  store.toggleNiche(id);
  refreshAfterSelection();
}

function onToggleGroup(parentId) {
  const { allSelected } = parentSelectionState(parentId, store.selectedIds);
  store.setGroupSelection(parentId, !allSelected);
  if (!allSelected) store.expandedParentIds.add(parentId);
  refreshAfterSelection();
}

function onRemoveAddition(id) {
  store.removeAddition(id);
  renderInterests();
  showToast("Removed from additions");
}

function createChip(label, { selected = false, onClick }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "topic" + (selected ? " topic--selected" : "");
  btn.textContent = label;
  btn.setAttribute("aria-pressed", selected ? "true" : "false");
  btn.addEventListener("click", onClick);
  return btn;
}

/** Chip + ×. Chip click and × can differ (select vs delete). */
function createRemovableChip(label, { selected = false, onChipClick, onRemove, removeLabel }) {
  const wrap = document.createElement("div");
  wrap.className = "topic-wrap";

  wrap.appendChild(
    createChip(label, {
      selected,
      onClick: onChipClick,
    })
  );

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "topic-remove";
  remove.setAttribute("aria-label", removeLabel || `Remove ${label}`);
  remove.textContent = "×";
  remove.addEventListener("click", (event) => {
    event.stopPropagation();
    onRemove();
  });

  wrap.appendChild(remove);
  return wrap;
}

function renderSelected() {
  const selected = store.selectedInterests;
  els.selectedSection.hidden = selected.length === 0;
  els.selectedGrid.innerHTML = "";

  selected.forEach((item) => {
    els.selectedGrid.appendChild(
      createRemovableChip(item.label, {
        selected: true,
        onChipClick: () => onToggleNiche(item.id),
        onRemove: () => onToggleNiche(item.id),
        removeLabel: `Deselect ${item.label}`,
      })
    );
  });
}

function renderAdditions() {
  els.additionsGrid.innerHTML = "";
  const hasAdditions = store.additions.length > 0;
  els.additionsEmpty.hidden = hasAdditions;

  store.additions.forEach((item) => {
    els.additionsGrid.appendChild(
      createRemovableChip(item.label, {
        selected: store.selectedIds.includes(item.id),
        onChipClick: () => onToggleNiche(item.id),
        onRemove: () => onRemoveAddition(item.id),
        removeLabel: `Delete ${item.label} from additions`,
      })
    );
  });
}

function seedExpandedFromSelections() {
  if (store.expandedSeeded) return;
  INTEREST_TREE.forEach((parent) => {
    const { selectedCount } = parentSelectionState(parent.id, store.selectedIds);
    if (selectedCount > 0) store.expandedParentIds.add(parent.id);
  });
  store.expandedSeeded = true;
}

function renderGroup(parent) {
  const state = parentSelectionState(parent.id, store.selectedIds);
  const expanded = store.expandedParentIds.has(parent.id);

  const group = document.createElement("section");
  group.className = "niche-group" + (expanded ? " is-open" : "");

  const header = document.createElement("div");
  header.className = "niche-group__header";

  const expandBtn = document.createElement("button");
  expandBtn.type = "button";
  expandBtn.className = "niche-group__expand";
  expandBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
  expandBtn.innerHTML = `<span class="niche-group__chevron" aria-hidden="true"></span><span class="niche-group__label">${parent.label}</span>`;
  if (state.selectedCount) {
    expandBtn.innerHTML += `<span class="niche-group__count">${state.selectedCount}</span>`;
  }
  expandBtn.addEventListener("click", () => {
    store.toggleParentExpanded(parent.id);
    renderInterests();
  });

  const groupBtn = document.createElement("button");
  groupBtn.type = "button";
  groupBtn.className =
    "niche-group__all" + (state.allSelected ? " is-active" : "");
  groupBtn.textContent = state.allSelected ? "Clear" : "Select all";
  groupBtn.setAttribute(
    "aria-label",
    state.allSelected
      ? `Clear all ${parent.label} niches`
      : `Select all ${parent.label} niches`
  );
  groupBtn.addEventListener("click", () => onToggleGroup(parent.id));

  header.append(expandBtn, groupBtn);
  group.appendChild(header);

  if (expanded) {
    const body = document.createElement("div");
    body.className = "niche-group__body topic-grid";
    parent.children.forEach((child) => {
      body.appendChild(
        createChip(child.label, {
          selected: store.selectedIds.includes(child.id),
          onClick: () => onToggleNiche(child.id),
        })
      );
    });
    group.appendChild(body);
  }

  return group;
}

export function renderInterests() {
  seedExpandedFromSelections();

  const count = store.selectedInterests.length;

  els.interestsSupport.textContent = store.isInterestsMode
    ? count
      ? `Interests mode · filtering by ${count} niche${count === 1 ? "" : "s"}.`
      : "Interests mode · select niches below to filter facts."
    : "Tap Select all on a category, or open it to pick niches. Heart a fact to add more.";

  els.clearAllNiches.hidden = count === 0;

  renderSelected();
  renderAdditions();
  els.nicheGroups.innerHTML = "";
  INTEREST_TREE.forEach((parent) => {
    els.nicheGroups.appendChild(renderGroup(parent));
  });
}

export function bindInterestsScreen() {
  els.clearAllNiches.addEventListener("click", () => {
    store.clearAllNiches();
    refreshAfterSelection();
    showToast("Cleared selections");
  });
}
