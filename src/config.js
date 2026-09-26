/** App-wide constants. Storage keys stay stable for existing localStorage data. */

export const STORAGE_KEYS = Object.freeze({
  mode: "onefact-mode",
  niches: "onefact-niches",
  additions: "onefact-additions",
  seen: "onefact-seen-hooks",
  saved: "onefact-saved-facts",
  hearted: "onefact-liked-fact-ids",
});

export const SEEN_LIMIT = 400;
export const MAX_ADDITIONS = 40;
export const CATEGORIES_PER_HEART = 4;

export const ARCHIVE_START_YEAR = 2015;
export const MONTH_NAMES = Object.freeze([
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
]);

export const FETCH_ATTEMPTS = Object.freeze({
  random: 6,
  interests: 32,
});
