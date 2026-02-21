const gallery = document.getElementById("dinoGallery");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const periodFilter = document.getElementById("periodFilter");
const dietFilter = document.getElementById("dietFilter");
const qualityFilter = document.getElementById("qualityFilter");
const sortOrder = document.getElementById("sortOrder");
const newOnlyFilter = document.getElementById("newOnlyFilter");
const favoritesOnlyFilter = document.getElementById("favoritesOnlyFilter");
const secretOnlyFilter = document.getElementById("secretOnlyFilter");
const clearFiltersBtn = document.getElementById("clearFilters");
const timelineFiltersEl = document.getElementById("timelineFilters");
const regionFiltersEl = document.getElementById("regionFilters");
const compareTray = document.getElementById("compareTray");
const compareCountEl = document.getElementById("compareCount");
const openCompareLink = document.getElementById("openCompareLink");
const clearCompareBtn = document.getElementById("clearCompare");
const dailyModalEl = document.getElementById("dailyModal");
const dailyFactEl = document.getElementById("dailyFact");
const dailyLinkEl = document.getElementById("dailyLink");
const dailyCloseBtn = document.getElementById("dailyClose");
const toggleAdvancedBtn = document.getElementById("toggleAdvanced");
const advancedPanelEl = document.getElementById("advancedPanel");
const randomArticleLink = document.getElementById("randomArticleLink");

const FAVORITES_KEY = "dinoPediaFavorites";
const COMPARE_KEY = "dinoPediaCompare";
const DAILY_SEEN_KEY = "dinoPediaDailySeen";
const PAGE_SIZE = 24;
const ERAS = ["All", "Triassic", "Jurassic", "Cretaceous"];
const wikiThumbCache = new Map();
const speciesPreviewCache = new Map();
const speciesNarrativeCache = new Map();
const speciesProfileCache = new Map();
const commonsThumbCache = new Map();
const CARD_IMAGE_OVERRIDES = {
  spinosaurus: {
    primary: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/FSAC-KK-11888.jpg/640px-FSAC-KK-11888.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Spinosaurus_aegyptiacus_reconstruction.png"
  }
};
const SEARCH_EASTER_EGGS = [
  { key: "duck", image: "images/duck-easter.svg", label: "quack!", sound: "duck" },
  { key: "pigeon", image: "images/pigeon-easter.svg", label: "coo coo!", sound: "pigeon" },
  { key: "trex", image: "images/trex-skull.png", label: "rawr!", sound: "trex" }
];

let easterEggEl = null;
let easterEggHideTimer = null;
let lastEasterTriggerKey = "";
let lastEasterTriggerAt = 0;
let easterAudioContext = null;

const state = {
  allDinosaurs: [],
  speciesIndex: new Map(),
  speciesProfiles: new Map(),
  search: "",
  type: "",
  period: "",
  diet: "",
  quality: "",
  sort: "name-asc",
  newOnly: false,
  favoritesOnly: false,
  secretOnly: false,
  era: "All",
  region: "",
  visibleCount: PAGE_SIZE,
  favorites: new Set(),
  compare: []
};

function isHiddenEntry(dino) {
  return Boolean(dino && dino.hidden);
}

function getPublicDinosaurs() {
  return state.allDinosaurs.filter((d) => !isHiddenEntry(d));
}

function getBrowseDinosaurs() {
  if (state.secretOnly) {
    return state.allDinosaurs.filter((d) => isHiddenEntry(d));
  }
  const query = normalizeText(state.search).toLowerCase();
  if (!query) return getPublicDinosaurs();
  return state.allDinosaurs.filter((d) => {
    if (!isHiddenEntry(d)) return true;
    const name = normalizeText(d?.name).toLowerCase();
    const id = normalizeText(d?.id).toLowerCase();
    return name.includes(query) || id.includes(query);
  });
}

function imagePath(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("images/") ? path : `images/${path}`;
}

function imageDedupKey(url) {
  const raw = normalizeText(url).toLowerCase();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    parsed.search = "";
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return raw.split("?")[0];
  }
}

async function getWikiThumbByName(name) {
  const key = normalizeText(name);
  if (!key) return "";
  if (wikiThumbCache.has(key)) return wikiThumbCache.get(key);

  const pageTitle = encodeURIComponent(key.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("summary failed");
    const data = await response.json();
    const candidate = data?.thumbnail?.source || data?.originalimage?.source || "";
    wikiThumbCache.set(key, candidate);
    return candidate;
  } catch {
    wikiThumbCache.set(key, "");
    return "";
  }
}

async function getCommonsThumbByQuery(query) {
  const q = normalizeText(query);
  if (!q) return "";
  if (commonsThumbCache.has(q)) return commonsThumbCache.get(q);

  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("commons search failed");
    const data = await response.json();
    const pages = Object.values(data?.query?.pages || {});
    const candidate = pages
      .map((p) => p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url || "")
      .find((u) => /\.(jpg|jpeg|png|webp)$/i.test(u));
    const out = normalizeText(candidate);
    commonsThumbCache.set(q, out);
    return out;
  } catch {
    commonsThumbCache.set(q, "");
    return "";
  }
}

async function buildEntityImageCandidates(name, genus, original) {
  const out = [];
  const add = (url) => {
    const clean = normalizeText(url);
    if (!clean) return;
    if (out.some((u) => imageDedupKey(u) === imageDedupKey(clean))) return;
    out.push(clean);
  };

  if (original && !isLikelyBrokenLocalImage(original)) add(original);
  add(await getWikiThumbByName(name));
  add(await getCommonsThumbByQuery(`${name} fossil`));
  add(await getCommonsThumbByQuery(`${name} skeleton`));
  if (genus && genus.toLowerCase() !== name.toLowerCase()) {
    add(await getWikiThumbByName(genus));
    add(await getCommonsThumbByQuery(`${genus} fossil`));
  }
  return out;
}

function applyImageCandidates(imgEl, candidates, fallback = "images/no-image.svg") {
  let idx = 0;
  const next = () => {
    if (idx >= candidates.length) {
      imgEl.onerror = null;
      imgEl.src = fallback;
      return;
    }
    const candidate = candidates[idx];
    idx += 1;
    if (!candidate) {
      next();
      return;
    }
    imgEl.onerror = next;
    imgEl.src = candidate;
  };
  next();
}

function isLikelyBrokenLocalImage(path) {
  const p = normalizeText(path).toLowerCase();
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

function attachSmartImageFallback(imgEl, dino) {
  const name = normalizeText(dino?.name);
  const genus = name.split(/\s+/)[0] || "";
  const id = normalizeText(dino?.id).toLowerCase();
  const override = CARD_IMAGE_OVERRIDES[id];
  const original = imagePath(dino?.image || "");

  if (override?.primary) {
    applyImageCandidates(imgEl, [override.primary, override.fallback], "images/no-image.svg");
    return;
  }

  buildEntityImageCandidates(name, genus, original).then((candidates) => {
    applyImageCandidates(imgEl, candidates, "images/no-image.svg");
  });
}

function normalizeText(value) {
  return String(value || "").trim();
}

function getSpeciesEntriesForCard(dino) {
  const id = normalizeText(dino?.id).toLowerCase();
  if (!id || id === "pigeon") return [];
  const record = state.speciesIndex.get(id);
  if (!record || !Array.isArray(record.species)) return [];
  const names = [...new Set(record.species.map((s) => normalizeText(s)).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  if (names.length <= 1) return [];
  return names.map((name) => ({ name }));
}

function getLocalSpeciesProfileByName(speciesName) {
  const key = normalizeText(speciesName).toLowerCase();
  if (!key) return null;
  return state.speciesProfiles.get(key) || null;
}

async function getSpeciesPreviewByName(speciesName) {
  const key = normalizeText(speciesName).toLowerCase();
  if (!key) return null;
  if (speciesPreviewCache.has(key)) return speciesPreviewCache.get(key);

  const title = encodeURIComponent(speciesName.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("species summary failed");
    const data = await response.json();
    const preview = {
      extract: normalizeText(data?.extract),
      image: normalizeText(data?.thumbnail?.source || data?.originalimage?.source || ""),
      description: normalizeText(data?.description)
    };
    speciesPreviewCache.set(key, preview);
    return preview;
  } catch {
    const fallback = { extract: "", image: "", description: "" };
    speciesPreviewCache.set(key, fallback);
    return fallback;
  }
}

async function getSpeciesNarrativeByName(speciesName) {
  const key = normalizeText(speciesName).toLowerCase();
  if (!key) return "";
  if (speciesNarrativeCache.has(key)) return speciesNarrativeCache.get(key);

  const title = encodeURIComponent(speciesName.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&titles=${title}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("species extract failed");
    const data = await response.json();
    const page = Object.values(data?.query?.pages || {})[0];
    const extract = normalizeText(page?.extract || "");
    const cleaned = extract
      .split(/\n{2,}/)
      .map((p) => normalizeText(p))
      .filter((p) => p.length > 60)
      .slice(0, 2)
      .join(" ");
    speciesNarrativeCache.set(key, cleaned);
    return cleaned;
  } catch {
    speciesNarrativeCache.set(key, "");
    return "";
  }
}

function ensureEasterEggEl() {
  if (easterEggEl) return easterEggEl;
  const node = document.createElement("div");
  node.className = "search-easter-egg";
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = `
    <img class="search-easter-egg-image" alt="">
    <div class="search-easter-egg-label"></div>
  `;
  document.body.appendChild(node);
  easterEggEl = node;
  return node;
}

function getAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  if (!easterAudioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    easterAudioContext = new Ctx();
  }
  if (easterAudioContext.state === "suspended") {
    easterAudioContext.resume().catch(() => {});
  }
  return easterAudioContext;
}

function playEasterSound(kind) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const chirp = (start, duration, from, to, type = "square", gainLevel = 0.07) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(gainLevel, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  };

  const t = ctx.currentTime + 0.02;
  if (kind === "duck") {
    chirp(t, 0.11, 920, 430, "square", 0.09);
    chirp(t + 0.14, 0.10, 780, 360, "square", 0.08);
    return;
  }
  if (kind === "pigeon") {
    chirp(t, 0.16, 520, 410, "triangle", 0.06);
    chirp(t + 0.20, 0.16, 520, 390, "triangle", 0.06);
    return;
  }
  chirp(t, 0.13, 190, 120, "sawtooth", 0.06);
}

function showSearchEasterEgg(entry) {
  const node = ensureEasterEggEl();
  const img = node.querySelector(".search-easter-egg-image");
  const label = node.querySelector(".search-easter-egg-label");
  if (img) {
    img.src = entry.image;
    img.alt = `${entry.key} easter egg`;
  }
  if (label) label.textContent = entry.label;
  node.classList.remove("search-easter-egg-active");
  void node.offsetWidth;
  node.classList.add("search-easter-egg-active");

  if (easterEggHideTimer) clearTimeout(easterEggHideTimer);
  easterEggHideTimer = setTimeout(() => {
    node.classList.remove("search-easter-egg-active");
  }, 2400);
}

function maybeTriggerSearchEasterEgg(query) {
  const q = normalizeText(query).toLowerCase();
  if (!q || q.length < 2) return;
  const hit = SEARCH_EASTER_EGGS.find((egg) => q.includes(egg.key));
  if (!hit) return;

  const now = Date.now();
  if (hit.key === lastEasterTriggerKey && now - lastEasterTriggerAt < 3500) return;
  lastEasterTriggerKey = hit.key;
  lastEasterTriggerAt = now;

  playEasterSound(hit.sound);
  showSearchEasterEgg(hit);
}

function isUnknownLike(value) {
  const v = normalizeText(value).toLowerCase();
  return !v || v === "unknown" || v.startsWith("unknown but");
}

function humanizeField(value, fallback = "Unknown") {
  return isUnknownLike(value) ? fallback : normalizeText(value);
}

function qualityScore(dino) {
  const fields = [dino?.type, dino?.period, dino?.diet, dino?.where];
  const known = fields.filter((value) => !isUnknownLike(value) && normalizeText(value).toLowerCase() !== "mesozoic").length;
  return known;
}

function qualityLabel(score) {
  if (score >= 3) return "High detail";
  if (score >= 2) return "Moderate detail";
  return "Basic detail";
}

function qualityTier(score) {
  if (score >= 3) return "high";
  if (score >= 2) return "moderate";
  return "basic";
}

function getEra(period) {
  const p = normalizeText(period).toLowerCase();
  if (p.includes("triassic")) return "Triassic";
  if (p.includes("jurassic")) return "Jurassic";
  if (p.includes("cretaceous")) return "Cretaceous";
  return "Unknown";
}

function uniqueSortedValues(dinosaurs, key) {
  const values = dinosaurs.map((dino) => normalizeText(dino[key])).filter(Boolean);
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function safeJsonParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadStoredSets() {
  state.favorites = new Set(safeJsonParse(localStorage.getItem(FAVORITES_KEY) || "[]", []));
  state.compare = safeJsonParse(localStorage.getItem(COMPARE_KEY) || "[]", []).filter(Boolean).slice(0, 4);
}

function persistSets() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
  localStorage.setItem(COMPARE_KEY, JSON.stringify(state.compare));
}

function updateUrlParams() {
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  if (state.type) params.set("type", state.type);
  if (state.period) params.set("period", state.period);
  if (state.diet) params.set("diet", state.diet);
  if (state.quality) params.set("quality", state.quality);
  if (state.sort !== "name-asc") params.set("sort", state.sort);
  if (state.newOnly) params.set("new", "1");
  if (state.favoritesOnly) params.set("fav", "1");
  if (state.secretOnly) params.set("secret", "1");
  if (state.era !== "All") params.set("era", state.era);
  if (state.region) params.set("region", state.region);

  const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
  history.replaceState(null, "", newUrl);
}

function loadStateFromUrl() {
  const params = new URLSearchParams(location.search);
  state.search = params.get("q") || "";
  state.type = params.get("type") || "";
  state.period = params.get("period") || "";
  state.diet = params.get("diet") || "";
  state.quality = params.get("quality") || "";
  state.sort = params.get("sort") || "name-asc";
  state.newOnly = params.get("new") === "1";
  state.favoritesOnly = params.get("fav") === "1";
  state.secretOnly = params.get("secret") === "1";
  state.era = params.get("era") || "All";
  state.region = params.get("region") || "";

  searchInput.value = state.search;
  if (typeFilter) typeFilter.value = state.type;
  if (qualityFilter) qualityFilter.value = state.quality;
  sortOrder.value = state.sort;
  newOnlyFilter.checked = state.newOnly;
  favoritesOnlyFilter.checked = state.favoritesOnly;
  if (secretOnlyFilter) secretOnlyFilter.checked = state.secretOnly;
}

function setSelectOptions(selectEl, values, placeholder) {
  const current = selectEl.value;
  selectEl.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  selectEl.appendChild(defaultOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });

  if ([...selectEl.options].some((opt) => opt.value === current)) selectEl.value = current;
}

function createFactRow(label, value) {
  const row = document.createElement("div");
  row.className = "fact-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value || "Unknown";
  row.append(dt, dd);
  return row;
}

function createChip(label, value, type) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = `${label}: ${value || "Unknown"}`;
  chip.addEventListener("click", () => {
    if (type === "period") {
      state.period = value || "";
      periodFilter.value = state.period;
    }
    if (type === "diet") {
      state.diet = value || "";
      dietFilter.value = state.diet;
    }
    if (type === "type") {
      state.type = value || "";
      if (typeFilter) typeFilter.value = state.type;
    }
    state.visibleCount = PAGE_SIZE;
    render();
  });
  return chip;
}

function createIconButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function toggleFavorite(dinoId) {
  if (state.favorites.has(dinoId)) state.favorites.delete(dinoId);
  else state.favorites.add(dinoId);
  persistSets();
  render();
}

function toggleCompare(dinoId) {
  const idx = state.compare.indexOf(dinoId);
  if (idx >= 0) state.compare.splice(idx, 1);
  else if (state.compare.length < 4) state.compare.push(dinoId);
  else {
    alert("Compare supports up to 4 dinosaurs.");
    return;
  }
  persistSets();
  renderCompareTray();
  render();
}

function createCard(dino) {
  const card = document.createElement("article");
  card.className = "entry-card";

  const header = document.createElement("div");
  header.className = "entry-header";

  const title = document.createElement("h3");
  title.className = "entry-title";
  title.textContent = dino.name;

  const headerRight = document.createElement("div");
  headerRight.className = "entry-header-right";

  if (dino.isNew) {
    const badge = document.createElement("span");
    badge.className = "new-badge";
    badge.textContent = "Newly added";
    headerRight.appendChild(badge);
  }

  if (isHiddenEntry(dino)) {
    const secretBadge = document.createElement("span");
    secretBadge.className = "type-badge secret-badge";
    secretBadge.textContent = "Secret";
    headerRight.appendChild(secretBadge);
  }

  const typeBadge = document.createElement("span");
  typeBadge.className = "type-badge";
  typeBadge.textContent = dino.type || "Dinosaur";
  headerRight.appendChild(typeBadge);

  const qBadge = document.createElement("span");
  const qScore = qualityScore(dino);
  qBadge.className = `type-badge quality-badge quality-${qScore >= 3 ? "high" : qScore >= 2 ? "mid" : "low"}`;
  qBadge.textContent = qualityLabel(qScore);
  headerRight.appendChild(qBadge);

  const faveBtn = createIconButton(
    state.favorites.has(dino.id) ? "★ Favorite" : "☆ Favorite",
    "mini-btn",
    () => toggleFavorite(dino.id)
  );

  const compareBtn = createIconButton(
    state.compare.includes(dino.id) ? "Compared" : "+ Compare",
    "mini-btn",
    () => toggleCompare(dino.id)
  );

  const readLink = document.createElement("a");
  readLink.className = "read-link";
  readLink.href = `dino.html?dino=${encodeURIComponent(dino.id)}`;
  readLink.textContent = "Read article";

  headerRight.append(faveBtn, compareBtn, readLink);
  header.append(title, headerRight);

  const body = document.createElement("div");
  body.className = "entry-body";

  const thumb = document.createElement("img");
  thumb.className = "entry-thumb";
  thumb.alt = dino.name;
  thumb.loading = "lazy";
  thumb.decoding = "async";
  attachSmartImageFallback(thumb, dino);

  const details = document.createElement("div");
  details.className = "entry-details";

  const description = document.createElement("p");
  description.className = "entry-description";
  const entityType = humanizeField(dino.type, "Prehistoric animal");
  const diet = humanizeField(dino.diet, "Unknown diet");
  const period = humanizeField(dino.period, "Unknown period");
  const region = humanizeField(dino.where, "Unknown region");
  description.textContent = `${dino.name} is a ${diet.toLowerCase()} ${entityType.toLowerCase()} from the ${period}, known from ${region}.`;

  const facts = document.createElement("dl");
  facts.className = "fact-table";
  facts.append(
    createFactRow("Scientific name", dino.name),
    createFactRow("Type", dino.type || "Dinosaur"),
    createFactRow("Era", getEra(dino.period)),
    createFactRow("Period", dino.period),
    createFactRow("Diet", dino.diet),
    createFactRow("Region", dino.where)
  );

  const chipRow = document.createElement("div");
  chipRow.className = "chip-row";
  chipRow.append(
    createChip("Type", dino.type || "Dinosaur", "type"),
    createChip("Period", dino.period, "period"),
    createChip("Diet", dino.diet, "diet")
  );

  details.append(description, facts, chipRow);
  body.append(thumb, details);
  card.append(header, body);

  const speciesEntries = getSpeciesEntriesForCard(dino);
  if (speciesEntries.length > 0) {
    const dropdown = document.createElement("details");
    dropdown.className = "card-species-dropdown";

    const summary = document.createElement("summary");
    summary.className = "card-species-summary";
    summary.textContent = `Species (${speciesEntries.length})`;
    dropdown.appendChild(summary);

    const expanded = document.createElement("div");
    expanded.className = "card-species-expanded";

    const list = document.createElement("div");
    list.className = "card-species-list";

    const mainImageSeed = CARD_IMAGE_OVERRIDES[normalizeText(dino?.id).toLowerCase()]?.primary || imagePath(dino?.image || "");
    const usedSpeciesImages = new Set([imageDedupKey(mainImageSeed)]);
    speciesEntries.forEach((entry) => {
      const speciesName = entry.name;
      const localProfile = getLocalSpeciesProfileByName(speciesName);
      const item = document.createElement("article");
      item.className = "card-species-item";

      const itemImage = document.createElement("img");
      itemImage.className = "card-species-thumb";
      itemImage.alt = speciesName;
      itemImage.loading = "lazy";
      itemImage.decoding = "async";
      itemImage.src = "images/no-image.svg";

      const body = document.createElement("div");
      body.className = "card-species-item-body";

      const nameEl = document.createElement("h4");
      nameEl.className = "card-species-name";
      nameEl.textContent = speciesName;

      const metaEl = document.createElement("p");
      metaEl.className = "card-species-meta";
      metaEl.textContent = `Species within genus ${dino.name}`;

      const factsEl = document.createElement("p");
      factsEl.className = "card-species-facts";
      factsEl.textContent = "Fetching species-level facts...";

      const descEl = document.createElement("p");
      descEl.className = "card-species-desc";
      descEl.textContent = `Species-level page for ${dino.name}.`;

      const extraEl = document.createElement("p");
      extraEl.className = "card-species-extra";
      extraEl.textContent = "Loading deeper species notes...";

      const readSpecies = document.createElement("a");
      readSpecies.className = "read-link";
      readSpecies.href = `species.html?genus=${encodeURIComponent(dino.id)}&name=${encodeURIComponent(speciesName)}`;
      readSpecies.textContent = "Read species article";

      body.append(nameEl, metaEl, factsEl, descEl, extraEl, readSpecies);
      item.append(itemImage, body);
      list.appendChild(item);

      if (localProfile) {
        const temporal = normalizeText(localProfile.temporalRange);
        const location = normalizeText(localProfile.location);
        const diet = normalizeText(localProfile.diet);
        const facts = [
          temporal ? `Range: ${temporal}` : "",
          location ? `Location: ${location}` : "",
          diet ? `Diet: ${diet}` : ""
        ].filter(Boolean).join(" | ");
        if (facts) factsEl.textContent = facts;
        if (localProfile.overview) {
          const localOverview = normalizeText(localProfile.overview);
          descEl.textContent = localOverview.length > 260 ? `${localOverview.slice(0, 257)}...` : localOverview;
        }
        if (Array.isArray(localProfile.sections) && localProfile.sections.length > 0) {
          const sectionText = normalizeText(localProfile.sections[0]?.text || "");
          if (sectionText) {
            extraEl.textContent = sectionText.length > 360 ? `${sectionText.slice(0, 357)}...` : sectionText;
          }
        }
      }

      getSpeciesPreviewByName(speciesName).then((preview) => {
        const trySet = (url) => {
          const key = imageDedupKey(url);
          if (!key || usedSpeciesImages.has(key)) return false;
          usedSpeciesImages.add(key);
          itemImage.src = url;
          return true;
        };
        if (preview?.image && trySet(preview.image)) {
          // selected
        } else {
          getWikiThumbByName(speciesName).then((thumbByName) => {
            if (trySet(thumbByName)) return;
            getCommonsThumbByQuery(`${speciesName} fossil`).then((commons) => {
              if (!trySet(commons)) {
                getCommonsThumbByQuery(`${speciesName} skeleton`).then((commons2) => {
                  if (commons2) trySet(commons2);
                });
              }
            });
          });
        }

        if (preview.description) {
          metaEl.textContent = preview.description;
        }
        if (preview.extract) {
          descEl.textContent = preview.extract.length > 260 ? `${preview.extract.slice(0, 257)}...` : preview.extract;
        } else if (preview.description) {
          descEl.textContent = preview.description;
        }
      });

      getSpeciesNarrativeByName(speciesName).then((narrative) => {
        if (localProfile && normalizeText(extraEl.textContent) && !extraEl.textContent.startsWith("Loading deeper species notes")) return;
        if (!narrative) {
          extraEl.textContent = `${speciesName} has limited species-level prose right now; the dedicated species article includes deeper taxonomic and reference context.`;
          return;
        }
        extraEl.textContent = narrative.length > 360 ? `${narrative.slice(0, 357)}...` : narrative;
      });

      if (!localProfile) {
        factsEl.textContent = `Genus context: ${dino.period || "Unknown period"} | ${dino.where || "Unknown region"} | ${dino.diet || "Unknown diet"}`;
      } else if (Array.isArray(localProfile.references) && localProfile.references.length > 0) {
        factsEl.textContent = `${factsEl.textContent} | References: ${localProfile.references.length}`;
      }
    });

    expanded.appendChild(list);
    dropdown.appendChild(expanded);
    card.appendChild(dropdown);
  }

  return card;
}

function matchesFilters(dino) {
  const search = state.search.toLowerCase();
  const searchable = `${dino.name || ""} ${dino.where || ""}`.toLowerCase();
  const era = getEra(dino.period);
  const qTier = qualityTier(qualityScore(dino));
  const qualityPass =
    !state.quality ||
    (state.quality === "high" && qTier === "high") ||
    (state.quality === "moderate" && (qTier === "high" || qTier === "moderate")) ||
    (state.quality === "basic" && (qTier === "high" || qTier === "moderate" || qTier === "basic"));

  return (
    (!search || searchable.includes(search)) &&
    (!state.type || (dino.type || "Dinosaur") === state.type) &&
    (!state.period || dino.period === state.period) &&
    (!state.diet || dino.diet === state.diet) &&
    qualityPass &&
    (!state.newOnly || Boolean(dino.isNew)) &&
    (!state.favoritesOnly || state.favorites.has(dino.id)) &&
    (!state.secretOnly || isHiddenEntry(dino)) &&
    (state.era === "All" || era === state.era) &&
    (!state.region || dino.where === state.region)
  );
}

function sortDinosaurs(items) {
  const sorted = [...items];
  switch (state.sort) {
    case "name-desc":
      sorted.sort((a, b) => normalizeText(b.name).localeCompare(normalizeText(a.name)));
      break;
    case "period-asc":
      sorted.sort((a, b) => normalizeText(a.period).localeCompare(normalizeText(b.period)) || normalizeText(a.name).localeCompare(normalizeText(b.name)));
      break;
    case "diet-asc":
      sorted.sort((a, b) => normalizeText(a.diet).localeCompare(normalizeText(b.diet)) || normalizeText(a.name).localeCompare(normalizeText(b.name)));
      break;
    case "quality-desc":
      sorted.sort((a, b) => qualityScore(b) - qualityScore(a) || normalizeText(a.name).localeCompare(normalizeText(b.name)));
      break;
    default:
      sorted.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)));
  }
  return sorted;
}

function isUnknownEntry(dino) {
  const period = normalizeText(dino.period).toLowerCase();
  const diet = normalizeText(dino.diet).toLowerCase();
  const where = normalizeText(dino.where).toLowerCase();

  return (
    !period ||
    !diet ||
    !where ||
    period === "unknown" ||
    diet === "unknown" ||
    where === "unknown" ||
    period === "mesozoic" ||
    where === "various regions"
  );
}

function getDisplayGroup(dino) {
  const type = dino.type || "Dinosaur";
  if (type === "Avian Reptile" || type === "Aerial Reptile") return "Aerial";
  if (type === "Marine Reptile") return "Marine";
  if (type === "Dinosaur" && !isUnknownEntry(dino)) return "Known dinos";
  return "Unknown";
}

function orderBySection(items) {
  const order = ["Known dinos", "Unknown", "Aerial", "Marine"];
  const grouped = new Map(order.map((label) => [label, []]));

  items.forEach((dino) => {
    const group = getDisplayGroup(dino);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group).push(dino);
  });

  const result = [];
  order.forEach((groupName) => {
    const list = grouped.get(groupName) || [];
    list
      .sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)))
      .forEach((dino) => result.push(dino));
  });

  return result;
}

function renderGroupedCards(items, fullItems = items) {
  const order = ["Known dinos", "Unknown", "Aerial", "Marine"];
  const groupedVisible = new Map(order.map((label) => [label, []]));
  const groupedFull = new Map(order.map((label) => [label, []]));

  items.forEach((dino) => {
    const group = getDisplayGroup(dino);
    if (!groupedVisible.has(group)) groupedVisible.set(group, []);
    groupedVisible.get(group).push(dino);
  });

  fullItems.forEach((dino) => {
    const group = getDisplayGroup(dino);
    if (!groupedFull.has(group)) groupedFull.set(group, []);
    groupedFull.get(group).push(dino);
  });

  order.forEach((groupName) => {
    const listVisible = groupedVisible.get(groupName) || [];
    const listFull = groupedFull.get(groupName) || [];
    if (listVisible.length === 0 && listFull.length === 0) return;

    const section = document.createElement("section");
    section.className = "gallery-group";

    const title = document.createElement("h3");
    title.className = "gallery-group-title";
    title.textContent = `${groupName} (${listFull.length})`;

    const listWrap = document.createElement("div");
    listWrap.className = "gallery-group-list";

    listVisible
      .sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)))
      .forEach((dino) => listWrap.appendChild(createCard(dino)));

    section.append(title, listWrap);
    gallery.appendChild(section);
  });
}

function renderLoadMore(totalFiltered) {
  const existing = document.getElementById("loadMoreWrap");
  if (existing) existing.remove();
  if (state.visibleCount >= totalFiltered) return;

  const wrap = document.createElement("div");
  wrap.id = "loadMoreWrap";
  wrap.className = "load-more-wrap";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "control-button load-more-btn";
  button.textContent = `Load more (${Math.min(PAGE_SIZE, totalFiltered - state.visibleCount)})`;
  button.addEventListener("click", () => {
    state.visibleCount += PAGE_SIZE;
    render();
  });

  wrap.appendChild(button);
  gallery.insertAdjacentElement("afterend", wrap);
}

function renderTimelineFilters() {
  timelineFiltersEl.innerHTML = "";
  ERAS.forEach((era) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip ${state.era === era ? "chip-active" : ""}`;
    btn.textContent = era;
    btn.addEventListener("click", () => {
      state.era = era;
      state.visibleCount = PAGE_SIZE;
      render();
    });
    timelineFiltersEl.appendChild(btn);
  });
}

function renderRegionFilters() {
  regionFiltersEl.innerHTML = "";

  const regions = uniqueSortedValues(state.allDinosaurs, "where");

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = `chip ${state.region === "" ? "chip-active" : ""}`;
  allBtn.textContent = "All regions";
  allBtn.addEventListener("click", () => {
    state.region = "";
    state.visibleCount = PAGE_SIZE;
    render();
  });
  regionFiltersEl.appendChild(allBtn);

  regions.forEach((region) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chip ${state.region === region ? "chip-active" : ""}`;
    btn.textContent = region;
    btn.addEventListener("click", () => {
      state.region = region;
      state.visibleCount = PAGE_SIZE;
      render();
    });
    regionFiltersEl.appendChild(btn);
  });
}

function renderCompareTray() {
  const count = state.compare.length;
  compareTray.hidden = count === 0;
  compareCountEl.textContent = `${count} selected for comparison`;

  const params = new URLSearchParams();
  if (count > 0) params.set("ids", state.compare.join(","));
  openCompareLink.href = `compare.html${count > 0 ? `?${params}` : ""}`;
}

function getDailySeed() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function closeDailyModal() {
  if (!dailyModalEl) return;
  dailyModalEl.hidden = true;
}

async function showDailyPopupIfNeeded() {
  const pool = getPublicDinosaurs();
  if (pool.length === 0) return;

  const seed = getDailySeed();
  const seenFor = localStorage.getItem(DAILY_SEEN_KEY);

  const picked = pool[hashString(seed) % pool.length];
  let fact = `${picked.name} lived in ${picked.where} during the ${picked.period}.`;

  try {
    const detailResponse = await fetch(`data/${encodeURIComponent(picked.id)}.json`, { cache: "no-store" });
    if (detailResponse.ok) {
      const detail = await detailResponse.json();
      if (Array.isArray(detail.funFacts) && detail.funFacts.length > 0) {
        fact = detail.funFacts[hashString(`${seed}-${picked.id}`) % detail.funFacts.length];
      } else if (detail.overview) {
        fact = detail.overview;
      }
    }
  } catch {
    // keep fallback
  }

  if (dailyFactEl) dailyFactEl.textContent = `${picked.name}: ${fact}`;
  if (dailyLinkEl) dailyLinkEl.href = `dino.html?dino=${encodeURIComponent(picked.id)}`;

  if (dailyModalEl && seenFor !== seed) {
    dailyModalEl.hidden = false;
    localStorage.setItem(DAILY_SEEN_KEY, seed);
  }
}

function render() {
  const pool = getBrowseDinosaurs();
  const filtered = sortDinosaurs(pool.filter(matchesFilters));
  const orderedFiltered = orderBySection(filtered);
  const visible = orderedFiltered.slice(0, state.visibleCount);

  gallery.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No entries match these filters.";
    gallery.appendChild(empty);
  } else {
    renderGroupedCards(visible, orderedFiltered);
  }

  statusEl.textContent = `${visible.length} of ${orderedFiltered.length} matching entries shown (${pool.length} total).`;
  renderLoadMore(orderedFiltered.length);
  renderTimelineFilters();
  renderRegionFilters();
  renderCompareTray();
  updateRandomArticleLink(orderedFiltered);
  updateUrlParams();
}

function updateRandomArticleLink(pool) {
  if (!randomArticleLink) return;
  const publicPool = getPublicDinosaurs();
  const source = Array.isArray(pool) && pool.length > 0 ? pool : publicPool;
  if (!Array.isArray(source) || source.length === 0) {
    randomArticleLink.href = "dino.html";
    return;
  }

  const pick = source[Math.floor(Math.random() * source.length)];
  randomArticleLink.href = `dino.html?dino=${encodeURIComponent(pick.id)}`;
}

function bindEvents() {
  searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    maybeTriggerSearchEasterEgg(state.search);
    state.visibleCount = PAGE_SIZE;
    render();
  });

  periodFilter.addEventListener("change", (event) => {
    state.period = event.target.value;
    state.visibleCount = PAGE_SIZE;
    render();
  });

  if (typeFilter) {
    typeFilter.addEventListener("change", (event) => {
      state.type = event.target.value;
      state.visibleCount = PAGE_SIZE;
      render();
    });
  }

  dietFilter.addEventListener("change", (event) => {
    state.diet = event.target.value;
    state.visibleCount = PAGE_SIZE;
    render();
  });

  if (qualityFilter) {
    qualityFilter.addEventListener("change", (event) => {
      state.quality = event.target.value;
      state.visibleCount = PAGE_SIZE;
      render();
    });
  }

  sortOrder.addEventListener("change", (event) => {
    state.sort = event.target.value;
    state.visibleCount = PAGE_SIZE;
    render();
  });

  newOnlyFilter.addEventListener("change", (event) => {
    state.newOnly = event.target.checked;
    state.visibleCount = PAGE_SIZE;
    render();
  });

  favoritesOnlyFilter.addEventListener("change", (event) => {
    state.favoritesOnly = event.target.checked;
    state.visibleCount = PAGE_SIZE;
    render();
  });

  if (secretOnlyFilter) {
    secretOnlyFilter.addEventListener("change", (event) => {
      state.secretOnly = event.target.checked;
      state.visibleCount = PAGE_SIZE;
      render();
    });
  }

  clearCompareBtn.addEventListener("click", () => {
    state.compare = [];
    persistSets();
    render();
  });

  toggleAdvancedBtn.addEventListener("click", () => {
    const hidden = advancedPanelEl.hidden;
    advancedPanelEl.hidden = !hidden;
    toggleAdvancedBtn.setAttribute("aria-expanded", String(hidden));
    toggleAdvancedBtn.textContent = hidden ? "Hide Advanced" : "Advanced Search";
  });

  if (dailyCloseBtn) {
    dailyCloseBtn.addEventListener("click", (event) => {
      event.preventDefault();
      closeDailyModal();
    });
  }

  clearFiltersBtn.addEventListener("click", () => {
    state.search = "";
    state.type = "";
    state.period = "";
    state.diet = "";
    state.quality = "";
    state.sort = "name-asc";
    state.newOnly = false;
    state.favoritesOnly = false;
    state.secretOnly = false;
    state.era = "All";
    state.region = "";
    state.visibleCount = PAGE_SIZE;

    searchInput.value = "";
    if (typeFilter) typeFilter.value = "";
    periodFilter.value = "";
    dietFilter.value = "";
    if (qualityFilter) qualityFilter.value = "";
    sortOrder.value = "name-asc";
    newOnlyFilter.checked = false;
    favoritesOnlyFilter.checked = false;
    if (secretOnlyFilter) secretOnlyFilter.checked = false;

    render();
  });
}

async function loadGallery() {
  try {
    const response = await fetch("data/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.allDinosaurs = await response.json();
    try {
      const speciesResponse = await fetch("data/species-index.json", { cache: "no-store" });
      if (speciesResponse.ok) {
        const speciesPayload = await speciesResponse.json();
        const entries = Array.isArray(speciesPayload?.entries) ? speciesPayload.entries : [];
        state.speciesIndex = new Map(
          entries
            .filter((entry) => normalizeText(entry?.id))
            .map((entry) => [normalizeText(entry.id).toLowerCase(), entry])
        );
      }
    } catch {
      state.speciesIndex = new Map();
    }
    try {
      const profilesResponse = await fetch("data/species-profiles.json", { cache: "no-store" });
      if (profilesResponse.ok) {
        const profilesPayload = await profilesResponse.json();
        const entries = Array.isArray(profilesPayload?.entries) ? profilesPayload.entries : [];
        state.speciesProfiles = new Map(
          entries
            .filter((entry) => normalizeText(entry?.name))
            .map((entry) => [normalizeText(entry.name).toLowerCase(), entry])
        );
      }
    } catch {
      state.speciesProfiles = new Map();
    }

    const publicPool = getPublicDinosaurs();
    setSelectOptions(typeFilter, uniqueSortedValues(publicPool.map((d) => ({ ...d, type: d.type || "Dinosaur" })), "type"), "All Types");
    setSelectOptions(periodFilter, uniqueSortedValues(publicPool, "period"), "All Periods");
    setSelectOptions(dietFilter, uniqueSortedValues(publicPool, "diet"), "All Diets");

    if (typeFilter && [...typeFilter.options].some((opt) => opt.value === state.type)) typeFilter.value = state.type;
    else state.type = "";

    if ([...periodFilter.options].some((opt) => opt.value === state.period)) periodFilter.value = state.period;
    else state.period = "";

    if ([...dietFilter.options].some((opt) => opt.value === state.diet)) dietFilter.value = state.diet;
    else state.diet = "";

    if (![...sortOrder.options].some((opt) => opt.value === state.sort)) {
      state.sort = "name-asc";
      sortOrder.value = state.sort;
    }

    render();
    showDailyPopupIfNeeded();
  } catch (error) {
    statusEl.textContent = "Could not load dinosaurs right now.";
    statusEl.classList.add("status-error");
    console.error(error);
  }
}

loadStoredSets();
loadStateFromUrl();
bindEvents();
loadGallery();
