const timelineListEl = document.getElementById("timelineList");
const timelineStatusEl = document.getElementById("timelineStatus");
const timelineSearchEl = document.getElementById("timelineSearch");
const timelineCanvasEl = document.getElementById("timelineCanvas");
const timelineTitleEl = document.getElementById("timelineTitle");
const zoomRangeEl = document.getElementById("zoomRange");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomInBtn = document.getElementById("zoomIn");
const typeDinosaurEl = document.getElementById("typeDinosaur");
const typeAerialEl = document.getElementById("typeAerial");
const typeOceanEl = document.getElementById("typeOcean");

const NAME_COL_WIDTH = 220;
const ROW_HEIGHT = 28;
const MIN_PLOT_WIDTH = 1500;

const state = {
  all: [],
  query: "",
  zoom: Number(zoomRangeEl?.value || 12),
  showDinosaur: true,
  showAerial: true,
  showOcean: true
};

function getEra(period) {
  const p = String(period || "").toLowerCase();
  if (p.includes("triassic")) return "Triassic";
  if (p.includes("jurassic")) return "Jurassic";
  if (p.includes("cretaceous")) return "Cretaceous";
  return "Unknown";
}

function parseRangeFromPeriodText(period) {
  const text = String(period || "");
  const match = text.match(/(\d+(?:\.\d+)?)\s*[-to]+\s*(\d+(?:\.\d+)?)\s*(?:million)?/i);
  if (!match) return [null, null];

  const a = Number(match[1]);
  const b = Number(match[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return [null, null];

  return [Math.max(a, b), Math.min(a, b)];
}

function estimateRangeMya(period) {
  const p = String(period || "").toLowerCase();

  if (p.includes("late cretaceous")) return [100, 66];
  if (p.includes("early cretaceous")) return [145, 100];
  if (p.includes("cretaceous")) return [145, 66];

  if (p.includes("late jurassic")) return [163, 145];
  if (p.includes("middle jurassic")) return [174, 163];
  if (p.includes("early jurassic")) return [201, 174];
  if (p.includes("jurassic")) return [201, 145];

  if (p.includes("late triassic")) return [237, 201];
  if (p.includes("middle triassic")) return [247, 237];
  if (p.includes("early triassic")) return [252, 247];
  if (p.includes("triassic")) return [252, 201];

  return [null, null];
}

function getRangeMya(entry) {
  const explicit = parseRangeFromPeriodText(entry.period);
  if (explicit[0] && explicit[1]) return explicit;
  return estimateRangeMya(entry.period);
}

function getTypeGroup(entry) {
  if (entry.type === "Avian Reptile") return "Aerial";
  if (entry.type === "Marine Reptile") return "Marine";
  return "Dinosaur";
}

function matches(entry) {
  const query = state.query.toLowerCase();
  const text = `${entry.name || ""} ${entry.where || ""}`.toLowerCase();
  const type = getTypeGroup(entry);

  const typeOk = (type === "Dinosaur" && state.showDinosaur) || (type === "Aerial" && state.showAerial) || (type === "Marine" && state.showOcean);

  return (!query || text.includes(query)) && typeOk;
}

function sortByTime(list) {
  return [...list].sort((a, b) => {
    const [aStart, aEnd] = getRangeMya(a);
    const [bStart, bEnd] = getRangeMya(b);
    const aMid = aStart && aEnd ? (aStart + aEnd) / 2 : -1;
    const bMid = bStart && bEnd ? (bStart + bEnd) / 2 : -1;
    return bMid - aMid || (a.name || "").localeCompare(b.name || "");
  });
}

function computeBounds(entries) {
  const ranges = entries.map(getRangeMya).filter(([start, end]) => start && end);
  if (ranges.length === 0) return { older: 260, recent: 60, span: 200 };

  const oldest = Math.max(...ranges.map(([start]) => start));
  const newest = Math.min(...ranges.map(([, end]) => end));
  const older = Math.ceil(oldest / 10) * 10;
  const recent = Math.floor(newest / 10) * 10;
  const span = Math.max(older - recent, 1);

  return { older, recent, span };
}

function ratioFromMya(value, bounds) {
  return (bounds.older - value) / bounds.span;
}

function pxPerMya() {
  return state.zoom;
}

function rangeLabel(entry) {
  const [start, end] = getRangeMya(entry);
  if (!start || !end) return "Unknown";
  return `${start}-${end} mya`;
}

function createSidebarList(entries) {
  timelineListEl.innerHTML = "";

  entries.forEach((entry) => {
    const item = document.createElement("a");
    item.className = "timeline-side-item";
    item.href = `dino.html?dino=${encodeURIComponent(entry.id)}`;

    const name = document.createElement("strong");
    name.textContent = entry.name;

    const meta = document.createElement("span");
    meta.textContent = rangeLabel(entry);

    item.append(name, meta);
    timelineListEl.appendChild(item);
  });
}

function addEraBand(chart, bounds, plotWidth, label, start, end, className) {
  const left = NAME_COL_WIDTH + ratioFromMya(start, bounds) * plotWidth;
  const width = Math.max((ratioFromMya(end, bounds) - ratioFromMya(start, bounds)) * plotWidth, 2);

  const band = document.createElement("div");
  band.className = `timeline-era-band ${className}`;
  band.style.left = `${left}px`;
  band.style.width = `${width}px`;

  const title = document.createElement("span");
  title.className = "timeline-era-label";
  title.textContent = label;
  band.appendChild(title);

  chart.appendChild(band);
}

function createChart(entries) {
  timelineCanvasEl.innerHTML = "";

  const bounds = computeBounds(entries);
  const plotWidth = Math.max(MIN_PLOT_WIDTH, Math.round(bounds.span * pxPerMya()));
  const plotHeight = Math.max(entries.length * ROW_HEIGHT + 90, 240);

  const viewport = document.createElement("div");
  viewport.className = "timeline-chart-scrollview";

  const chart = document.createElement("div");
  chart.className = "timeline-chart-canvas";
  chart.style.width = `${NAME_COL_WIDTH + plotWidth}px`;
  chart.style.height = `${plotHeight}px`;

  const axis = document.createElement("div");
  axis.className = "timeline-axis-sticky";
  axis.style.left = `${NAME_COL_WIDTH}px`;
  axis.style.width = `${plotWidth}px`;
  chart.appendChild(axis);

  addEraBand(chart, bounds, plotWidth, "Triassic", 252, 201, "era-triassic");
  addEraBand(chart, bounds, plotWidth, "Jurassic", 201, 145, "era-jurassic");
  addEraBand(chart, bounds, plotWidth, "Cretaceous", 145, 66, "era-cretaceous");

  const tickStep = bounds.span > 200 ? 20 : 10;
  for (let value = bounds.older; value >= bounds.recent; value -= tickStep) {
    const x = NAME_COL_WIDTH + ratioFromMya(value, bounds) * plotWidth;

    const grid = document.createElement("div");
    grid.className = "timeline-grid-line";
    grid.style.left = `${x}px`;
    grid.style.top = "34px";
    grid.style.height = `${plotHeight - 34}px`;
    chart.appendChild(grid);

    const tick = document.createElement("span");
    tick.className = "timeline-top-tick";
    tick.style.left = `${x}px`;
    tick.textContent = `${value} mya`;
    axis.appendChild(tick);
  }

  entries.forEach((entry, i) => {
    const rowY = 56 + i * ROW_HEIGHT;

    const [start, end] = getRangeMya(entry);

    if (!start || !end) return;

    const left = NAME_COL_WIDTH + ratioFromMya(start, bounds) * plotWidth;
    const width = Math.max((ratioFromMya(end, bounds) - ratioFromMya(start, bounds)) * plotWidth, 3);

    const bar = document.createElement("a");
    bar.className = `timeline-row-bar ${getTypeGroup(entry).toLowerCase()}`;
    bar.href = `dino.html?dino=${encodeURIComponent(entry.id)}`;
    bar.style.left = `${left}px`;
    bar.style.top = `${rowY}px`;
    bar.style.width = `${width}px`;
    bar.title = `${entry.name}: ${rangeLabel(entry)}`;

    const label = document.createElement("span");
    label.className = "timeline-bar-label";
    if (width < 120) label.classList.add("timeline-bar-label-outside");
    label.textContent = entry.name;
    bar.appendChild(label);

    chart.appendChild(bar);
  });

  viewport.appendChild(chart);
  timelineCanvasEl.appendChild(viewport);

  timelineTitleEl.textContent = `Prehistoric Timeline (${bounds.older}-${bounds.recent} mya)`;
}

function render() {
  const filtered = sortByTime(
    state.all
      .filter(matches)
      .filter((entry) => {
        const [start, end] = getRangeMya(entry);
        return Boolean(start && end);
      })
  );

  if (filtered.length === 0) {
    timelineStatusEl.textContent = "No entries match your timeline filters.";
    timelineCanvasEl.innerHTML = "<div class='empty-state'>No timeline entries found.</div>";
    timelineListEl.innerHTML = "";
    return;
  }

  timelineStatusEl.textContent = `${filtered.length} entries shown (${state.all.length} total).`;
  createSidebarList(filtered);
  createChart(filtered);
}

function bindEvents() {
  timelineSearchEl.addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    render();
  });

  zoomRangeEl.addEventListener("input", (e) => {
    state.zoom = Number(e.target.value);
    render();
  });

  zoomOutBtn.addEventListener("click", () => {
    state.zoom = Math.max(4, state.zoom - 1);
    zoomRangeEl.value = String(state.zoom);
    render();
  });

  zoomInBtn.addEventListener("click", () => {
    state.zoom = Math.min(18, state.zoom + 1);
    zoomRangeEl.value = String(state.zoom);
    render();
  });

  typeDinosaurEl.addEventListener("change", (e) => {
    state.showDinosaur = e.target.checked;
    render();
  });

  typeAerialEl.addEventListener("change", (e) => {
    state.showAerial = e.target.checked;
    render();
  });

  typeOceanEl.addEventListener("change", (e) => {
    state.showOcean = e.target.checked;
    render();
  });
}

async function init() {
  try {
    const response = await fetch("data/index.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.all = await response.json();
    render();
  } catch (error) {
    timelineStatusEl.textContent = "Could not load timeline right now.";
    timelineStatusEl.classList.add("status-error");
    console.error(error);
  }
}

bindEvents();
init();
