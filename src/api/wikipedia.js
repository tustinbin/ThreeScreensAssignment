import { ARCHIVE_START_YEAR, MONTH_NAMES } from "../config.js";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

function wikiApi(params) {
  return `https://en.wikipedia.org/w/api.php?${new URLSearchParams({
    format: "json",
    origin: "*",
    redirects: "1",
    ...params,
  })}`;
}

export async function fetchSummaryByTitle(title) {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  return fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`);
}

export async function fetchDykArchive(year, monthName) {
  const data = await fetchJson(
    wikiApi({
      action: "parse",
      page: `Wikipedia:Did_you_know_archive/${year}/${monthName}`,
      prop: "text",
    })
  );
  const html = data?.parse?.text?.["*"];
  if (!html) throw new Error("Empty archive");
  return html;
}

export async function fetchParsedPageHtml(title) {
  const data = await fetchJson(
    wikiApi({
      action: "parse",
      page: title,
      prop: "text",
    })
  );
  const html = data?.parse?.text?.["*"];
  const resolvedTitle = data?.parse?.title;
  if (!html) throw new Error("Empty page");
  return { html, title: resolvedTitle || title };
}

export async function fetchArticleCategoryTitles(title) {
  const data = await fetchJson(
    wikiApi({
      action: "query",
      prop: "categories",
      titles: title,
      cllimit: "40",
      clshow: "!hidden",
    })
  );
  const page = Object.values(data?.query?.pages || {})[0];
  return (page?.categories || []).map((item) => item.title);
}

/** Pick a random DYK archive month, optionally avoiding the previous key. */
export function pickArchiveTarget(avoidKey = null) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const options = [];

  for (let year = ARCHIVE_START_YEAR; year <= currentYear; year += 1) {
    const lastMonth = year === currentYear ? currentMonthIndex : 11;
    for (let monthIndex = 0; monthIndex <= lastMonth; monthIndex += 1) {
      const key = `${year}/${MONTH_NAMES[monthIndex]}`;
      if (key !== avoidKey) {
        options.push({ year, monthName: MONTH_NAMES[monthIndex], key });
      }
    }
  }

  return options[Math.floor(Math.random() * options.length)];
}
