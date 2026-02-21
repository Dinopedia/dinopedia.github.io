const COMPARE_KEY = "dinoPediaCompare";
const compareGrid = document.getElementById("compareGrid");
const clearBtn = document.getElementById("clearCompare");
const addSelect = document.getElementById("addCompareSelect");
const addBtn = document.getElementById("addCompareBtn");
const summaryEl = document.getElementById("compareSummary");

let indexData = [];

function safeJsonParse(raw, fallback) {
  try { const parsed = JSON.parse(raw); return parsed ?? fallback; } catch { return fallback; }
}

function getCompareIds() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = (params.get("ids") || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (fromQuery.length > 0) return fromQuery.slice(0, 4);
  return safeJsonParse(localStorage.getItem(COMPARE_KEY) || "[]", []).filter(Boolean).slice(0, 4);
}

function setCompareIds(ids) {
  const limited = ids.filter(Boolean).slice(0, 4);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(limited));
  const params = new URLSearchParams();
  if (limited.length > 0) params.set("ids", limited.join(","));
  history.replaceState(null, "", `compare.html${params.toString() ? `?${params}` : ""}`);
}

function imagePath(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("images/") ? path : `images/${path}`;
}

function renderEmpty(message) {
  compareGrid.innerHTML = "";
  const box = document.createElement("div");
  box.className = "empty-state";
  box.textContent = message;
  compareGrid.appendChild(box);
}

function row(label, value) {
  const div = document.createElement("div");
  div.className = "compare-row";
  div.innerHTML = `<strong>${label}</strong><span>${value || "Unknown"}</span>`;
  return div;
}

function buildSelectOptions(ids) {
  addSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose dinosaur to add";
  addSelect.appendChild(placeholder);

  indexData
    .filter((d) => !ids.includes(d.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      addSelect.appendChild(opt);
    });
}

function removeFromCompare(id) {
  const ids = getCompareIds().filter((x) => x !== id);
  setCompareIds(ids);
  render();
}

async function cardFor(dino) {
  let detail = null;
  try {
    const res = await fetch(`data/${encodeURIComponent(dino.id)}.json`, { cache: "no-store" });
    if (res.ok) detail = await res.json();
  } catch {}

  const card = document.createElement("article");
  card.className = "card compare-card";

  const title = document.createElement("h3");
  title.textContent = dino.name;

  const img = document.createElement("img");
  img.className = "entry-thumb";
  img.src = imagePath(detail?.image || dino.image);
  img.alt = dino.name;

  const removeBtn = document.createElement("button");
  removeBtn.className = "control-button";
  removeBtn.type = "button";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => removeFromCompare(dino.id));

  const body = document.createElement("div");
  body.className = "compare-table";
  body.append(
    row("Period", dino.period),
    row("Diet", dino.diet),
    row("Region", dino.where),
    row("Classification", detail?.scientificData?.classification),
    row("Length", detail?.scientificData?.length),
    row("Weight", detail?.scientificData?.weight),
    row("Speed", detail?.scientificData?.speed)
  );

  const open = document.createElement("a");
  open.href = `dino.html?dino=${encodeURIComponent(dino.id)}`;
  open.className = "read-link";
  open.textContent = "Open article";

  card.append(title, img, removeBtn, body, open);
  return card;
}

async function render() {
  const ids = getCompareIds();
  buildSelectOptions(ids);

  if (ids.length === 0) {
    summaryEl.textContent = "No dinosaurs selected yet. Add up to 4 to compare.";
    renderEmpty("No dinosaurs selected. Use the selector above to add entries.");
    return;
  }

  const selected = ids.map((id) => indexData.find((d) => d.id === id)).filter(Boolean);
  summaryEl.textContent = `${selected.length} dinosaur(s) in comparison.`;

  compareGrid.innerHTML = "";
  for (const dino of selected) {
    compareGrid.appendChild(await cardFor(dino));
  }
}

addBtn.addEventListener("click", () => {
  const id = addSelect.value;
  if (!id) return;
  const ids = getCompareIds();
  if (ids.includes(id)) return;
  if (ids.length >= 4) {
    alert("Compare supports up to 4 dinosaurs.");
    return;
  }
  ids.push(id);
  setCompareIds(ids);
  render();
});

clearBtn.addEventListener("click", () => {
  setCompareIds([]);
  render();
});

async function init() {
  const res = await fetch("data/index.json", { cache: "no-store" });
  if (!res.ok) {
    summaryEl.textContent = "Could not load comparison data.";
    return;
  }
  indexData = await res.json();
  render();
}

init();
