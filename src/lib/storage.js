/** Tiny localStorage helpers — one read/write pattern for the whole app. */

export function loadJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadStringList(key) {
  const parsed = loadJson(key, []);
  return Array.isArray(parsed) ? parsed.map(String) : [];
}
