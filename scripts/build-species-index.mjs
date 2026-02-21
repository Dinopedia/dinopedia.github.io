import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const INDEX_PATH = path.join(DATA_DIR, "index.json");
const OUT_PATH = path.join(DATA_DIR, "species-index.json");

const TITLE_BATCH = 40;
const CONCURRENCY = 4;
const SPARQL_BATCH = 80;

function stripBom(raw) {
  return String(raw || "").replace(/^\uFEFF/, "");
}

function escapeTitle(title) {
  return String(title || "").trim().replace(/\s+/g, "_");
}

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "accept": "application/json",
        "user-agent": "Dino-pedia/1.0 (local project maintenance)"
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchEntityIdsByTitles(titles) {
  if (!titles.length) return new Map();
  const chunks = [];
  for (let i = 0; i < titles.length; i += TITLE_BATCH) chunks.push(titles.slice(i, i + TITLE_BATCH));
  const map = new Map();

  for (const chunk of chunks) {
    const titleParam = chunk.map((t) => escapeTitle(t)).join("|");
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${encodeURIComponent(titleParam)}&format=json&props=sitelinks|labels`;
    const data = await fetchJson(url);
    const entities = data?.entities || {};
    for (const entity of Object.values(entities)) {
      if (!entity || entity.missing !== undefined) continue;
      const qid = entity.id;
      const sitelink = entity?.sitelinks?.enwiki?.title || "";
      const label = entity?.labels?.en?.value || "";
      const wikiTitle = sitelink || label;
      if (qid && wikiTitle) map.set(wikiTitle.toLowerCase(), qid);
    }
  }

  return map;
}

async function searchEntityIdByLabel(label) {
  const q = String(label || "").trim();
  if (!q) return "";
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=en&type=item&format=json&limit=1`;
  const data = await fetchJson(url);
  return data?.search?.[0]?.id || "";
}

async function fetchSpeciesForGenusQid(qid) {
  if (!qid) return [];
  const query = `
SELECT ?species ?speciesLabel WHERE {
  ?species wdt:P171 wd:${qid} .
  ?species wdt:P105 wd:Q7432 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?speciesLabel
  `.trim();

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const data = await fetchJson(url, 20000);
  const bindings = data?.results?.bindings || [];
  return bindings
    .map((b) => String(b?.speciesLabel?.value || "").trim())
    .filter(Boolean);
}

function sparqlQuote(text) {
  return `"${String(text || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function fetchSpeciesByExactGenusNames(genusNames) {
  const input = [...new Set((genusNames || []).map((x) => String(x || "").trim()).filter(Boolean))];
  const map = new Map();
  const qidMap = new Map();

  for (let i = 0; i < input.length; i += SPARQL_BATCH) {
    const batch = input.slice(i, i + SPARQL_BATCH);
    const values = batch.map(sparqlQuote).join(" ");
    const query = `
SELECT ?genus ?genusName ?speciesLabel WHERE {
  VALUES ?genusName { ${values} }
  ?genus wdt:P225 ?genusName .
  ?genus wdt:P105 wd:Q34740 .
  OPTIONAL {
    ?species wdt:P171 ?genus .
    ?species wdt:P105 wd:Q7432 .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
}
ORDER BY ?genusName ?speciesLabel
    `.trim();

    const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
    const data = await fetchJson(url, 30000);
    const bindings = data?.results?.bindings || [];

    bindings.forEach((b) => {
      const genusName = String(b?.genusName?.value || "").trim();
      const genusQid = String(b?.genus?.value || "").split("/").pop() || "";
      const species = String(b?.speciesLabel?.value || "").trim();
      if (!genusName) return;
      if (!map.has(genusName.toLowerCase())) map.set(genusName.toLowerCase(), []);
      if (genusQid) qidMap.set(genusName.toLowerCase(), genusQid);
      if (species) map.get(genusName.toLowerCase()).push(species);
    });

    // Ensure genera with no species rows still recorded if matched.
    batch.forEach((name) => {
      if (!map.has(name.toLowerCase())) map.set(name.toLowerCase(), []);
    });
  }

  // Deduplicate per genus.
  const normalized = new Map();
  for (const [genus, list] of map.entries()) {
    normalized.set(genus, [...new Set(list)]);
  }

  return { speciesByGenus: normalized, qidByGenus: qidMap };
}

async function runPool(items, worker, concurrency = CONCURRENCY) {
  const out = [];
  let idx = 0;

  async function next() {
    while (idx < items.length) {
      const item = items[idx++];
      out.push(await worker(item));
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => next()));
  return out;
}

async function main() {
  const indexRaw = await fs.readFile(INDEX_PATH, "utf8");
  const index = JSON.parse(stripBom(indexRaw));
  const entries = Array.isArray(index) ? index : [];

  const titleToQid = await fetchEntityIdsByTitles(entries.map((e) => e?.name).filter(Boolean));
  const exact = await fetchSpeciesByExactGenusNames(entries.map((e) => e?.name));

  const results = await runPool(entries, async (entry) => {
    const genus = String(entry?.name || "").trim();
    let qid = exact.qidByGenus.get(genus.toLowerCase()) || titleToQid.get(genus.toLowerCase()) || "";
    let species = exact.speciesByGenus.get(genus.toLowerCase()) || [];
    if (species.length <= 1) {
      if (!qid) qid = await searchEntityIdByLabel(genus);
      if (qid) {
        const fallbackSpecies = await fetchSpeciesForGenusQid(qid);
        if (fallbackSpecies.length > species.length) species = fallbackSpecies;
      }
    }
    const unique = [...new Set(species)].filter((s) => s.toLowerCase() !== genus.toLowerCase());
    return {
      id: entry.id,
      genus,
      qid,
      species: unique,
      speciesCount: unique.length,
      monotypic: unique.length <= 1,
      updatedAt: new Date().toISOString()
    };
  }, CONCURRENCY);

  const payload = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    entries: results
  };

  await fs.writeFile(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const withSpecies = results.filter((r) => r.speciesCount > 1).length;
  console.log(`TOTAL=${results.length}`);
  console.log(`POLYTYPIC=${withSpecies}`);
  console.log(`MONOTYPIC_OR_UNKNOWN=${results.length - withSpecies}`);
  console.log(`OUT=${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
