const gallery = document.getElementById("dinoGallery");
const statusEl = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const periodFilter = document.getElementById("periodFilter");
const dietFilter = document.getElementById("dietFilter");
const sortOrder = document.getElementById("sortOrder");
const newOnlyFilter = document.getElementById("newOnlyFilter");
const favoritesOnlyFilter = document.getElementById("favoritesOnlyFilter");
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

const state = {
  allDinosaurs: [],
  search: "",
  type: "",
  period: "",
  diet: "",
  sort: "name-asc",
  newOnly: false,
  favoritesOnly: false,
  era: "All",
  region: "",
  visibleCount: PAGE_SIZE,
  favorites: new Set(),
  compare: []
};

function imagePath(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("images/") ? path : `images/${path}`;
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

function attachSmartImageFallback(imgEl, dino) {
  imgEl.onerror = async () => {
    imgEl.onerror = null;
    const wikiThumb = await getWikiThumbByName(dino.name);
    imgEl.src = wikiThumb || "images/trex-skull.png";
  };
}

function normalizeText(value) {
  return String(value || "").trim();
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
  if (state.sort !== "name-asc") params.set("sort", state.sort);
  if (state.newOnly) params.set("new", "1");
  if (state.favoritesOnly) params.set("fav", "1");
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
  state.sort = params.get("sort") || "name-asc";
  state.newOnly = params.get("new") === "1";
  state.favoritesOnly = params.get("fav") === "1";
  state.era = params.get("era") || "All";
  state.region = params.get("region") || "";

  searchInput.value = state.search;
  if (typeFilter) typeFilter.value = state.type;
  sortOrder.value = state.sort;
  newOnlyFilter.checked = state.newOnly;
  favoritesOnlyFilter.checked = state.favoritesOnly;
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

  const typeBadge = document.createElement("span");
  typeBadge.className = "type-badge";
  typeBadge.textContent = dino.type || "Dinosaur";
  headerRight.appendChild(typeBadge);

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
  thumb.src = imagePath(dino.image);
  thumb.alt = dino.name;
  thumb.loading = "lazy";
  thumb.decoding = "async";
  attachSmartImageFallback(thumb, dino);

  const details = document.createElement("div");
  details.className = "entry-details";

  const description = document.createElement("p");
  description.className = "entry-description";
  const entityType = dino.type || "Dinosaur";
  description.textContent = `${dino.name} is a ${String(dino.diet || "unknown diet").toLowerCase()} ${entityType.toLowerCase()} from the ${dino.period || "unknown period"}, known from ${dino.where || "unknown regions"}.`;

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
  return card;
}

function matchesFilters(dino) {
  const search = state.search.toLowerCase();
  const searchable = `${dino.name || ""} ${dino.where || ""}`.toLowerCase();
  const era = getEra(dino.period);

  return (
    (!search || searchable.includes(search)) &&
    (!state.type || (dino.type || "Dinosaur") === state.type) &&
    (!state.period || dino.period === state.period) &&
    (!state.diet || dino.diet === state.diet) &&
    (!state.newOnly || Boolean(dino.isNew)) &&
    (!state.favoritesOnly || state.favorites.has(dino.id)) &&
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
  if (type === "Avian Reptile") return "Aerial";
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
  if (state.allDinosaurs.length === 0) return;

  const seed = getDailySeed();
  const seenFor = localStorage.getItem(DAILY_SEEN_KEY);

  const picked = state.allDinosaurs[hashString(seed) % state.allDinosaurs.length];
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
  const filtered = sortDinosaurs(state.allDinosaurs.filter(matchesFilters));
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

  statusEl.textContent = `${visible.length} of ${orderedFiltered.length} matching entries shown (${state.allDinosaurs.length} total).`;
  renderLoadMore(orderedFiltered.length);
  renderTimelineFilters();
  renderRegionFilters();
  renderCompareTray();
  updateRandomArticleLink(orderedFiltered);
  updateUrlParams();
}

function updateRandomArticleLink(pool) {
  if (!randomArticleLink) return;
  const source = Array.isArray(pool) && pool.length > 0 ? pool : state.allDinosaurs;
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
    state.sort = "name-asc";
    state.newOnly = false;
    state.favoritesOnly = false;
    state.era = "All";
    state.region = "";
    state.visibleCount = PAGE_SIZE;

    searchInput.value = "";
    if (typeFilter) typeFilter.value = "";
    periodFilter.value = "";
    dietFilter.value = "";
    sortOrder.value = "name-asc";
    newOnlyFilter.checked = false;
    favoritesOnlyFilter.checked = false;

    render();
  });
}

async function loadGallery() {
  try {
    const response = await fetch("data/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.allDinosaurs = await response.json();

    setSelectOptions(typeFilter, uniqueSortedValues(state.allDinosaurs.map((d) => ({ ...d, type: d.type || "Dinosaur" })), "type"), "All Types");
    setSelectOptions(periodFilter, uniqueSortedValues(state.allDinosaurs, "period"), "All Periods");
    setSelectOptions(dietFilter, uniqueSortedValues(state.allDinosaurs, "diet"), "All Diets");

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
