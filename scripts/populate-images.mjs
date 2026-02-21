import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const INDEX_PATH = path.join(DATA_DIR, "index.json");
const CONCURRENCY = 8;
const MAX_IMAGES_PER_ARTICLE = 8;
const REQUEST_TIMEOUT_MS = 12000;

function imageKey(url) {
  const raw = String(url || "").trim().toLowerCase();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.at(-1) || parsed.pathname;
  } catch {
    const noQuery = raw.split("?")[0];
    const parts = noQuery.split("/").filter(Boolean);
    return parts.at(-1) || noQuery;
  }
}

function normalizeCaption(text) {
  return String(text || "")
    .replace(/^File:/i, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchJsonWithTimeout(url, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function searchCommons(query, limit = 16) {
  const q = String(query || "").trim();
  if (!q) return [];

  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    q
  )}&gsrlimit=${Math.min(limit, 20)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900`;

  const data = await fetchJsonWithTimeout(url);
  const pages = Object.values(data?.query?.pages || {});

  return pages
    .map((page) => {
      const ii = page?.imageinfo?.[0];
      const urlValue = ii?.thumburl || ii?.url || "";
      if (!urlValue) return null;
      return {
        url: urlValue,
        caption: normalizeCaption(page?.title || "Reference image")
      };
    })
    .filter(Boolean);
}

function rankAndSelect(name, genus, candidates, maxCount = MAX_IMAGES_PER_ARTICLE) {
  const n = String(name || "").toLowerCase();
  const g = String(genus || "").toLowerCase();

  const dedup = new Map();
  for (const item of candidates) {
    const key = imageKey(item?.url);
    if (!key || dedup.has(key)) continue;
    dedup.set(key, item);
  }

  const scored = [...dedup.values()].map((item) => {
    const text = `${item.caption} ${imageKey(item.url)}`.toLowerCase();
    let score = 0;
    if (n && text.includes(n)) score += 8;
    if (g && text.includes(g)) score += 5;
    if (/(specimen|holotype|fossil|skeleton|skull|jaw|teeth|museum)/.test(text)) score += 3;
    if (/(restoration|reconstruction|life|artist)/.test(text)) score += 2;
    if (/(comparison|size|scale|human)/.test(text)) score += 2;
    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxCount).map(({ score, ...item }) => item);
}

async function processEntry(entry, queryCache) {
  const id = entry?.id;
  if (!id) return { id: "", updated: false, count: 0 };

  const filePath = path.join(DATA_DIR, `${id}.json`);
  let raw;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return { id, updated: false, count: 0 };
  }

  let detail;
  try {
    detail = JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch {
    return { id, updated: false, count: 0 };
  }

  const name = String(detail?.name || entry?.name || id).trim();
  const genus = name.split(/\s+/)[0] || name;

  const existing = [];
  if (Array.isArray(detail?.images)) {
    for (const img of detail.images) {
      if (typeof img === "string") existing.push({ url: img, caption: `${name} reference image` });
      else if (img && typeof img === "object" && img.url) existing.push({ url: img.url, caption: img.caption || `${name} reference image` });
    }
  }
  if (detail?.image) existing.unshift({ url: detail.image, caption: `${name} reference image` });
  else if (entry?.image) existing.unshift({ url: entry.image, caption: `${name} reference image` });

  const queryA = `${name} fossil`;
  const queryB = `${genus} dinosaur`;
  const queryC = `${name} skeleton`;

  if (!queryCache.has(queryA)) queryCache.set(queryA, await searchCommons(queryA, 20));
  if (!queryCache.has(queryB)) queryCache.set(queryB, await searchCommons(queryB, 16));
  if (!queryCache.has(queryC)) queryCache.set(queryC, await searchCommons(queryC, 16));

  const selected = rankAndSelect(name, genus, [
    ...existing,
    ...(queryCache.get(queryA) || []),
    ...(queryCache.get(queryB) || []),
    ...(queryCache.get(queryC) || [])
  ]);

  const finalImages = selected.length > 0 ? selected : existing.slice(0, 1);
  const before = JSON.stringify(detail.images || []);
  detail.images = finalImages;
  if (!detail.image && finalImages[0]?.url) detail.image = finalImages[0].url;
  const after = JSON.stringify(detail.images || []);

  if (before === after) return { id, updated: false, count: finalImages.length };

  await fs.writeFile(filePath, `${JSON.stringify(detail, null, 2)}\n`, "utf8");
  return { id, updated: true, count: finalImages.length };
}

async function runPool(items, worker, concurrency = CONCURRENCY) {
  const results = [];
  let idx = 0;

  async function next() {
    while (idx < items.length) {
      const current = items[idx++];
      const result = await worker(current);
      results.push(result);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => next()));
  return results;
}

async function main() {
  const indexRaw = await fs.readFile(INDEX_PATH, "utf8");
  const index = JSON.parse(indexRaw.replace(/^\uFEFF/, ""));
  const entries = Array.isArray(index) ? index : [];
  const cache = new Map();

  const results = await runPool(entries, (entry) => processEntry(entry, cache), CONCURRENCY);
  const updated = results.filter((r) => r.updated).length;
  const withMulti = results.filter((r) => r.count >= 3).length;
  const withAny = results.filter((r) => r.count >= 1).length;

  console.log(`TOTAL=${results.length}`);
  console.log(`UPDATED=${updated}`);
  console.log(`WITH_ANY_IMAGE_SET=${withAny}`);
  console.log(`WITH_3PLUS_IMAGES=${withMulti}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
