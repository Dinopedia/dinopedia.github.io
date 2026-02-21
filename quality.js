const auditSummaryEl = document.getElementById("auditSummary");
const auditBodyEl = document.getElementById("auditBody");
const auditCardsEl = document.getElementById("auditCards");
const auditSearchEl = document.getElementById("auditSearch");
const auditFilterEl = document.getElementById("auditFilter");
const auditSortEl = document.getElementById("auditSort");

const state = {
  rows: [],
  search: "",
  filter: "all",
  sort: "score-asc"
};

function safeWordCount(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.map((v) => normalizeValue(v)).join(" ");
  if (value && typeof value === "object") {
    return Object.entries(value).map(([k, v]) => `${k} ${normalizeValue(v)}`).join(" ");
  }
  return String(value || "");
}

function scoreRow(row) {
  let score = 100;
  if (row.imagesCount < 3) score -= 25;
  if (row.imagesCount < 2) score -= 10;
  if (row.sectionsCount < 8) score -= 20;
  if (row.sectionsCount < 5) score -= 10;
  if (row.wordsCount < 220) score -= 20;
  if (row.wordsCount < 120) score -= 15;
  return Math.max(0, score);
}

function statusLabel(row) {
  const issues = [];
  if (row.imagesCount < 3) issues.push("low images");
  if (row.sectionsCount < 8) issues.push("low sections");
  if (row.wordsCount < 220) issues.push("low words");
  return issues.length === 0 ? "healthy" : issues.join(", ");
}

async function fetchDetail(id) {
  try {
    const response = await fetch(`data/${encodeURIComponent(id)}.json`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function loadAudit() {
  try {
    const indexResponse = await fetch("data/index.json", { cache: "no-store" });
    if (!indexResponse.ok) throw new Error(`Index failed: ${indexResponse.status}`);
    const index = await indexResponse.json();

    const rows = [];
    for (let i = 0; i < index.length; i += 1) {
      const item = index[i];
      if (i % 40 === 0) {
        auditSummaryEl.textContent = `Auditing ${i} / ${index.length}...`;
      }
      const detail = await fetchDetail(item.id);
      const imageSet = new Set();
      if (item.image) imageSet.add(String(item.image));
      if (detail?.image) imageSet.add(String(detail.image));
      if (Array.isArray(detail?.images)) {
        detail.images.forEach((img) => {
          if (typeof img === "string" && img) imageSet.add(img);
          if (img && typeof img === "object" && img.url) imageSet.add(img.url);
        });
      }

      const sectionEntries = detail && typeof detail === "object"
        ? Object.entries(detail).filter(([k]) => !["name", "image", "images", "overview"].includes(k))
        : [];

      const bodyWords =
        safeWordCount(detail?.overview || "") +
        safeWordCount(sectionEntries.map(([, v]) => normalizeValue(v)).join(" "));

      const row = {
        id: item.id,
        name: detail?.name || item.name || item.id,
        imagesCount: imageSet.size,
        sectionsCount: sectionEntries.length,
        wordsCount: bodyWords
      };
      row.score = scoreRow(row);
      row.status = statusLabel(row);
      rows.push(row);
    }

    state.rows = rows;
    render();
  } catch (error) {
    auditSummaryEl.textContent = "Quality audit failed to load.";
    console.error(error);
  }
}

function filteredRows() {
  const search = state.search.toLowerCase();
  let rows = state.rows.filter((r) => !search || r.name.toLowerCase().includes(search));

  if (state.filter === "needs-work") rows = rows.filter((r) => r.status !== "healthy");
  if (state.filter === "images-low") rows = rows.filter((r) => r.imagesCount < 3);
  if (state.filter === "sections-low") rows = rows.filter((r) => r.sectionsCount < 8);
  if (state.filter === "words-low") rows = rows.filter((r) => r.wordsCount < 220);

  if (state.sort === "score-asc") rows.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
  if (state.sort === "score-desc") rows.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  if (state.sort === "name-asc") rows.sort((a, b) => a.name.localeCompare(b.name));

  return rows;
}

function renderCards(rows) {
  auditCardsEl.innerHTML = "";
  const lowImages = state.rows.filter((r) => r.imagesCount < 3).length;
  const lowSections = state.rows.filter((r) => r.sectionsCount < 8).length;
  const lowWords = state.rows.filter((r) => r.wordsCount < 220).length;
  const healthy = state.rows.filter((r) => r.status === "healthy").length;

  const cards = [
    { label: "Total audited", value: state.rows.length },
    { label: "Healthy", value: healthy },
    { label: "Low images", value: lowImages },
    { label: "Low sections", value: lowSections },
    { label: "Low words", value: lowWords },
    { label: "Shown rows", value: rows.length }
  ];

  cards.forEach((card) => {
    const panel = document.createElement("article");
    panel.className = "card-paper";
    panel.innerHTML = `<h3>${card.label}</h3><p>${card.value}</p>`;
    auditCardsEl.appendChild(panel);
  });
}

function renderTable(rows) {
  auditBodyEl.innerHTML = "";
  rows.slice(0, 500).forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.score}</td>
      <td>${row.imagesCount}</td>
      <td>${row.sectionsCount}</td>
      <td>${row.wordsCount}</td>
      <td>${row.status}</td>
      <td><a class="read-link" href="dino.html?dino=${encodeURIComponent(row.id)}">Open</a></td>
    `;
    auditBodyEl.appendChild(tr);
  });
}

function render() {
  const rows = filteredRows();
  renderCards(rows);
  renderTable(rows);
  auditSummaryEl.textContent = `${rows.length} rows shown (${state.rows.length} audited).`;
}

function bindEvents() {
  auditSearchEl.addEventListener("input", (e) => {
    state.search = e.target.value.trim();
    render();
  });
  auditFilterEl.addEventListener("change", (e) => {
    state.filter = e.target.value;
    render();
  });
  auditSortEl.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });
}

bindEvents();
loadAudit();
