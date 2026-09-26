import { els, screens } from "./dom.js";
import { renderInterests } from "./interests-screen.js";
import { renderSavedList } from "./saved-screen.js";

function updateNav(activeName) {
  els.navItems.forEach((item) => {
    const isActive = item.getAttribute("data-nav") === activeName;
    item.classList.toggle("is-active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

export function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    const active = key === name;
    el.classList.toggle("screen--active", active);
    el.hidden = !active;
  });
  updateNav(name === "landing" ? null : name);
  if (name === "saved") renderSavedList();
  if (name === "interests") renderInterests();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
