const params = new URLSearchParams(window.location.search);
const dinoId = params.get("dino");

const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const overviewEl = document.getElementById("overview");
const quickFactsEl = document.getElementById("quickFacts");
const sectionsEl = document.getElementById("sections");
const sectionNavEl = document.getElementById("sectionNav");
const favBtn = document.getElementById("favBtn");
const compareBtn = document.getElementById("compareBtn");
const printBtn = document.getElementById("printBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
<<<<<<< HEAD
const improveArticleBtn = document.getElementById("improveArticleBtn");
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
const tagsEl = document.getElementById("tags");
const pronunciationEl = document.getElementById("pronunciation");
const etymologyEl = document.getElementById("etymology");
const relatedLinksEl = document.getElementById("relatedLinks");
const imageGalleryEl = document.getElementById("imageGallery");
const dinoInsightEl = document.getElementById("dinoInsight");
const articleSearchInput = document.getElementById("articleSearchInput");
const articleSearchPrevBtn = document.getElementById("articleSearchPrev");
const articleSearchNextBtn = document.getElementById("articleSearchNext");
const articleSearchClearBtn = document.getElementById("articleSearchClear");
const articleSearchCountEl = document.getElementById("articleSearchCount");
const articleContentEl = document.querySelector(".article-content");
const galleryBlockEl = document.querySelector(".article-gallery-block");
const reportOutdatedBtn = document.getElementById("reportOutdatedBtn");
const requestEditBtn = document.getElementById("requestEditBtn");
<<<<<<< HEAD
const speciesChooserEl = document.getElementById("speciesChooser");
const speciesViewEl = document.getElementById("speciesView");
const speciesViewTitleEl = document.getElementById("speciesViewTitle");
const speciesViewOverviewEl = document.getElementById("speciesViewOverview");
const speciesViewFactsEl = document.getElementById("speciesViewFacts");
const speciesViewSectionsEl = document.getElementById("speciesViewSections");
const speciesViewGalleryEl = document.getElementById("speciesViewGallery");
const relatedBlockEl = document.getElementById("related");
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935

const FAVORITES_KEY = "dinoPediaFavorites";
const COMPARE_KEY = "dinoPediaCompare";
const wikiThumbCache = new Map();
const LOCAL_FALLBACK_IMAGES = [
<<<<<<< HEAD
  { url: "images/no-image.svg", caption: "Image unavailable for this section" }
];
const LOCAL_FALLBACK_IMAGES_BY_ID = {
  spinosaurus: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/FSAC-KK-11888.jpg",
      caption: "Spinosaurus skeletal reference image"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Spinosaurus_aegyptiacus_reconstruction.png",
      caption: "Spinosaurus life restoration (comparative reference)"
    }
  ],
  pigeon: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Columba_livia_-_portrait.jpg",
      caption: "Rock dove portrait"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Feral_pigeons.jpg",
      caption: "Feral pigeons in an urban environment"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Columba_livia_flight.jpg",
      caption: "Pigeon in flight"
    }
  ]
};
=======
  { url: "images/trex-skull.png", caption: "Image unavailable for this section" }
];
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935

const CURATED_EXTRA_IMAGES = {
  trex: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sue_at_the_Field_Museum.jpg", caption: "Sue specimen at the Field Museum" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Stan_T_rex.jpg", caption: "Stan specimen mount" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Tyrannosaurus_rex_skeleton.jpg", caption: "T. rex skeletal reconstruction" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tyrannosaurus_rex_size_comparison.svg", caption: "T. rex size comparison with other theropods" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Tyrannosaurus_Rex_Skull.jpg", caption: "T. rex skull specimen" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Tyrannosaurus_rex_reconstruction.png", caption: "T. rex life restoration" }
  ],
  liopleurodon: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Liopleurodon_ferox_skull.jpg", caption: "Liopleurodon skull fossil" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Liopleurodon_ferox_reconstruction.jpg", caption: "Liopleurodon life reconstruction" }
  ],
  platecarpus: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/4/49/Platecarpus_tympaniticus.jpg", caption: "Platecarpus specimen" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Platecarpus_skull.jpg", caption: "Platecarpus skull detail" }
  ],
  tylosaurus: [
    { url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Tylosaurus_proriger_mounted_skeleton.jpg", caption: "Tylosaurus mounted skeleton" },
    { url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Tylosaurus_proriger_reconstruction.jpg", caption: "Tylosaurus restoration" }
  ]
};

const PREFERRED_FACT_KEYS = [
  "type",
  "period",
  "diet",
  "location",
  "classification",
  "length",
  "height",
  "weight",
  "speed",
  "discovered"
];

const NARRATIVE_SECTIONS = new Set([
  "externalAppearance",
  "feedingPatterns",
  "breedingAndNesting",
  "behaviorAndConflict",
  "sensoryAndIntelligence",
  "locomotionAndAthletics",
  "paleoecology",
  "extinctionContext",
  "physiology",
  "biomechanics",
  "fossilDiscoveryHistory"
]);

let currentBase = null;
let currentDetail = null;
let allDinosaurs = [];
let nameToId = new Map();
let sortedNames = [];
let knownGenera = [];
let latestGalleryItems = [];
<<<<<<< HEAD
let speciesIndexMap = new Map();
let articleSearchHits = [];
let activeSearchHit = -1;
let activeViewMode = "overview";
const IMAGE_SET_CACHE = new Map();
let speciesTabButtons = [];
const SPECIES_FETCH_CACHE = new Map();
const LOCAL_SPECIES_PROFILES = new Map();
const LOCAL_INFORMAL_TAXA = new Map();
=======
let articleSearchHits = [];
let activeSearchHit = -1;
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935

function safeJsonParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function getFavorites() {
  return new Set(safeJsonParse(localStorage.getItem(FAVORITES_KEY) || "[]", []));
}

function getCompare() {
  return safeJsonParse(localStorage.getItem(COMPARE_KEY) || "[]", []).filter(Boolean).slice(0, 4);
}

function saveFavorites(setObj) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...setObj]));
}

function saveCompare(ids) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids.slice(0, 4)));
}

function imagePath(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("images/") ? path : `images/${path}`;
}

function normalizeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getWikiThumbByName(name) {
  const key = String(name || "").trim();
  if (!key) return "";
  if (wikiThumbCache.has(key)) return wikiThumbCache.get(key);

  const title = encodeURIComponent(key.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("summary failed");
    const data = await response.json();
    const thumb = data?.thumbnail?.source || data?.originalimage?.source || "";
    wikiThumbCache.set(key, thumb);
    return thumb;
  } catch {
    wikiThumbCache.set(key, "");
    return "";
  }
}

<<<<<<< HEAD
function isLikelyBrokenLocalImage(path) {
  const p = textFix(String(path || "")).trim().toLowerCase();
  if (!p) return true;
  const knownEmpty = new Set([
    "images/allosaurus.png",
    "images/ankylosaurus.png",
    "images/brachiosaurus.png",
    "images/diplodicus.png",
    "images/spinosaurus.png",
    "images/stegosaurus.png",
    "images/velociraptor.png"
  ]);
  return knownEmpty.has(p);
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function textFix(input) {
  return String(input)
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/â‰ˆ/g, "about ")
    .replace(/Â°/g, " degrees")
    .replace(/Â/g, "")
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€/g, '"');
}

<<<<<<< HEAD
function polishDataPhrase(text) {
  let out = textFix(String(text || "")).trim();
  out = out.replace(/^Unknown\.\s+([a-z])/, (_, c) => `Unknown. ${c.toUpperCase()}`);
  return out;
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function prettyTitle(key) {
  return textFix(
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/^./, (c) => c.toUpperCase())
  );
}

function normalizeValue(value) {
<<<<<<< HEAD
  if (Array.isArray(value)) return value.map((v) => polishDataPhrase(String(v))).join(", ");
=======
  if (Array.isArray(value)) return value.map((v) => textFix(String(v))).join(", ");
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${prettyTitle(k)}: ${normalizeValue(v)}`)
      .join("; ");
  }
<<<<<<< HEAD
  const cleaned = polishDataPhrase(String(value));
  return isUnknownLike(cleaned) ? "Unknown" : cleaned;
}

function isUnknownLike(value) {
  const v = textFix(String(value || "")).trim().toLowerCase();
  if (!v || v === "unknown" || v.startsWith("unknown")) return true;

  // Treat broad boilerplate placeholders as unknown-quality data.
  const placeholderPatterns = [
    /^estimated from fossil/i,
    /^estimated from reconstructions?/i,
    /^estimated from scaling/i,
    /^estimated from posture/i,
    /^estimated from genus/i,
    /^estimated from parent genus/i,
    /^estimated from comparative/i,
    /^inferred from anatomy/i,
    /^inferred from/i,
    /^summarized from (published )?paleontological/i,
    /^documented through historical and modern paleontological expeditions/i,
    /^reproductive strategy varied by lineage/i,
    /^likely varied by body size/i,
    /^nesting ecology likely climate-linked/i,
    /^known in some lineages/i,
    /^feeding strategy is interpreted/i,
    /^direct bite-force values are not currently constrained/i,
    /^species-level reproductive tissue evidence is currently lacking/i,
    /^this interpretation may be revised/i
  ];
  return placeholderPatterns.some((rx) => rx.test(v));
}

function hasSubstantiveData(value) {
  if (Array.isArray(value)) return value.some((item) => hasSubstantiveData(item));
  if (value && typeof value === "object") return Object.values(value).some((item) => hasSubstantiveData(item));
  return !isUnknownLike(value);
}

function humanizeField(value, fallback = "Unknown") {
  return isUnknownLike(value) ? fallback : polishDataPhrase(String(value));
=======
  return textFix(String(value));
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
}

function sentenceCase(text) {
  const clean = textFix(String(text || "")).trim();
  if (!clean) return "";
  return clean[0].toUpperCase() + clean.slice(1);
}

<<<<<<< HEAD
function normalizeSentence(text) {
  let out = textFix(String(text || "")).replace(/\s+/g, " ").trim();
  if (!out) return "Information is currently limited for this subsection.";
  out = out
    .replace(/\bis currently described as\b/gi, "is described as")
    .replace(/\bis interpreted as\b/gi, "is best interpreted as")
    .replace(/\bcurrently appears\b/gi, "appears")
    .replace(/\bcurrently lacks enough specimen-level evidence\b/gi, "does not yet have enough specimen-level evidence")
    .replace(/\bnot yet species-quantified\b/gi, "not yet quantified at species level");
  out = out.replace(/([.!?])\1+$/g, "$1");
  out = out.replace(/\s+([.!?])/g, "$1");
  if (!/[.!?]$/.test(out)) out += ".";
  return out;
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function isBoundaryChar(ch) {
  return !ch || !/[a-z0-9]/i.test(ch);
}

function buildNameLookup() {
  nameToId = new Map();
  const genera = new Set();
  allDinosaurs.forEach((d) => {
    if (d?.name && d?.id) {
      nameToId.set(String(d.name).toLowerCase(), d.id);
      const genus = String(d.name).trim().split(/\s+/)[0]?.toLowerCase();
      if (genus) genera.add(genus);
    }
  });
  sortedNames = [...nameToId.keys()].sort((a, b) => b.length - a.length);
  knownGenera = [...genera];
}

<<<<<<< HEAD
async function loadSpeciesIndex() {
  if (speciesIndexMap.size > 0) return;
  try {
    const response = await fetch("data/species-index.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    entries.forEach((entry) => {
      if (!entry?.id) return;
      speciesIndexMap.set(entry.id, entry);
    });
  } catch {
    // optional index, safe to skip
  }
}

async function loadSpeciesProfiles() {
  if (LOCAL_SPECIES_PROFILES.size > 0) return;
  try {
    const response = await fetch("data/species-profiles.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    entries.forEach((entry) => {
      const key = String(entry?.name || "").trim().toLowerCase();
      if (!key) return;
      LOCAL_SPECIES_PROFILES.set(key, entry);
    });
  } catch {
    // optional local dataset
  }
}

async function loadInformalTaxa() {
  if (LOCAL_INFORMAL_TAXA.size > 0) return;
  try {
    const response = await fetch("data/informal-taxa.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    entries.forEach((entry) => {
      const key = String(entry?.id || "").trim().toLowerCase();
      if (!key) return;
      const taxa = Array.isArray(entry?.taxa) ? entry.taxa : [];
      LOCAL_INFORMAL_TAXA.set(key, taxa);
    });
  } catch {
    // optional local dataset
  }
}

function getLocalSpeciesProfile(speciesName) {
  const key = String(speciesName || "").trim().toLowerCase();
  if (!key) return null;
  return LOCAL_SPECIES_PROFILES.get(key) || null;
}

function isRealSpeciesName(name) {
  const n = String(name || "").trim();
  if (!n) return false;
  if (/^Q\d+$/i.test(n)) return false;
  if (/\bsp\.?\b/i.test(n)) return false;
  return /^[A-Z][A-Za-z-]+\s+[a-z][a-z-]+(?:\s+[a-z][a-z-]+)?$/.test(n);
}

function mergeSpeciesLists(...lists) {
  const out = [];
  const seen = new Set();
  lists.forEach((list) => {
    (Array.isArray(list) ? list : []).forEach((name) => {
      const clean = String(name || "").trim();
      if (!isRealSpeciesName(clean)) return;
      const key = clean.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push(clean);
    });
  });
  return out.sort((a, b) => a.localeCompare(b));
}

function buildSpeciesEntries(localList, fetchedList) {
  const local = mergeSpeciesLists(localList || []);
  const fetched = mergeSpeciesLists(fetchedList || []);
  const map = new Map();

  local.forEach((name) => {
    map.set(name.toLowerCase(), { name, local: true, wikidata: false });
  });
  fetched.forEach((name) => {
    const key = name.toLowerCase();
    if (map.has(key)) {
      map.get(key).wikidata = true;
    } else {
      map.set(key, { name, local: false, wikidata: true });
    }
  });

  return [...map.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => ({
      name: entry.name,
      source: entry.local && entry.wikidata ? "Both" : entry.local ? "Local" : "Wikidata"
    }));
}

function getInformalTaxa(base) {
  const id = String(base?.id || "").trim().toLowerCase();
  const fromLocalFile = LOCAL_INFORMAL_TAXA.get(id) || [];
  const fromSpeciesIndex = Array.isArray(speciesIndexMap.get(base?.id || "")?.informalTaxa)
    ? speciesIndexMap.get(base?.id || "").informalTaxa
    : [];
  return [...fromLocalFile, ...fromSpeciesIndex].filter(Boolean);
}

async function fetchWikidataQidByLabel(label) {
  const q = String(label || "").trim();
  if (!q) return "";
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(q)}&language=en&type=item&format=json&limit=1&origin=*`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return "";
    const data = await response.json();
    return data?.search?.[0]?.id || "";
  } catch {
    return "";
  }
}

async function fetchSpeciesForGenusName(genusName) {
  const genus = String(genusName || "").trim();
  if (!genus) return [];
  if (SPECIES_FETCH_CACHE.has(genus.toLowerCase())) {
    return SPECIES_FETCH_CACHE.get(genus.toLowerCase());
  }

  const qid = await fetchWikidataQidByLabel(genus);
  if (!qid) {
    SPECIES_FETCH_CACHE.set(genus.toLowerCase(), []);
    return [];
  }

  const sparql = `
SELECT ?speciesLabel WHERE {
  ?species wdt:P171 wd:${qid} .
  ?species wdt:P105 wd:Q7432 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?speciesLabel
  `.trim();

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "accept": "application/sparql-results+json"
      }
    });
    if (!response.ok) {
      SPECIES_FETCH_CACHE.set(genus.toLowerCase(), []);
      return [];
    }
    const data = await response.json();
    const species = (data?.results?.bindings || [])
      .map((b) => String(b?.speciesLabel?.value || "").trim())
      .filter(Boolean)
      .filter((name) => !/^Q\d+$/i.test(name))
      .filter((name) => isRealSpeciesName(name))
      .filter((name) => name.toLowerCase() !== genus.toLowerCase());

    const unique = [...new Set(species)];
    SPECIES_FETCH_CACHE.set(genus.toLowerCase(), unique);
    return unique;
  } catch {
    SPECIES_FETCH_CACHE.set(genus.toLowerCase(), []);
    return [];
  }
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function findNameMatches(text, currentId, maxMatches = 10) {
  const source = String(text || "");
  const lower = source.toLowerCase();
  const matches = [];

  for (const nameLower of sortedNames) {
    const targetId = nameToId.get(nameLower);
    if (!targetId || targetId === currentId) continue;

    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(nameLower, from);
      if (idx < 0) break;

      const before = lower[idx - 1];
      const after = lower[idx + nameLower.length];
      if (isBoundaryChar(before) && isBoundaryChar(after)) {
        matches.push({
          start: idx,
          end: idx + nameLower.length,
          id: targetId
        });
      }

      from = idx + nameLower.length;
      if (matches.length > maxMatches * 4) break;
    }

    if (matches.length > maxMatches * 4) break;
  }

  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  const compact = [];
  let cursor = -1;
  for (const m of matches) {
    if (m.start < cursor) continue;
    compact.push(m);
    cursor = m.end;
    if (compact.length >= maxMatches) break;
  }

  return compact;
}

function renderLinkedText(el, text, currentId) {
  const safe = textFix(String(text || ""));
  const matches = findNameMatches(safe, currentId);
  if (matches.length === 0) {
    el.textContent = safe;
    return;
  }

  el.textContent = "";
  let cursor = 0;

  matches.forEach((m) => {
    if (m.start > cursor) el.appendChild(document.createTextNode(safe.slice(cursor, m.start)));

    const link = document.createElement("a");
    link.href = `dino.html?dino=${encodeURIComponent(m.id)}`;
    link.className = "inline-entity-link";
    link.textContent = safe.slice(m.start, m.end);
    el.appendChild(link);

    cursor = m.end;
  });

  if (cursor < safe.length) el.appendChild(document.createTextNode(safe.slice(cursor)));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function addFact(label, value) {
  const row = document.createElement("div");
  row.className = "article-fact-row";

  const dt = document.createElement("dt");
  dt.textContent = textFix(label);

  const dd = document.createElement("dd");
  dd.textContent = normalizeValue(value);

  row.append(dt, dd);
  quickFactsEl.appendChild(row);
}

<<<<<<< HEAD
function computeArticleCoverage(base, detail) {
  const scientific = detail?.scientificData && typeof detail.scientificData === "object" ? detail.scientificData : {};
  const coreFields = ["period", "diet", "location", "classification", "length", "height", "weight", "speed"];
  const knownCore = coreFields.filter((k) => hasSubstantiveData(scientific[k])).length;
  const missingCore = coreFields.filter((k) => !hasSubstantiveData(scientific[k]));

  const sectionCount = detail && typeof detail === "object"
    ? Object.entries(detail)
      .filter(([key, value]) => !["name", "image", "overview"].includes(key) && hasSubstantiveData(value))
      .length
    : 0;

  const citations = Array.isArray(detail?.citations) ? detail.citations.length : 0;
  const images = (() => {
    const list = [];
    if (detail?.image) list.push(detail.image);
    else if (base?.image) list.push(base.image);
    if (Array.isArray(detail?.images)) {
      detail.images.forEach((img) => {
        if (typeof img === "string" && img) list.push(img);
        if (img && typeof img === "object" && img.url) list.push(img.url);
      });
    }
    return [...new Set(list.filter(Boolean))].length;
  })();

  const score = Math.max(0, Math.min(100, Math.round((knownCore / coreFields.length) * 45 + Math.min(sectionCount, 18) * 2 + Math.min(citations, 20) * 1.2 + Math.min(images, 8) * 2.5)));
  return { score, knownCore, coreTotal: coreFields.length, sectionCount, citations, images, missingCore };
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function buildQuickFacts(base, detail) {
  quickFactsEl.innerHTML = "";
  addFact("Name", detail?.name || base.name || "Unknown");
  addFact("Type", base.type || "Dinosaur");

  const scientificData = detail?.scientificData || null;

  if (scientificData && typeof scientificData === "object") {
<<<<<<< HEAD
    const qualityFields = ["period", "diet", "location", "classification", "length", "height", "weight", "speed"];
    const knownCount = qualityFields.filter((key) => !isUnknownLike(scientificData[key])).length;
    const qLabel = knownCount >= 7 ? "High detail" : knownCount >= 5 ? "Moderate detail" : "Basic detail";
    const coverage = computeArticleCoverage(base, detail);
    addFact("Data quality", `${qLabel} (${knownCount}/${qualityFields.length} core fields)`);
    addFact("Evidence score", `${coverage.score}/100`);
    addFact("Sections", String(coverage.sectionCount));
    addFact("References", String(coverage.citations));
    addFact("Image coverage", `${coverage.images} image${coverage.images === 1 ? "" : "s"}`);
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    PREFERRED_FACT_KEYS.forEach((key) => {
      if (scientificData[key]) addFact(prettyTitle(key), scientificData[key]);
    });
    return;
  }

  addFact("Period", base.period || "Unknown");
  addFact("Diet", base.diet || "Unknown");
  addFact("Region", base.where || "Unknown");
}

function objectToNarrative(sectionKey, obj, dinoName) {
  const sentences = Object.entries(obj).map(([key, value]) => {
    const label = prettyTitle(key);
    const readable = normalizeValue(value);
<<<<<<< HEAD
    if (isUnknownLike(value)) {
      return normalizeSentence(`Reliable ${label.toLowerCase()} evidence for ${dinoName} is still limited.`);
    }

    if (sectionKey === "externalAppearance") {
      if (key === "skin") return normalizeSentence(`${dinoName} likely had ${readable}. This would have influenced heat management and external protection.`);
      if (key === "lips") return normalizeSentence(`Current reconstructions suggest ${dinoName} may have had ${readable}.`);
      if (key === "coloration") return normalizeSentence(`Its coloration is reconstructed as ${readable}, although pigment evidence is usually limited.`);
      if (key === "displayStructures") return normalizeSentence(`Display structures included ${readable}, which may have supported species recognition and courtship signaling.`);
      return normalizeSentence(`${label} is described as ${readable}.`);
    }

    if (sectionKey === "feedingPatterns") {
      return normalizeSentence(`For ${dinoName}, ${label.toLowerCase()} is ${readable}. This may have shifted with age, prey availability, and seasonal pressure.`);
    }

    if (sectionKey === "breedingAndNesting") {
      return normalizeSentence(`${label} is best supported as ${readable}. As with many prehistoric taxa, reproductive behavior is reconstructed from fossils and comparison with living archosaurs.`);
    }

    return normalizeSentence(readable);
  });

  return normalizeSentence(sentences.join(" "));
}

function renderNarrativeSection(section, sectionKey, value, dinoName) {
  let appended = 0;
  Object.entries(value).forEach(([key, itemValue]) => {
    if (!hasSubstantiveData(itemValue)) return;
=======

    if (sectionKey === "externalAppearance") {
      if (key === "skin") return `${dinoName} likely had ${readable}. This would have influenced heat management and external protection.`;
      if (key === "lips") return `Current reconstructions suggest ${dinoName} may have had ${readable}.`;
      if (key === "coloration") return `Its coloration is reconstructed as ${readable}, although pigment evidence is usually limited.`;
      if (key === "displayStructures") return `Display structures included ${readable}, which may have supported species recognition and courtship signaling.`;
      return `${label} is described as ${readable}.`;
    }

    if (sectionKey === "feedingPatterns") {
      return `For ${dinoName}, ${label.toLowerCase()} is interpreted as ${readable}. This likely shifted with age, local prey density, and seasonal environmental pressure.`;
    }

    if (sectionKey === "breedingAndNesting") {
      return `Current evidence for ${label.toLowerCase()} suggests ${readable}. As with many prehistoric taxa, reproductive behavior is reconstructed from fossils and comparison with living archosaurs.`;
    }

    return `${label} is currently described as ${readable}.`;
  });

  return textFix(sentences.join(" "));
}

function renderNarrativeSection(section, sectionKey, value, dinoName) {
  Object.entries(value).forEach(([key, itemValue]) => {
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    const sub = document.createElement("div");
    sub.className = "detail-subsection";
    sub.dataset.topic = slugify(key);

    const subTitle = document.createElement("h4");
    subTitle.className = "detail-subtitle";
    subTitle.textContent = prettyTitle(key);
    sub.appendChild(subTitle);

    const paragraph = document.createElement("p");
    paragraph.className = "section-paragraph";
    const text = itemValue && typeof itemValue === "object" && !Array.isArray(itemValue)
      ? objectToNarrative(sectionKey, itemValue, dinoName)
<<<<<<< HEAD
      : isUnknownLike(itemValue)
        ? `Reliable ${prettyTitle(key).toLowerCase()} evidence for ${dinoName} is still limited.`
        : `${dinoName} ${prettyTitle(key).toLowerCase()} is ${normalizeValue(itemValue)}.`;
=======
      : `${dinoName} ${prettyTitle(key).toLowerCase()} is interpreted as ${normalizeValue(itemValue)}. This interpretation may be revised as new specimens are described.`;
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    renderLinkedText(paragraph, text, dinoId);
    sub.appendChild(paragraph);

    section.appendChild(sub);
<<<<<<< HEAD
    appended += 1;
  });

  if (appended === 0) {
    appendDetailSubsection(
      section,
      "Evidence status",
      `${dinoName} currently lacks enough specimen-level evidence to populate this subsection with reliable detail.`,
      "evidence-status"
    );
  }
=======
  });
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
}

function renderListSection(section, value) {
  if (Array.isArray(value)) {
    const paragraph = document.createElement("p");
    paragraph.className = "section-paragraph";
<<<<<<< HEAD
    renderLinkedText(paragraph, normalizeSentence(normalizeValue(value)), dinoId);
=======
    renderLinkedText(paragraph, `Documented points include ${normalizeValue(value)}.`, dinoId);
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    section.appendChild(paragraph);
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      const sub = document.createElement("div");
      sub.className = "detail-subsection";
      sub.dataset.topic = slugify(k);

      const subTitle = document.createElement("h4");
      subTitle.className = "detail-subtitle";
      subTitle.textContent = prettyTitle(k);
      sub.appendChild(subTitle);

      const paragraph = document.createElement("p");
      paragraph.className = "section-paragraph";
<<<<<<< HEAD
      renderLinkedText(paragraph, normalizeSentence(normalizeValue(v)), dinoId);
=======
      renderLinkedText(paragraph, `${prettyTitle(k)} is currently described as ${normalizeValue(v)}.`, dinoId);
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
      sub.appendChild(paragraph);

      section.appendChild(sub);
    });
  } else {
    const paragraph = document.createElement("p");
    paragraph.className = "section-paragraph";
<<<<<<< HEAD
    renderLinkedText(paragraph, normalizeSentence(sentenceCase(normalizeValue(value))), dinoId);
=======
    renderLinkedText(paragraph, sentenceCase(normalizeValue(value)), dinoId);
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    section.appendChild(paragraph);
  }
}

<<<<<<< HEAD
function renderCitationsSection(section, value) {
  const items = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.values(value)
      : [];

  if (!Array.isArray(items) || items.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.className = "section-paragraph";
    paragraph.textContent = "No citations listed for this article yet.";
    section.appendChild(paragraph);
    return;
  }

  const list = document.createElement("ol");
  list.className = "species-link-list";

  items.forEach((item) => {
    const li = document.createElement("li");
    const entry = item && typeof item === "object" ? item : { title: normalizeValue(item), url: "" };
    const title = textFix(entry.title || entry.label || "Reference");
    const url = textFix(entry.url || "");
    const source = textFix(entry.source || "");
    const year = textFix(entry.year || "");

    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "read-link";
      link.textContent = title;
      li.appendChild(link);
    } else {
      li.textContent = title;
    }

    const metaParts = [source, year].filter(Boolean);
    if (metaParts.length > 0) {
      const meta = document.createElement("span");
      meta.className = "search-count";
      meta.textContent = ` (${metaParts.join(", ")})`;
      li.appendChild(meta);
    }

    list.appendChild(li);
  });

  section.appendChild(list);
}

function buildFallbackCitations(base, detail, activeName) {
  const taxon = textFix(String(activeName || detail?.name || base?.name || "")).trim();
  const page = encodeURIComponent(taxon.replace(/\s+/g, "_"));
  const q = encodeURIComponent(taxon);
  if (!taxon) return [];
  return [
    {
      title: `${taxon} - Wikipedia overview`,
      url: `https://en.wikipedia.org/wiki/${page}`,
      source: "Wikipedia",
      year: ""
    },
    {
      title: `${taxon} - Wikidata record search`,
      url: `https://www.wikidata.org/w/index.php?search=${q}`,
      source: "Wikidata",
      year: ""
    },
    {
      title: `${taxon} - Paleobiology Database results`,
      url: `https://paleobiodb.org/classic/checkTaxonInfo?taxon_no=&is_real_user=1&taxon_name=${q}`,
      source: "Paleobiology Database",
      year: ""
    }
  ];
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function addSectionNavItem(id, label) {
  const link = document.createElement("a");
  link.href = `#${id}`;
  link.className = "section-nav-link";
  link.textContent = label;
  sectionNavEl.appendChild(link);
}

function canonicalSectionTitle(name) {
  if (name === "scientificData") return "Description";
  if (name === "fossilDiscoveryHistory") return "History of research";
  if (name === "externalAppearance") return "Appearance";
  if (name === "huntingAndDiet") return "Paleobiology";
<<<<<<< HEAD
  if (name === "citations") return "Citations";
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  return prettyTitle(name);
}

function appendDetailSubsection(section, subtitle, text, topic = "") {
  const sub = document.createElement("div");
  sub.className = "detail-subsection";
  if (topic) sub.dataset.topic = slugify(topic);

  const subTitle = document.createElement("h4");
  subTitle.className = "detail-subtitle";
  subTitle.textContent = subtitle;
  sub.appendChild(subTitle);

  const paragraph = document.createElement("p");
  paragraph.className = "section-paragraph";
  renderLinkedText(paragraph, text, dinoId);
  sub.appendChild(paragraph);

  section.appendChild(sub);
}

function renderScientificDescription(section, value, dinoName) {
  if (!value || typeof value !== "object") {
    renderListSection(section, value);
    return;
  }

  const sizeBits = ["length", "height", "weight", "speed"]
<<<<<<< HEAD
    .filter((key) => value[key] && !isUnknownLike(value[key]))
=======
    .filter((key) => value[key])
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    .map((key) => `${prettyTitle(key)}: ${normalizeValue(value[key])}`);

  if (sizeBits.length > 0) {
    appendDetailSubsection(
      section,
      "Size",
<<<<<<< HEAD
      `${dinoName} size estimates include ${sizeBits.join("; ")}. Reported values can shift as new specimens and methods refine reconstructions.`,
=======
      `${dinoName} had the following size estimates: ${sizeBits.join("; ")}. These ranges are produced from specimen scaling and can shift with improved reconstructions.`,
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
      "size"
    );
  }

<<<<<<< HEAD
  const classification = value.classification && !isUnknownLike(value.classification) ? normalizeValue(value.classification) : "";
  const type = value.type && !isUnknownLike(value.type) ? normalizeValue(value.type) : "";
=======
  const classification = value.classification ? normalizeValue(value.classification) : "";
  const type = value.type ? normalizeValue(value.type) : "";
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  if (classification || type) {
    const classText = [type, classification].filter(Boolean).join(" within ");
    appendDetailSubsection(
      section,
      "Classification",
<<<<<<< HEAD
      `${dinoName} is classified as ${classText}. Placement may be revised when new comparative analyses are published.`,
=======
      `${dinoName} is currently placed as ${classText}. This placement can change when new comparative analyses are published.`,
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
      "classification"
    );
  }

  const historyBits = ["discovered", "period", "location"]
<<<<<<< HEAD
    .filter((key) => value[key] && !isUnknownLike(value[key]))
=======
    .filter((key) => value[key])
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    .map((key) => `${prettyTitle(key)}: ${normalizeValue(value[key])}`);

  if (historyBits.length > 0) {
    appendDetailSubsection(
      section,
      "Research context",
<<<<<<< HEAD
      `${historyBits.join("; ")}. This context helps show how strong the available evidence is for this taxon.`,
=======
      `${historyBits.join("; ")}. This context is important for understanding where evidence quality is strongest.`,
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
      "history"
    );
  }

  const covered = new Set(["length", "height", "weight", "speed", "classification", "type", "discovered", "period", "location"]);
  Object.entries(value).forEach(([key, itemValue]) => {
    if (covered.has(key)) return;
<<<<<<< HEAD
    if (isUnknownLike(itemValue)) return;
    const normalized = normalizeValue(itemValue);
    appendDetailSubsection(
      section,
      prettyTitle(key),
      `${prettyTitle(key)}: ${normalized}.`,
      key
    );
  });

  if (sizeBits.length === 0 && !classification && !type && historyBits.length === 0) {
    appendDetailSubsection(
      section,
      "Evidence status",
      `${dinoName} currently has limited specimen-level measurements in this entry. Quantitative fields are left as unknown until stronger published estimates are available.`,
      "evidence-status"
    );
  }
=======
    appendDetailSubsection(
      section,
      prettyTitle(key),
      `${dinoName} ${prettyTitle(key).toLowerCase()} is described as ${normalizeValue(itemValue)}.`,
      key
    );
  });
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
}

function renderSection(name, value, dinoName) {
  const section = document.createElement("section");
  section.className = "detail-section";

  const sectionId = `section-${slugify(name)}`;
  section.id = sectionId;

  const heading = document.createElement("h3");
  heading.textContent = canonicalSectionTitle(name);
  section.appendChild(heading);

  const isNarrative = NARRATIVE_SECTIONS.has(name) && value && typeof value === "object" && !Array.isArray(value);

  if (name === "scientificData") renderScientificDescription(section, value, dinoName);
<<<<<<< HEAD
  else if (name === "citations") renderCitationsSection(section, value);
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  else if (isNarrative) renderNarrativeSection(section, name, value, dinoName);
  else renderListSection(section, value);

  sectionsEl.appendChild(section);
  addSectionNavItem(sectionId, canonicalSectionTitle(name));
}

function renderGeneratedSection(idSuffix, title, text) {
  const section = document.createElement("section");
  section.className = "detail-section";
  section.id = `section-generated-${idSuffix}`;

  const heading = document.createElement("h3");
  heading.textContent = title;
  section.appendChild(heading);

  const paragraph = document.createElement("p");
  paragraph.className = "section-paragraph";
  renderLinkedText(paragraph, textFix(text), dinoId);
  section.appendChild(paragraph);

  sectionsEl.appendChild(section);
  addSectionNavItem(section.id, title);
}

<<<<<<< HEAD
async function renderSpeciesInGenusSection(base, activeName) {
  const record = speciesIndexMap.get(base?.id || "");
  const localSpecies = Array.isArray(record?.species) ? record.species : [];
  const fetched = await fetchSpeciesForGenusName(activeName);
  const speciesEntries = buildSpeciesEntries(localSpecies, fetched);
  const species = speciesEntries.map((entry) => entry.name);
  if (species.length <= 1) return;

  const section = document.createElement("section");
  section.className = "detail-section";
  section.id = "section-species-in-this-genus";

  const heading = document.createElement("h3");
  heading.textContent = "Species in this genus";
  section.appendChild(heading);

  const intro = document.createElement("p");
  intro.className = "section-paragraph";
  intro.textContent = `${activeName} currently includes multiple species. Open a species article for details and comparisons. Source badges indicate whether each species came from local data, Wikidata, or both.`;
  section.appendChild(intro);

  const list = document.createElement("ul");
  list.className = "species-link-list";
  speciesEntries.forEach((entry) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.className = "read-link";
    link.href = `species.html?genus=${encodeURIComponent(base.id)}&name=${encodeURIComponent(entry.name)}`;
    link.textContent = entry.name;
    li.appendChild(link);
    const badge = document.createElement("span");
    badge.className = "species-source-badge";
    badge.textContent = entry.source;
    li.appendChild(document.createTextNode(" "));
    li.appendChild(badge);
    list.appendChild(li);
  });
  section.appendChild(list);

  sectionsEl.appendChild(section);
  addSectionNavItem(section.id, "Species in this genus");
}

async function fetchSpeciesSummary(name) {
  const title = encodeURIComponent(String(name || "").replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchSpeciesCommonsImages(name) {
  const query = `${name} fossil`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    const pages = Object.values(data?.query?.pages || {});
    return pages
      .map((p) => ({
        url: p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url || "",
        caption: String(p?.title || "Reference image").replace(/^File:/i, "").replace(/[_]+/g, " ")
      }))
      .filter((x) => x.url);
  } catch {
    return [];
  }
}

async function fetchSpeciesLongExtract(name) {
  const pageTitle = encodeURIComponent(String(name || "").replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&titles=${pageTitle}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return "";
    const data = await response.json();
    const page = Object.values(data?.query?.pages || {})[0];
    return String(page?.extract || "").trim();
  } catch {
    return "";
  }
}

function htmlToPlainText(html) {
  const holder = document.createElement("div");
  holder.innerHTML = String(html || "");
  return textFix(holder.textContent || holder.innerText || "").replace(/\s+/g, " ").trim();
}

async function fetchSpeciesWikipediaSections(name) {
  const pageTitle = encodeURIComponent(String(name || "").replace(/\s+/g, "_"));
  const sectionsUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${pageTitle}&prop=sections`;
  try {
    const response = await fetch(sectionsUrl, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    const all = Array.isArray(data?.parse?.sections) ? data.parse.sections : [];
    const wanted = [
      "discovery and naming",
      "description",
      "classification",
      "paleobiology",
      "paleoecology",
      "history of research"
    ];
    const candidates = all.filter((s) => wanted.includes(String(s?.line || "").trim().toLowerCase())).slice(0, 5);
    const results = [];

    for (const sec of candidates) {
      const idx = String(sec?.index || "").trim();
      if (!idx) continue;
      const textUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2&origin=*&page=${pageTitle}&prop=text&section=${encodeURIComponent(idx)}`;
      const secResp = await fetch(textUrl, { cache: "no-store" });
      if (!secResp.ok) continue;
      const secData = await secResp.json();
      const text = htmlToPlainText(secData?.parse?.text || "");
      if (!text || text.length < 120) continue;
      results.push({ title: textFix(sec.line || "Section"), text });
    }

    return results;
  } catch {
    return [];
  }
}

async function fetchSpeciesReferences(name) {
  const pageTitle = encodeURIComponent(String(name || "").replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extlinks&ellimit=40&titles=${pageTitle}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    const page = Object.values(data?.query?.pages || {})[0];
    const links = Array.isArray(page?.extlinks) ? page.extlinks : [];
    return links
      .map((x) => String(x?.["*"] || "").trim())
      .filter((u) => /^https?:\/\//i.test(u))
      .slice(0, 8)
      .map((u, i) => ({ title: `External source ${i + 1}`, url: u }));
  } catch {
    return [];
  }
}

function addSpeciesFact(label, value) {
  if (!speciesViewFactsEl) return;
  const row = document.createElement("div");
  row.className = "article-fact-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value || "Unknown";
  row.append(dt, dd);
  speciesViewFactsEl.appendChild(row);
}

function renderSpeciesDetails(base, detail, speciesName, summary, longExtract, wikiSections = [], references = []) {
  if (!speciesViewFactsEl || !speciesViewSectionsEl) return;
  speciesViewFactsEl.innerHTML = "";
  speciesViewSectionsEl.innerHTML = "";

  const scientific = detail?.scientificData || {};
  addSpeciesFact("Species", speciesName);
  addSpeciesFact("Genus", detail?.name || base?.name || "Unknown");
  addSpeciesFact("Type", base?.type || scientific.type || "Unknown");
  addSpeciesFact("Period", scientific.period || base?.period || "Unknown");
  addSpeciesFact("Region", scientific.location || base?.where || "Unknown");
  addSpeciesFact("Diet", scientific.diet || base?.diet || "Unknown");
  addSpeciesFact("Status", summary?.description || "Species-level entry");

  const sectionBlocks = Array.isArray(wikiSections) ? wikiSections.filter((s) => s?.text) : [];
  if (sectionBlocks.length > 0) {
    sectionBlocks.forEach((block) => {
      const section = document.createElement("section");
      section.className = "detail-subsection";
      const h = document.createElement("h4");
      h.className = "detail-subtitle";
      h.textContent = block.title || "Section";
      section.appendChild(h);
      const p = document.createElement("p");
      p.className = "section-paragraph";
      renderLinkedText(p, block.text, dinoId);
      section.appendChild(p);
      speciesViewSectionsEl.appendChild(section);
    });
  } else {
    const paragraphs = String(longExtract || "")
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 120)
      .slice(0, 6);

    if (paragraphs.length === 0) {
      const fallback = document.createElement("p");
      fallback.className = "section-paragraph";
      fallback.textContent = `${speciesName} currently appears in Dino-pedia as a species view under the ${detail?.name || base?.name || "parent genus"} article. More species-specific fossil and anatomical detail can be expanded as dedicated local species datasets are added.`;
      speciesViewSectionsEl.appendChild(fallback);
      return;
    }

    paragraphs.forEach((text, idx) => {
      const section = document.createElement("section");
      section.className = "detail-subsection";
      const h = document.createElement("h4");
      h.className = "detail-subtitle";
      h.textContent = ["Overview", "Description", "Classification", "Paleoecology", "Research history", "Current interpretation"][idx] || `Section ${idx + 1}`;
      section.appendChild(h);
      const p = document.createElement("p");
      p.className = "section-paragraph";
      p.textContent = text;
      section.appendChild(p);
      speciesViewSectionsEl.appendChild(section);
    });
  }

  if (Array.isArray(references) && references.length > 0) {
    const refSection = document.createElement("section");
    refSection.className = "detail-subsection";
    const h = document.createElement("h4");
    h.className = "detail-subtitle";
    h.textContent = "References";
    refSection.appendChild(h);

    const list = document.createElement("ol");
    list.className = "species-link-list";
    references.forEach((ref) => {
      if (!ref?.url) return;
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.className = "read-link";
      link.href = ref.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = ref.title || ref.url;
      li.appendChild(link);
      list.appendChild(li);
    });
    if (list.children.length > 0) {
      refSection.appendChild(list);
      speciesViewSectionsEl.appendChild(refSection);
    }
  }
}

function renderSpeciesProfile(base, detail, speciesName, profile, extraSections = [], extraReferences = []) {
  if (!speciesViewFactsEl || !speciesViewSectionsEl) return;
  speciesViewFactsEl.innerHTML = "";
  speciesViewSectionsEl.innerHTML = "";

  const scientific = detail?.scientificData || {};
  const taxonomy = profile?.taxonomy && typeof profile.taxonomy === "object" ? profile.taxonomy : {};

  addSpeciesFact("Species", speciesName);
  addSpeciesFact("Genus", profile?.genus || detail?.name || base?.name || "Unknown");
  addSpeciesFact("Type", profile?.type || base?.type || scientific.type || "Unknown");
  addSpeciesFact("Temporal range", profile?.temporalRange || scientific.period || base?.period || "Unknown");
  addSpeciesFact("Location", profile?.location || scientific.location || base?.where || "Unknown");
  addSpeciesFact("Diet", profile?.diet || scientific.diet || base?.diet || "Unknown");
  if (profile?.namedBy) addSpeciesFact("Named by", profile.namedBy);
  if (profile?.nameMeaning) addSpeciesFact("Name meaning", profile.nameMeaning);
  const sectionCount = Array.isArray(profile?.sections) ? profile.sections.length : 0;
  const refCount = (Array.isArray(profile?.references) ? profile.references.length : 0) + (Array.isArray(extraReferences) ? extraReferences.length : 0);
  addSpeciesFact("Depth score", `${Math.min(100, 20 + sectionCount * 8 + refCount * 2)}/100`);

  Object.entries(taxonomy).forEach(([rank, value]) => {
    if (!value) return;
    addSpeciesFact(prettyTitle(rank), value);
  });

  const sections = Array.isArray(profile?.sections) ? profile.sections : [];
  sections.forEach((entry) => {
    if (!entry || !entry.text) return;
    const section = document.createElement("section");
    section.className = "detail-subsection";
    const h = document.createElement("h4");
    h.className = "detail-subtitle";
    h.textContent = entry.title || "Section";
    section.appendChild(h);
    const p = document.createElement("p");
    p.className = "section-paragraph";
    renderLinkedText(p, normalizeSentence(entry.text), dinoId);
    section.appendChild(p);
    speciesViewSectionsEl.appendChild(section);
  });

  const importedSections = Array.isArray(extraSections) ? extraSections.filter((s) => s?.text) : [];
  if (importedSections.length > 0) {
    const importedHeader = document.createElement("section");
    importedHeader.className = "detail-subsection";
    const h = document.createElement("h4");
    h.className = "detail-subtitle";
    h.textContent = "Extended species notes";
    importedHeader.appendChild(h);
    const p = document.createElement("p");
    p.className = "section-paragraph";
    p.textContent = "Imported from species-level literature summaries to deepen context beyond the local profile.";
    importedHeader.appendChild(p);
    speciesViewSectionsEl.appendChild(importedHeader);

    importedSections.slice(0, 5).forEach((entry) => {
      const section = document.createElement("section");
      section.className = "detail-subsection";
      const sh = document.createElement("h4");
      sh.className = "detail-subtitle";
      sh.textContent = entry.title || "Imported section";
      section.appendChild(sh);
      const sp = document.createElement("p");
      sp.className = "section-paragraph";
      renderLinkedText(sp, normalizeSentence(entry.text), dinoId);
      section.appendChild(sp);
      speciesViewSectionsEl.appendChild(section);
    });
  }

  const refs = [
    ...(Array.isArray(profile?.references) ? profile.references : []),
    ...(Array.isArray(extraReferences) ? extraReferences : [])
  ].filter(Boolean);
  if (refs.length > 0) {
    const refSection = document.createElement("section");
    refSection.className = "detail-subsection";
    const h = document.createElement("h4");
    h.className = "detail-subtitle";
    h.textContent = "References";
    refSection.appendChild(h);

    const list = document.createElement("ol");
    list.className = "species-link-list";
    const seen = new Set();
    refs.forEach((ref) => {
      const key = String(ref?.url || ref?.title || "").trim().toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      const li = document.createElement("li");
      const title = textFix(String(ref?.title || "Reference"));
      const url = textFix(String(ref?.url || ""));
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.className = "read-link";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = title;
        li.appendChild(link);
      } else {
        li.textContent = title;
      }
      const sourceParts = [ref?.source, ref?.year].filter(Boolean).join(", ");
      if (sourceParts) {
        const meta = document.createElement("span");
        meta.className = "search-count";
        meta.textContent = ` (${sourceParts})`;
        li.appendChild(meta);
      }
      list.appendChild(li);
    });
    refSection.appendChild(list);
    speciesViewSectionsEl.appendChild(refSection);
  }
}

function loadInformalTaxaView(base, activeName, taxa) {
  setViewMode("informal");
  if (speciesViewTitleEl) speciesViewTitleEl.textContent = `${activeName} informal taxa`;
  if (speciesViewOverviewEl) {
    speciesViewOverviewEl.textContent =
      "These names are informal, undescribed, or pending formal publication. They are listed for research tracking only.";
  }
  if (speciesViewFactsEl) speciesViewFactsEl.innerHTML = "";
  if (speciesViewSectionsEl) speciesViewSectionsEl.innerHTML = "";
  if (speciesViewGalleryEl) speciesViewGalleryEl.innerHTML = "";

  addSpeciesFact("Genus", activeName);
  addSpeciesFact("Entry type", "Informal / undescribed taxa");
  addSpeciesFact("Count", String(taxa.length));

  const section = document.createElement("section");
  section.className = "detail-subsection";
  const h = document.createElement("h4");
  h.className = "detail-subtitle";
  h.textContent = "Tracked informal taxa";
  section.appendChild(h);

  const list = document.createElement("ul");
  list.className = "species-link-list";
  taxa.forEach((item) => {
    const li = document.createElement("li");
    if (item && typeof item === "object") {
      const label = document.createElement("strong");
      label.textContent = item.name || "Unnamed taxon";
      li.appendChild(label);
      if (item.note) li.appendChild(document.createTextNode(` - ${item.note}`));
      if (item.reference) {
        li.appendChild(document.createTextNode(" "));
        const link = document.createElement("a");
        link.className = "read-link";
        link.href = item.reference;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "[reference]";
        li.appendChild(link);
      }
    } else {
      li.textContent = String(item);
    }
    list.appendChild(li);
  });
  section.appendChild(list);
  speciesViewSectionsEl.appendChild(section);
}

function setViewMode(mode) {
  activeViewMode = mode;
  const isSpecies = mode !== "overview";

  if (speciesViewEl) speciesViewEl.hidden = !isSpecies;
  if (dinoInsightEl) dinoInsightEl.hidden = isSpecies;
  if (sectionNavEl) sectionNavEl.hidden = isSpecies;
  if (sectionsEl) sectionsEl.hidden = isSpecies;
  if (galleryBlockEl) galleryBlockEl.hidden = isSpecies;
  if (relatedBlockEl) relatedBlockEl.hidden = isSpecies;
  speciesTabButtons.forEach((btn) => {
    const isActive = btn.dataset.tabKey === mode;
    btn.classList.toggle("species-choice-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });
}

function renderSpeciesGallery(images, speciesName) {
  if (!speciesViewGalleryEl) return;
  speciesViewGalleryEl.innerHTML = "";
  const used = new Set();

  images
    .filter((img) => img?.url)
    .filter((img) => {
      const key = imageDedupKey(img.url);
      if (!key || used.has(key)) return false;
      used.add(key);
      return true;
    })
    .slice(0, 8)
    .forEach((img) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-figure";

      const image = document.createElement("img");
      image.className = "gallery-thumb";
      image.src = img.url;
      image.alt = `${speciesName} image`;
      image.loading = "lazy";
      image.onerror = async () => {
        image.onerror = null;
        const byName = await getWikiThumbByName(speciesName);
        if (byName) {
          image.src = byName;
          return;
        }
        const byGenus = await getWikiThumbByName(extractGenus(speciesName));
        image.src = byGenus || "images/no-image.svg";
      };
      figure.appendChild(image);

      const cap = document.createElement("figcaption");
      cap.className = "gallery-caption";
      cap.textContent = img.caption || `${speciesName} image`;
      figure.appendChild(cap);

      speciesViewGalleryEl.appendChild(figure);
    });
}

async function loadSpeciesView(speciesName) {
  setViewMode(speciesName);
  if (speciesViewTitleEl) speciesViewTitleEl.textContent = speciesName;
  if (speciesViewOverviewEl) speciesViewOverviewEl.textContent = "Loading species overview...";
  if (speciesViewFactsEl) speciesViewFactsEl.innerHTML = "";
  if (speciesViewSectionsEl) speciesViewSectionsEl.innerHTML = "";

  const localProfile = getLocalSpeciesProfile(speciesName);
  const summary = await fetchSpeciesSummary(speciesName);
  const longExtract = await fetchSpeciesLongExtract(speciesName);
  const wikiSections = await fetchSpeciesWikipediaSections(speciesName);
  const references = await fetchSpeciesReferences(speciesName);
  const commons = await fetchSpeciesCommonsImages(speciesName);
  const lead = summary?.originalimage?.source || summary?.thumbnail?.source || "";
  const images = [];
  if (Array.isArray(localProfile?.images)) {
    localProfile.images
      .filter((img) => img?.url)
      .forEach((img) => images.push({ url: img.url, caption: img.caption || `${speciesName} image` }));
  }
  if (lead) images.push({ url: lead, caption: `${speciesName} lead image` });
  images.push(...commons);
  renderSpeciesGallery(images, speciesName);

  if (speciesViewOverviewEl) {
    speciesViewOverviewEl.textContent =
      localProfile?.overview ||
      summary?.extract ||
      `${speciesName} is shown here as a species-level view linked to its genus article for direct comparison.`;
  }

  if (localProfile) renderSpeciesProfile(currentBase, currentDetail, speciesName, localProfile, wikiSections, references);
  else renderSpeciesDetails(currentBase, currentDetail, speciesName, summary, longExtract, wikiSections, references);
}

async function setupSpeciesChooser(base, activeName) {
  if (!speciesChooserEl) return;
  speciesChooserEl.innerHTML = "";
  speciesTabButtons = [];

  const baseId = String(base?.id || "").toLowerCase();
  if (baseId === "pigeon") {
    speciesChooserEl.hidden = true;
    return;
  }

  const record = speciesIndexMap.get(base?.id || "");
  const localSpecies = Array.isArray(record?.species) ? record.species : [];
  const fetched = await fetchSpeciesForGenusName(activeName);
  const speciesEntries = buildSpeciesEntries(localSpecies, fetched);

  const canShowChooser = speciesEntries.length > 1;
  if (!canShowChooser) {
    speciesChooserEl.hidden = true;
    return;
  }

  speciesChooserEl.hidden = false;
  speciesChooserEl.classList.add("species-chooser-ready");

  const chooserHeader = document.createElement("div");
  chooserHeader.className = "species-chooser-header";

  const label = document.createElement("strong");
  label.textContent = `${activeName} species`;
  chooserHeader.appendChild(label);

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "species-chooser-toggle";
  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.setAttribute("aria-label", "Show species options");
  toggleBtn.innerHTML = '<span class="species-chooser-arrow" aria-hidden="true">▾</span>';
  chooserHeader.appendChild(toggleBtn);

  speciesChooserEl.appendChild(chooserHeader);

  const menu = document.createElement("div");
  menu.className = "species-chooser-menu";
  menu.hidden = true;
  menu.setAttribute("role", "tablist");

  const overviewBtn = document.createElement("button");
  overviewBtn.type = "button";
  overviewBtn.className = "species-choice";
  overviewBtn.setAttribute("role", "tab");
  overviewBtn.dataset.tabKey = "overview";
  overviewBtn.setAttribute("aria-selected", "true");
  overviewBtn.textContent = "Genus overview";
  overviewBtn.addEventListener("click", () => {
    setViewMode("overview");
    menu.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  });
  speciesTabButtons.push(overviewBtn);
  menu.appendChild(overviewBtn);

  if (speciesEntries.length > 1) {
    speciesEntries.forEach((entry) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "species-choice";
      btn.setAttribute("role", "tab");
      btn.dataset.tabKey = entry.name;
      btn.setAttribute("aria-selected", "false");
      btn.addEventListener("click", () => {
        loadSpeciesView(entry.name);
        menu.hidden = true;
        toggleBtn.setAttribute("aria-expanded", "false");
      });
      const label = document.createElement("span");
      label.textContent = entry.name;
      const badge = document.createElement("span");
      badge.className = "species-source-badge";
      badge.textContent = entry.source;
      btn.append(label, badge);
      speciesTabButtons.push(btn);
      menu.appendChild(btn);
    });
  }

  toggleBtn.addEventListener("click", () => {
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    toggleBtn.setAttribute("aria-expanded", String(willOpen));
  });

  speciesChooserEl.appendChild(menu);
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
function renderGeneratedDeepDive(base, detail, dinoName) {
  const scientific = detail?.scientificData || {};
  const period = scientific.period || base.period || "an uncertain interval";
  const region = scientific.location || base.where || "uncertain regions";
  const diet = scientific.diet || base.diet || "an uncertain diet";
  const type = base.type || scientific.type || "prehistoric reptile";
<<<<<<< HEAD
  const coverage = computeArticleCoverage(base, detail);
  const qualityKeys = ["period", "location", "diet", "classification", "length", "height", "weight", "speed"];
  const knownCore = qualityKeys.filter((key) => hasSubstantiveData(scientific[key])).length;

  if (knownCore < 3) {
    renderGeneratedSection(
      "research-status",
      "Research status",
      `${dinoName} is currently represented by limited published measurements in this entry. Dino-pedia will expand this page as stronger specimen-level data and peer-reviewed estimates become available.`
    );
    return;
  }

  if (coverage.missingCore.length > 0) {
    const topMissing = coverage.missingCore.slice(0, 5).map((k) => prettyTitle(k).toLowerCase()).join(", ");
    renderGeneratedSection(
      "improve-priority",
      "What to improve next",
      `Highest-priority gaps for ${dinoName} are ${topMissing}. Filling these with specimen-level ranges and cited studies will raise evidence quality faster than adding generic narrative text.`
    );
  }
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935

  renderGeneratedSection(
    "ecosystem-context",
    "Ecosystem context",
    `${dinoName} lived during ${period} in ${region}. As a ${String(type).toLowerCase()} with a ${String(diet).toLowerCase()} feeding strategy, it occupied a specific ecological role shaped by prey availability, climate, and competition with other large vertebrates.`
  );

  renderGeneratedSection(
    "evidence-strength",
    "Evidence and certainty",
    `Interpretations for ${dinoName} combine direct fossil material with comparative anatomy and biomechanical inference. Some traits are strongly supported by specimen evidence, while behavior, coloration, and social dynamics are reconstructed with moderate uncertainty and may shift with new discoveries.`
  );

  renderGeneratedSection(
    "research-directions",
    "Research directions",
    `Active research themes for ${dinoName} include growth-stage variation, regional population differences, feeding mechanics, and habitat reconstruction. Dino-pedia tracks these themes so readers can compare anatomical evidence, paleoenvironment, and competing interpretations in one focused dinosaur-first reference.`
  );

  renderGeneratedSection(
    "feeding-analysis",
    "Feeding strategy analysis",
<<<<<<< HEAD
    `${dinoName} is generally understood as a ${String(diet).toLowerCase()} organism. Functional interpretation uses jaw mechanics, tooth form, body-mass scaling, and associated fauna where available. Evidence quality varies by specimen completeness, but most reconstructions indicate a specialized feeding profile rather than a fully generalized one.`
=======
    `${dinoName} is interpreted as a ${String(diet).toLowerCase()} organism. Functional interpretation uses jaw mechanics, tooth form, body-mass scaling, and associated fauna where available. Evidence quality varies by specimen completeness, but most reconstructions indicate a specialized feeding profile rather than a fully generalized one.`
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  );

  renderGeneratedSection(
    "life-history",
    "Life history and growth",
    `Life-history reconstruction for ${dinoName} combines growth-stage fossils, bone histology, and comparisons with living archosaurs. Juvenile and adult stages may have occupied different ecological roles, reducing direct competition within species and changing movement, prey choice, and vulnerability over time.`
  );

  renderGeneratedSection(
    "paleoenvironment-pressures",
    "Paleoenvironment pressures",
    `${dinoName} is associated with ${region} during ${period}. Environmental pressures likely included seasonal resource variation, habitat change across local basins, and sustained interspecific competition. These conditions shaped mobility, foraging windows, and long-term survival strategy.`
  );

  renderGeneratedSection(
    "dino-pedia-value",
    "Why Dino-pedia adds value",
    `This article prioritizes prehistoric-focused synthesis: timeline context, specimen-linked interpretation, and direct cross-links to related taxa. The goal is deeper dinosaur-first reading and comparison, not broad general coverage.`
  );
}

function createInlineFigure(item, title, side = "right", usedInlineKeys = new Set()) {
  const figure = document.createElement("figure");
  figure.className = `detail-figure ${side === "left" ? "detail-figure-left" : "detail-figure-right"}`;

  const cap = document.createElement("figcaption");
  cap.className = "detail-figure-caption";
  cap.textContent = textFix(String(item.caption || `${title} reference image`));

  const img = document.createElement("img");
  img.className = "detail-figure-img";
  img.src = item.url;
  img.alt = `${title} reference image`;
  img.loading = "lazy";
<<<<<<< HEAD
  img.onerror = async () => {
    img.onerror = null;
    const byName = await getWikiThumbByName(title);
    const byNameKey = imageDedupKey(byName);
    if (byName && byNameKey && !usedInlineKeys.has(byNameKey)) {
      usedInlineKeys.add(byNameKey);
      img.src = byName;
      cap.textContent = `${title} reference image`;
      return;
    }
    const byGenus = await getWikiThumbByName(extractGenus(title));
    const byGenusKey = imageDedupKey(byGenus);
    if (byGenus && byGenusKey && !usedInlineKeys.has(byGenusKey)) {
      usedInlineKeys.add(byGenusKey);
      img.src = byGenus;
      cap.textContent = `${extractGenus(title)} reference image`;
      return;
    }
    const blocked = new Set([imageDedupKey(item.url), ...usedInlineKeys]);
    const local = pickLocalFallback(blocked, dinoId);
=======
  img.onerror = () => {
    img.onerror = null;
    const blocked = new Set([imageDedupKey(item.url), ...usedInlineKeys]);
    const local = pickLocalFallback(blocked);
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    if (!local) {
      figure.remove();
      return;
    }
    usedInlineKeys.add(imageDedupKey(local.url));
    img.src = local.url;
    cap.textContent = local.caption;
  };
  figure.appendChild(img);
  figure.appendChild(cap);

  return figure;
}

function scoreCaptionForTopic(caption, topic) {
  const text = String(caption || "").toLowerCase();
  const topicMap = {
    size: ["size", "scale", "comparison", "human", "length", "height"],
    skull: ["skull", "head", "cranium", "jaw", "teeth"],
    appearance: ["restoration", "life", "artist", "appearance"],
    classification: ["cladogram", "taxonomy", "classification"],
    history: ["specimen", "museum", "holotype", "discovery", "field"]
  };

  const keys = topicMap[topic] || [topic];
  return keys.reduce((score, key) => (text.includes(key) ? score + 1 : score), 0);
}

function pickImageForTopic(topic, used) {
  let best = null;
  let bestScore = -1;

  latestGalleryItems.forEach((item) => {
    if (used.has(imageDedupKey(item.url))) return;
    const score = scoreCaptionForTopic(item.caption, topic);
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  });

  return best || null;
}

function injectSectionFigures(title) {
  if (!sectionsEl) return;

  sectionsEl.querySelectorAll(".detail-figure").forEach((node) => node.remove());
  if (!Array.isArray(latestGalleryItems) || latestGalleryItems.length === 0) return 0;

  const sectionTargets = [...sectionsEl.querySelectorAll(".detail-section")];
  if (sectionTargets.length === 0) return 0;

  const usedSourceKeys = new Set();
  const ordered = [];

  sectionTargets.forEach((section) => {
    const sectionHeading = section.querySelector("h3")?.textContent?.toLowerCase() || "";
    const firstSub = section.querySelector(".detail-subsection");
    const topic = firstSub?.dataset?.topic || sectionHeading;
    const pick = pickImageForTopic(topic, usedSourceKeys) || latestGalleryItems.find((item) => !usedSourceKeys.has(imageDedupKey(item.url)));
    if (!pick) return;
    const key = imageDedupKey(pick.url);
    if (!key || usedSourceKeys.has(key)) return;
    usedSourceKeys.add(key);
    ordered.push(pick);
  });

  latestGalleryItems.forEach((item) => {
    const key = imageDedupKey(item.url);
    if (!key || usedSourceKeys.has(key)) return;
    usedSourceKeys.add(key);
    ordered.push(item);
  });

  const usedInlineKeys = new Set();
  const renderedKeys = new Set();
  const uniqueOrdered = ordered.filter((image) => {
    const key = imageDedupKey(image.url);
    if (!key || renderedKeys.has(key)) return false;
    renderedKeys.add(key);
    return true;
  }).slice(0, 12);

  uniqueOrdered.forEach((image, idx) => {
    const side = idx % 2 === 0 ? "right" : "left";
    usedInlineKeys.add(imageDedupKey(image.url));
    const figure = createInlineFigure(image, title, side, usedInlineKeys);
    const target = sectionTargets[idx];
    const firstSub = target.querySelector(".detail-subsection");
    const subHeading = firstSub?.querySelector?.(".detail-subtitle");
    const sectionHeading = target.querySelector?.("h3");
    if (firstSub && subHeading && subHeading.nextSibling) firstSub.insertBefore(figure, subHeading.nextSibling);
    else if (firstSub) firstSub.appendChild(figure);
    else if (sectionHeading && sectionHeading.nextSibling) target.insertBefore(figure, sectionHeading.nextSibling);
    else target.appendChild(figure);
  });

  return uniqueOrdered.length;
}

function imageDedupKey(url) {
  const raw = String(url || "").trim().toLowerCase();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || parsed.pathname;
  } catch {
    const noQuery = raw.split("?")[0];
    const parts = noQuery.split("/").filter(Boolean);
    return parts[parts.length - 1] || noQuery;
  }
}

function imageCategoryFromCaption(caption) {
  const text = String(caption || "").toLowerCase();
  if (/(size|scale|comparison|human)/.test(text)) return "size";
  if (/(skull|cranium|jaw|teeth|head)/.test(text)) return "skull";
  if (/(restoration|life|artist|reconstruction)/.test(text)) return "restoration";
  if (/(specimen|holotype|museum|sue|stan|scotty|wyrex)/.test(text)) return "specimen";
  if (/(track|footprint|trace)/.test(text)) return "trace";
  return "other";
}

function diversifyImageSet(items, maxCount = 16) {
  const source = Array.isArray(items) ? items : [];
  const grouped = new Map();
  source.forEach((item) => {
    const cat = imageCategoryFromCaption(item.caption);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(item);
  });

  const preferred = ["size", "skull", "restoration", "specimen", "trace", "other"];
  const out = [];
  const used = new Set();

  preferred.forEach((cat) => {
    const list = grouped.get(cat) || [];
    const pick = list.find((x) => !used.has(imageDedupKey(x.url)));
    if (!pick) return;
    used.add(imageDedupKey(pick.url));
    out.push(pick);
  });

  source.forEach((item) => {
    if (out.length >= maxCount) return;
    const key = imageDedupKey(item.url);
    if (!key || used.has(key)) return;
    used.add(key);
    out.push(item);
  });

  return out.slice(0, maxCount);
}

function ensureMinimumImages(items, minimum = 10) {
  const out = [...(Array.isArray(items) ? items : [])];
  return out.slice(0, minimum);
}

<<<<<<< HEAD
function pickLocalFallback(excluded = new Set(), entryId = dinoId) {
  const byEntry = Array.isArray(LOCAL_FALLBACK_IMAGES_BY_ID[entryId])
    ? LOCAL_FALLBACK_IMAGES_BY_ID[entryId]
    : [];
  const merged = [...byEntry, ...LOCAL_FALLBACK_IMAGES];
  for (const candidate of merged) {
=======
function pickLocalFallback(excluded = new Set()) {
  for (const candidate of LOCAL_FALLBACK_IMAGES) {
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    const key = imageDedupKey(candidate.url);
    if (!key || excluded.has(key)) continue;
    return candidate;
  }
  return null;
}

function isRelevantImageForEntry(item, title, idKey = "") {
  const caption = String(item?.caption || "").toLowerCase();
  const urlKey = imageDedupKey(item?.url || "");
  const currentName = String(title || "").toLowerCase();
  const currentGenus = currentName.split(/\s+/)[0] || "";
  const text = `${caption} ${urlKey}`;

  const aliasById = {
    trex: ["sue", "stan", "scotty", "wyrex", "b-rex"],
    "tyrannosaurus-rex": ["sue", "stan", "scotty", "wyrex", "b-rex"]
  };
  const aliases = aliasById[idKey] || [];

  if (currentName && text.includes(currentName)) return true;
  if (currentGenus && text.includes(currentGenus)) return true;
  if (aliases.some((a) => text.includes(a))) return true;

  // strict mode: must explicitly reference this taxon (or known alias)
  return false;
}

function mentionsOtherKnownGenus(text, currentGenus) {
  return knownGenera.some((g) => g && g !== currentGenus && text.includes(g));
}

function isMediumRelevantImageForEntry(item, title, idKey = "") {
  const caption = String(item?.caption || "").toLowerCase();
  const urlKey = imageDedupKey(item?.url || "");
  const currentName = String(title || "").toLowerCase();
  const currentGenus = currentName.split(/\s+/)[0] || "";
  const text = `${caption} ${urlKey}`;

  const aliasById = {
    trex: ["sue", "stan", "scotty", "wyrex", "b-rex"],
    "tyrannosaurus-rex": ["sue", "stan", "scotty", "wyrex", "b-rex"]
  };
  const aliases = aliasById[idKey] || [];

  if (currentName && text.includes(currentName)) return true;
  if (currentGenus && text.includes(currentGenus)) return true;
  if (aliases.some((a) => text.includes(a))) return true;

  if (mentionsOtherKnownGenus(text, currentGenus)) return false;

  return /(dinosaur|theropod|sauropod|ceratops|fossil|skeleton|skull|jaw|teeth|specimen|museum|restoration|reconstruction|size|comparison)/.test(text);
}

function filterRelevantImages(items, title, idKey = "") {
  const source = Array.isArray(items) ? items : [];
  const relevant = source.filter((item) => isRelevantImageForEntry(item, title, idKey));
  if (relevant.length >= 3) return relevant;

  const medium = source.filter((item) => isMediumRelevantImageForEntry(item, title, idKey));
  if (medium.length >= 2) return medium;

  return source;
}

function extractGenus(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

async function loadCommonsSearchImages(query, limit = 16) {
  const q = String(query || "").trim();
  if (!q) return [];
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=${Math.min(limit, 20)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    const pages = Object.values(data?.query?.pages || {});
    return pages
      .map((p) => {
        const ii = p?.imageinfo?.[0];
        return {
          url: ii?.thumburl || ii?.url || "",
          caption: textFix(String(p?.title || "").replace(/^File:/i, "").replace(/[_]+/g, " "))
        };
      })
      .filter((x) => x.url);
  } catch {
    return [];
  }
}

async function loadVariantThumbs(title) {
  const variants = [
    title,
    `${title} skull`,
    `${title} skeleton`,
    `${title} size comparison`,
    `${title} life restoration`,
    `${title} specimen`
  ];

  const out = [];
  for (const query of variants) {
    const thumb = await getWikiThumbByName(query);
    if (!thumb) continue;
    out.push({ url: thumb, caption: `${query} image` });
  }
  return out;
}

function toPronunciation(name) {
  return name
    .replace(/ae/gi, "ay")
    .replace(/oe/gi, "ee")
    .replace(/c([eiy])/gi, "s$1")
    .replace(/ph/gi, "f");
}

function buildNameGuide(base, detail) {
  const name = detail?.name || base.name;
  pronunciationEl.textContent = `Pronunciation: ${toPronunciation(name)} (approx.)`;
  etymologyEl.textContent = `Name origin: ${name} likely derives from Greek/Latin roots used in paleontological naming conventions.`;
}

function updateContactLinks(name) {
  const articleName = String(name || "this article").trim();
  const currentUrl = window.location.href;

  if (reportOutdatedBtn) {
    reportOutdatedBtn.href =
      `mailto:jaxbarrett2020@gmail.com?subject=${encodeURIComponent(`Dino-pedia outdated info: ${articleName}`)}` +
      `&body=${encodeURIComponent(`Hi Dino-pedia,\n\nI found outdated information in the ${articleName} article.\n\nArticle URL: ${currentUrl}\n\nWhat looks outdated:\n\nSuggested update:\n\nThanks.`)}`;
  }

  if (requestEditBtn) {
    requestEditBtn.href =
      `mailto:jaxbarrett2020@gmail.com?subject=${encodeURIComponent(`Dino-pedia request/edit: ${articleName}`)}` +
      `&body=${encodeURIComponent(`Hi Dino-pedia,\n\nI want to request a new dinosaur article or edit the ${articleName} article.\n\nArticle URL: ${currentUrl}\n\nRequested dinosaur/article:\n\nRequested changes:\n\nThanks.`)}`;
  }
}

function buildDinoInsight(base, detail) {
  if (!dinoInsightEl) return;

  const name = detail?.name || base?.name || "This animal";
  const scientific = detail?.scientificData || {};
<<<<<<< HEAD
  const period = humanizeField(scientific.period || base?.period, "an uncertain period");
  const diet = humanizeField(scientific.diet || base?.diet, "an uncertain diet");
  const location = humanizeField(scientific.location || base?.where, "uncertain regions");
  const type = humanizeField(base?.type || scientific.type, "prehistoric animal");
  const length = !isUnknownLike(scientific.length) ? `Length estimates include ${scientific.length}.` : "";
  const weight = !isUnknownLike(scientific.weight) ? `Mass estimates include ${scientific.weight}.` : "";

  const qualityFields = [
    scientific.period,
    scientific.location,
    scientific.diet,
    scientific.classification,
    scientific.length,
    scientific.height,
    scientific.weight,
    scientific.speed
  ];
  const unknownCount = qualityFields.filter((v) => isUnknownLike(v)).length;
  const qualityLabel = unknownCount <= 2 ? "High-detail profile" : unknownCount <= 5 ? "Moderate-detail profile" : "Limited-detail profile";
=======
  const period = scientific.period || base?.period || "an uncertain period";
  const diet = scientific.diet || base?.diet || "an uncertain diet";
  const location = scientific.location || base?.where || "uncertain regions";
  const type = base?.type || scientific.type || "prehistoric reptile";
  const length = scientific.length ? `Length estimates include ${scientific.length}.` : "";
  const weight = scientific.weight ? `Mass estimates include ${scientific.weight}.` : "";
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935

  dinoInsightEl.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = "Dino-pedia Notes";

<<<<<<< HEAD
  const quality = document.createElement("p");
  quality.className = "search-count";
  quality.textContent = qualityLabel;

  const para = document.createElement("p");
  renderLinkedText(
    para,
    `${name} is currently understood as a ${diet.toLowerCase()} ${String(type).toLowerCase()} from ${period}, documented from ${location}. ${length} ${weight} This article combines index data, detailed notes, and linked taxa so you can compare evidence in one place.`,
    dinoId
  );

  dinoInsightEl.append(heading, quality, para);
=======
  const para = document.createElement("p");
  renderLinkedText(
    para,
    `${name} is currently interpreted as a ${diet.toLowerCase()} ${String(type).toLowerCase()} from ${period}, documented from ${location}. ${length} ${weight} This article combines index data, detailed entry notes, and linked related taxa so you can compare evidence quickly in one place.`,
    dinoId
  );

  dinoInsightEl.append(heading, para);
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
}

function buildTags(base, detail) {
  tagsEl.innerHTML = "";
  const tags = new Set();

<<<<<<< HEAD
  if (base?.hidden) tags.add("Secret");
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  if (base.period) tags.add(base.period);
  if (base.diet) tags.add(base.diet);
  if (base.where) tags.add(base.where);
  if (base.type) tags.add(base.type);

  const classification = detail?.scientificData?.classification;
  if (classification) tags.add(classification);
<<<<<<< HEAD
  if (Array.isArray(detail?.tags)) {
    detail.tags.filter(Boolean).forEach((tag) => tags.add(String(tag)));
  }

  Object.keys(detail || {})
    .filter((key) => !["name", "image", "overview", "tags"].includes(key))
=======

  Object.keys(detail || {})
    .filter((key) => !["name", "image", "overview"].includes(key))
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    .forEach((key) => tags.add(prettyTitle(key)));

  [...tags].slice(0, 14).forEach((tag) => {
    const span = document.createElement("span");
    span.className = "chip tag-chip";
    span.textContent = tag;
    tagsEl.appendChild(span);
  });
}

function buildRelated(base) {
  relatedLinksEl.innerHTML = "";

  const related = allDinosaurs
    .filter((d) => d.id !== base.id)
    .map((d) => {
      let score = 0;
      if (d.diet && d.diet === base.diet) score += 2;
      if (d.period && d.period === base.period) score += 2;
      if (d.where && d.where === base.where) score += 1;
      return { d, score };
    })
    .sort((a, b) => b.score - a.score || a.d.name.localeCompare(b.d.name))
    .slice(0, 6)
    .map((x) => x.d);

  if (related.length === 0) {
    relatedLinksEl.textContent = "No related entries found.";
    return;
  }

  related.forEach((d) => {
    const link = document.createElement("a");
    link.className = "related-link";
    link.href = `dino.html?dino=${encodeURIComponent(d.id)}`;
    link.textContent = d.name;
    relatedLinksEl.appendChild(link);
  });
}

function syncToolbarButtons() {
  const favorites = getFavorites();
  const compare = getCompare();

  favBtn.textContent = favorites.has(dinoId) ? "★ Favorited" : "☆ Favorite";
  compareBtn.textContent = compare.includes(dinoId) ? "Compared" : "+ Compare";
}

function toggleFavorite() {
  const favorites = getFavorites();
  if (favorites.has(dinoId)) favorites.delete(dinoId);
  else favorites.add(dinoId);
  saveFavorites(favorites);
  syncToolbarButtons();
}

function toggleCompare() {
  const compare = getCompare();
  const idx = compare.indexOf(dinoId);

  if (idx >= 0) compare.splice(idx, 1);
  else if (compare.length < 4) compare.push(dinoId);
  else {
    alert("Compare supports up to 4 dinosaurs.");
    return;
  }

  saveCompare(compare);
  syncToolbarButtons();
}

function showError(message) {
  titleEl.textContent = "Dinosaur not found";
  overviewEl.textContent = message;
  imageEl.style.display = "none";
  quickFactsEl.innerHTML = "";
  sectionsEl.innerHTML = "";
  sectionNavEl.innerHTML = "";
  relatedLinksEl.innerHTML = "";
  tagsEl.innerHTML = "";
  pronunciationEl.textContent = "";
  etymologyEl.textContent = "";
  if (dinoInsightEl) dinoInsightEl.textContent = "";
<<<<<<< HEAD
  if (speciesChooserEl) {
    speciesChooserEl.hidden = true;
    speciesChooserEl.innerHTML = "";
  }
  if (speciesViewEl) {
    speciesViewEl.hidden = true;
  }
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  if (galleryBlockEl) galleryBlockEl.hidden = false;
  clearArticleSearchHighlights();
}

function clearArticleSearchHighlights() {
  if (!articleContentEl) return;
  articleContentEl.querySelectorAll("mark.article-hit").forEach((mark) => {
    const textNode = document.createTextNode(mark.textContent || "");
    mark.replaceWith(textNode);
  });
  articleSearchHits = [];
  activeSearchHit = -1;
  if (articleSearchCountEl) articleSearchCountEl.textContent = "0 matches";
}

function highlightInNode(node, regex) {
  const text = node.nodeValue || "";
  regex.lastIndex = 0;
  if (!regex.test(text)) return null;

  const frag = document.createDocumentFragment();
  regex.lastIndex = 0;
  let last = 0;
  let match = null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) frag.appendChild(document.createTextNode(text.slice(last, match.index)));
    const mark = document.createElement("mark");
    mark.className = "article-hit";
    mark.textContent = match[0];
    frag.appendChild(mark);
    last = match.index + match[0].length;
  }

  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  return frag;
}

function runArticleSearch(term) {
  clearArticleSearchHighlights();
  const query = String(term || "").trim();
  if (!articleContentEl || query.length < 2) return;

  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const walker = document.createTreeWalker(articleContentEl, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node?.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      const parentTag = node.parentElement?.tagName?.toLowerCase();
      if (["script", "style", "button", "input", "select", "textarea"].includes(parentTag)) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest(".article-search-block")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const frag = highlightInNode(node, regex);
    if (frag) node.parentNode.replaceChild(frag, node);
  });

  articleSearchHits = [...articleContentEl.querySelectorAll("mark.article-hit")];

  if (articleSearchCountEl) {
    articleSearchCountEl.textContent = `${articleSearchHits.length} match${articleSearchHits.length === 1 ? "" : "es"}`;
  }

  if (articleSearchHits.length > 0) {
    activeSearchHit = 0;
    focusSearchHit(0);
  }
}

function focusSearchHit(index) {
  if (!articleSearchHits.length) return;
  const normalized = (index + articleSearchHits.length) % articleSearchHits.length;
  activeSearchHit = normalized;
  articleSearchHits.forEach((el, i) => el.classList.toggle("article-hit-active", i === normalized));
  articleSearchHits[normalized].scrollIntoView({ behavior: "smooth", block: "center" });
}

function bindArticleSearchEvents() {
  if (!articleSearchInput) return;

  articleSearchInput.addEventListener("input", () => runArticleSearch(articleSearchInput.value));
  articleSearchNextBtn?.addEventListener("click", () => focusSearchHit(activeSearchHit + 1));
  articleSearchPrevBtn?.addEventListener("click", () => focusSearchHit(activeSearchHit - 1));
  articleSearchClearBtn?.addEventListener("click", () => {
    articleSearchInput.value = "";
    clearArticleSearchHighlights();
  });
}

function bindToolbarEvents() {
  favBtn.addEventListener("click", toggleFavorite);
  compareBtn.addEventListener("click", toggleCompare);
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", async () => {
      const targetUrl = window.location.href;
      try {
        await navigator.clipboard.writeText(targetUrl);
        copyLinkBtn.textContent = "Copied";
        window.setTimeout(() => {
          copyLinkBtn.textContent = "Copy link";
        }, 1200);
      } catch {
        window.prompt("Copy this article link:", targetUrl);
      }
    });
  }
  printBtn.addEventListener("click", () => window.print());
}

function renderGalleryItems(items, title) {
  if (!imageGalleryEl) return;
  imageGalleryEl.innerHTML = "";
  if (galleryBlockEl) galleryBlockEl.hidden = false;

  if (!Array.isArray(items) || items.length === 0) {
    imageGalleryEl.textContent = "No extra images found for this page.";
    return;
  }

  const mainImage = String(imageEl?.src || "");
  const used = new Set();

  const cleaned = items
    .filter((item) => item && item.url)
    .map((item) => ({ url: String(item.url), caption: textFix(String(item.caption || "Reference image")) }))
    .filter((item) => {
      if (item.url === mainImage) return false;
      const key = imageDedupKey(item.url);
      if (!key) return false;
      if (used.has(key)) return false;
      used.add(key);
      return true;
    });

  if (cleaned.length === 0) {
    const main = String(imageEl?.src || "").trim();
    if (main) cleaned.push({ url: main, caption: `${title} reference image` });
  }

  const guaranteed = ensureMinimumImages(cleaned, 10);
<<<<<<< HEAD
  latestGalleryItems = guaranteed.slice(0, 10);
  const integratedCount = injectSectionFigures(title);
  if (galleryBlockEl && integratedCount > 0) {
    galleryBlockEl.hidden = true;
    imageGalleryEl.innerHTML = "";
    return;
  }

  const usedFallbackKeys = new Set(latestGalleryItems.map((x) => imageDedupKey(x.url)).filter(Boolean));
  latestGalleryItems.slice(0, 6).forEach((item) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-figure";

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = `${title} reference image`;
    img.loading = "lazy";
    img.className = "gallery-thumb";
    img.onerror = async () => {
      img.onerror = null;
      const byName = await getWikiThumbByName(title);
      const byNameKey = imageDedupKey(byName);
      if (byName && byNameKey && !usedFallbackKeys.has(byNameKey)) {
        usedFallbackKeys.add(byNameKey);
        img.src = byName;
        cap.textContent = `${title} reference image`;
        return;
      }
      const genus = extractGenus(title);
      const byGenus = await getWikiThumbByName(genus);
      const byGenusKey = imageDedupKey(byGenus);
      if (byGenus && byGenusKey && !usedFallbackKeys.has(byGenusKey)) {
        usedFallbackKeys.add(byGenusKey);
        img.src = byGenus;
        cap.textContent = `${genus} reference image`;
        return;
      }
      const local = pickLocalFallback(usedFallbackKeys, dinoId);
      if (!local) {
        figure.remove();
        return;
      }
      usedFallbackKeys.add(imageDedupKey(local.url));
      img.src = local.url;
      cap.textContent = local.caption;
    };
    figure.appendChild(img);

    const cap = document.createElement("figcaption");
    cap.className = "gallery-caption";
    cap.textContent = item.caption;
    figure.appendChild(cap);

    imageGalleryEl.appendChild(figure);
  });

=======
  latestGalleryItems = guaranteed.slice(0, 12);

  const usedFallbackKeys = new Set(latestGalleryItems.map((x) => imageDedupKey(x.url)).filter(Boolean));

  latestGalleryItems.forEach((item) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-figure";

      const img = document.createElement("img");
      img.src = item.url;
      img.alt = `${title} reference image`;
      img.loading = "lazy";
      img.className = "gallery-thumb";
      img.onerror = () => {
        img.onerror = null;
        const local = pickLocalFallback(usedFallbackKeys);
        if (!local) {
          figure.remove();
          return;
        }
        usedFallbackKeys.add(imageDedupKey(local.url));
        img.src = local.url;
        cap.textContent = local.caption;
      };
      figure.appendChild(img);

      const cap = document.createElement("figcaption");
      cap.className = "gallery-caption";
      cap.textContent = item.caption;
      figure.appendChild(cap);

      imageGalleryEl.appendChild(figure);
    });

  const integratedCount = injectSectionFigures(title);
  if (galleryBlockEl && integratedCount > 0) {
    galleryBlockEl.hidden = true;
  }

>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  if (!imageGalleryEl.hasChildNodes()) {
    imageGalleryEl.textContent = "No extra images found for this page.";
  }
}

function collectLocalGalleryItems(base, detail) {
  const list = [];

  if (Array.isArray(detail?.images)) {
    detail.images.forEach((item, idx) => {
      if (!item) return;
      if (typeof item === "string") {
        list.push({ url: imagePath(item), caption: `Reference ${idx + 1}` });
        return;
      }
      if (typeof item === "object" && item.url) {
        list.push({ url: imagePath(item.url), caption: item.caption || `Reference ${idx + 1}` });
      }
    });
  }

  if (detail?.image) list.push({ url: imagePath(detail.image), caption: `${detail.name || base?.name || "Specimen"} image` });
  else if (base?.image) list.push({ url: imagePath(base.image), caption: `${base.name || "Specimen"} image` });

  return list;
}

async function loadExtraImages(title, base, detail) {
  if (!imageGalleryEl) return;

  const idKey = normalizeId(base?.id || dinoId || title);
  const genus = extractGenus(title);
  const curated = CURATED_EXTRA_IMAGES[idKey] || [];
  const localItems = collectLocalGalleryItems(base, detail);
<<<<<<< HEAD
  const cached = IMAGE_SET_CACHE.get(idKey);

  // Fast first paint: local + curated only.
  const immediate = filterRelevantImages([...localItems, ...curated], title, idKey);
  renderGalleryItems(diversifyImageSet(immediate, 10), title);

  if (cached) {
    renderGalleryItems(diversifyImageSet(filterRelevantImages([...immediate, ...cached], title, idKey), 16), title);
    return;
  }

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  const fromWiki = [];
  const fromCommons = [];

  function captionFromFileTitle(raw) {
    const base = String(raw || "")
      .replace(/^File:/i, "")
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return base || "Reference image";
  }

  try {
    const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=images&imlimit=10&titles=${encodeURIComponent(title)}`;
    const pageResponse = await fetch(pageUrl, { cache: "no-store" });
    if (!pageResponse.ok) throw new Error("Image list request failed.");
    const pageData = await pageResponse.json();
    const page = Object.values(pageData.query.pages || {})[0];
    const files = (page?.images || [])
      .map((item) => item.title)
      .filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name))
      .slice(0, 10);

    if (files.length > 0) {
      const infoUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=520&titles=${encodeURIComponent(files.join("|"))}`;
      const infoResponse = await fetch(infoUrl, { cache: "no-store" });
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        const pages = Object.values(infoData.query.pages || {});
        pages.forEach((p) => {
          const ii = p?.imageinfo?.[0];
          const url = ii?.thumburl || ii?.url || "";
          if (!url) return;
          fromWiki.push({
            url,
            caption: captionFromFileTitle(String(p?.title || ""))
          });
        });
      }
    }
  } catch {
    // fallback chain below handles empty/failed cases
  }

  if (fromWiki.length === 0) {
    const summaryThumb = await getWikiThumbByName(title);
    if (summaryThumb) fromWiki.push({ url: summaryThumb, caption: `${title} reference image` });
  }
  if (fromWiki.length < 4) {
    const genusPageThumb = await getWikiThumbByName(genus);
    if (genusPageThumb) fromWiki.push({ url: genusPageThumb, caption: `${genus} reference image` });
  }

  const commonsByTitle = await loadCommonsSearchImages(`${title} dinosaur fossil skeleton`, 16);
  fromCommons.push(...commonsByTitle);
  if (fromCommons.length < 6 && genus) {
    const commonsByGenus = await loadCommonsSearchImages(`${genus} fossil`, 12);
    fromCommons.push(...commonsByGenus);
  }

  const variantThumbs = await loadVariantThumbs(title);
<<<<<<< HEAD
  const mergedRemote = [...fromWiki, ...fromCommons, ...variantThumbs];
  IMAGE_SET_CACHE.set(idKey, mergedRemote);
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
  const relevant = filterRelevantImages(
    [...localItems, ...fromWiki, ...fromCommons, ...curated, ...variantThumbs],
    title,
    idKey
  );
  renderGalleryItems(diversifyImageSet(relevant, 16), title);
}

async function loadArticle() {
  if (!dinoId) {
    showError("No dinosaur ID was provided. Open an article from the home page.");
    return;
  }

  try {
<<<<<<< HEAD
    if (improveArticleBtn) {
      improveArticleBtn.href = `admin.html?id=${encodeURIComponent(dinoId)}`;
    }

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    const indexResponse = await fetch("data/index.json", { cache: "no-store" });
    if (!indexResponse.ok) throw new Error(`Index load failed: HTTP ${indexResponse.status}`);

    allDinosaurs = await indexResponse.json();
    buildNameLookup();
<<<<<<< HEAD
    await loadSpeciesIndex();
    await loadSpeciesProfiles();
    await loadInformalTaxa();
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    const base = allDinosaurs.find((item) => item.id === dinoId);
    currentBase = base;

    if (!base) {
      showError(`The dinosaur '${dinoId}' does not exist in the index.`);
      return;
    }

    let detail = null;
    try {
      const detailResponse = await fetch(`data/${encodeURIComponent(dinoId)}.json`, { cache: "no-store" });
      if (detailResponse.ok) detail = await detailResponse.json();
    } catch {
      // fallback handled below
    }
    currentDetail = detail;

    const activeName = textFix(detail?.name || base.name);
    titleEl.textContent = activeName;
    updateContactLinks(activeName);

<<<<<<< HEAD
    const primaryImage = imagePath(detail?.image || base.image || "");
    imageEl.src = !isLikelyBrokenLocalImage(primaryImage) ? primaryImage : "images/no-image.svg";
    imageEl.alt = activeName;
    imageEl.onerror = async () => {
      imageEl.onerror = null;
      const localImages = Array.isArray(detail?.images) ? detail.images : [];
      const localCandidate = localImages
        .map((img) => typeof img === "string" ? imagePath(img) : imagePath(img?.url || ""))
        .find((url) => url && !isLikelyBrokenLocalImage(url));
      if (localCandidate) {
        imageEl.src = localCandidate;
        return;
      }

      const byName = await getWikiThumbByName(activeName);
      if (byName) {
        imageEl.src = byName;
        return;
      }

      const genus = extractGenus(activeName);
      const byGenus = genus ? await getWikiThumbByName(genus) : "";
      imageEl.src = byGenus || "images/no-image.svg";
    };
    if (isLikelyBrokenLocalImage(primaryImage)) {
      const byName = await getWikiThumbByName(activeName);
      if (byName) imageEl.src = byName;
    }
=======
    imageEl.src = imagePath(detail?.image || base.image);
    imageEl.alt = activeName;
    imageEl.onerror = async () => {
      imageEl.onerror = null;
      const wikiThumb = await getWikiThumbByName(activeName);
      imageEl.src = wikiThumb || "images/trex-skull.png";
    };
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    imageEl.style.display = "block";

    renderLinkedText(
      overviewEl,
      detail?.overview ||
      `${base.name} lived during the ${base.period || "unknown period"}. It was a ${
        base.diet || "unknown-diet"
      } ${(base.type || "dinosaur").toLowerCase()} known from ${base.where || "unknown regions"}.`,
      dinoId
    );
    buildDinoInsight(base, detail);

<<<<<<< HEAD
    if (!Array.isArray(detail?.citations) || detail.citations.length === 0) {
      if (detail && typeof detail === "object") {
        detail.citations = buildFallbackCitations(base, detail, activeName);
      }
    }

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    buildQuickFacts(base, detail);
    buildNameGuide(base, detail);
    buildTags(base, detail);

    sectionNavEl.innerHTML = "";
    sectionsEl.innerHTML = "";

    const detailSections = detail && typeof detail === "object"
      ? Object.entries(detail).filter(([key]) => !["name", "image", "overview"].includes(key))
      : [];

    if (detailSections.length > 0) {
      detailSections.forEach(([name, value]) => renderSection(name, value, activeName));
    } else {
      renderSection("Quick Facts", { period: base.period || "Unknown", diet: base.diet || "Unknown", region: base.where || "Unknown" }, activeName);
    }
<<<<<<< HEAD
    if (speciesChooserEl) {
      speciesChooserEl.hidden = true;
      speciesChooserEl.innerHTML = "";
    }
    setViewMode("overview");
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
    renderGeneratedDeepDive(base, detail, activeName);

    buildRelated(base);
    loadExtraImages(activeName, base, detail);
    clearArticleSearchHighlights();
    syncToolbarButtons();
  } catch (error) {
    console.error(error);
    showError("Unable to load this dinosaur article right now.");
  }
}

bindToolbarEvents();
bindArticleSearchEvents();
loadArticle();
