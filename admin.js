const indexEditor = document.getElementById("indexEditor");
const articleEditor = document.getElementById("articleEditor");
const articleIdInput = document.getElementById("articleId");
const loadIndexBtn = document.getElementById("loadIndex");
const downloadIndexBtn = document.getElementById("downloadIndex");
const loadArticleBtn = document.getElementById("loadArticle");
const downloadArticleBtn = document.getElementById("downloadArticle");
<<<<<<< HEAD
const builderName = document.getElementById("builderName");
const builderImage = document.getElementById("builderImage");
const builderOverview = document.getElementById("builderOverview");
const builderType = document.getElementById("builderType");
const builderPeriod = document.getElementById("builderPeriod");
const builderDiet = document.getElementById("builderDiet");
const builderLocation = document.getElementById("builderLocation");
const builderClassification = document.getElementById("builderClassification");
const builderLength = document.getElementById("builderLength");
const builderHeight = document.getElementById("builderHeight");
const builderWeight = document.getElementById("builderWeight");
const builderSpeed = document.getElementById("builderSpeed");
const builderDiscovered = document.getElementById("builderDiscovered");
const builderWikitext = document.getElementById("builderWikitext");
const builderCitations = document.getElementById("builderCitations");
const builderToArticleBtn = document.getElementById("builderToArticle");
const builderFromArticleBtn = document.getElementById("builderFromArticle");
const builderModeVisualBtn = document.getElementById("builderModeVisual");
const builderModeWikitextBtn = document.getElementById("builderModeWikitext");
const builderVisualFields = document.getElementById("builderVisualFields");
const builderWikitextPreviewWrap = document.getElementById("builderWikitextPreviewWrap");
const builderWikitextPreview = document.getElementById("builderWikitextPreview");
const builderInsertHeadingBtn = document.getElementById("builderInsertHeading");
const builderInsertLinkBtn = document.getElementById("builderInsertLink");

let builderMode = "visual";
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

<<<<<<< HEAD
function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^./, (c) => c.toLowerCase());
}

function parseSimpleWikitext(raw) {
  const text = String(raw || "").replace(/\r/g, "");
  const lines = text.split("\n");
  const out = {};
  let current = "";
  let buffer = [];

  function flush() {
    if (!current || buffer.length === 0) return;
    out[current] = buffer.join(" ").replace(/\s+/g, " ").trim();
    buffer = [];
  }

  lines.forEach((line) => {
    const headingMatch = line.match(/^==+\s*(.+?)\s*==+$/);
    if (headingMatch) {
      flush();
      current = slugify(headingMatch[1]);
      return;
    }
    if (!line.trim()) return;
    if (!current) current = "notes";
    buffer.push(line.trim());
  });

  flush();
  return out;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatWikitextInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');
  out = out.replace(/\[\[([^\]]+)\]\]/g, "<strong>$1</strong>");
  out = out.replace(/\[([a-z]+:\/\/[^\s\]]+)\s+([^\]]+)\]/gi, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');
  out = out.replace(/'''([^']+)'''/g, "<strong>$1</strong>");
  out = out.replace(/''([^']+)''/g, "<em>$1</em>");
  return out;
}

function renderWikitextPreview(raw) {
  if (!builderWikitextPreview) return;
  const lines = String(raw || "").replace(/\r/g, "").split("\n");
  const html = [];
  let para = [];
  let listOpen = false;

  function flushParagraph() {
    if (para.length === 0) return;
    html.push(`<p>${formatWikitextInline(para.join(" "))}</p>`);
    para = [];
  }

  function closeList() {
    if (!listOpen) return;
    html.push("</ul>");
    listOpen = false;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }

    const headingMatch = trimmed.match(/^==+\s*(.+?)\s*==+$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      html.push(`<h5>${formatWikitextInline(headingMatch[1])}</h5>`);
      return;
    }

    if (trimmed.startsWith("*")) {
      flushParagraph();
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${formatWikitextInline(trimmed.replace(/^\*+\s*/, ""))}</li>`);
      return;
    }

    closeList();
    para.push(trimmed);
  });

  flushParagraph();
  closeList();

  builderWikitextPreview.innerHTML = html.join("") || "Start typing wikitext to preview it here.";
}

function setBuilderMode(mode) {
  builderMode = mode === "wikitext" ? "wikitext" : "visual";
  const isWikitext = builderMode === "wikitext";
  if (builderModeVisualBtn) {
    builderModeVisualBtn.classList.toggle("builder-mode-active", !isWikitext);
    builderModeVisualBtn.setAttribute("aria-selected", String(!isWikitext));
  }
  if (builderModeWikitextBtn) {
    builderModeWikitextBtn.classList.toggle("builder-mode-active", isWikitext);
    builderModeWikitextBtn.setAttribute("aria-selected", String(isWikitext));
  }
  if (builderVisualFields) builderVisualFields.hidden = isWikitext;
  if (builderOverview) builderOverview.hidden = isWikitext;
  if (builderCitations) builderCitations.hidden = isWikitext;
  if (builderWikitextPreviewWrap) builderWikitextPreviewWrap.hidden = !isWikitext;
}

function insertIntoWikitext(snippet) {
  if (!builderWikitext) return;
  const start = builderWikitext.selectionStart ?? builderWikitext.value.length;
  const end = builderWikitext.selectionEnd ?? builderWikitext.value.length;
  const before = builderWikitext.value.slice(0, start);
  const selected = builderWikitext.value.slice(start, end);
  const after = builderWikitext.value.slice(end);
  const text = snippet.replace("$SELECTION$", selected || "");
  builderWikitext.value = `${before}${text}${after}`;
  const caret = before.length + text.length;
  builderWikitext.focus();
  builderWikitext.setSelectionRange(caret, caret);
  renderWikitextPreview(builderWikitext.value);
}

function parseCitations(raw) {
  return String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((s) => s.trim());
      return {
        title: parts[0] || "Reference",
        url: parts[1] || "",
        source: parts[2] || "",
        year: parts[3] || ""
      };
    });
}

function buildArticleFromBuilder() {
  const article = {
    name: builderName.value.trim() || articleIdInput.value.trim() || "Untitled taxon",
    image: builderImage.value.trim() || "",
    overview: builderOverview.value.trim() || "Overview pending contributor expansion.",
    scientificData: {
      type: builderType.value.trim() || "Unknown",
      period: builderPeriod.value.trim() || "Unknown",
      diet: builderDiet.value.trim() || "Unknown",
      location: builderLocation.value.trim() || "Unknown",
      classification: builderClassification.value.trim() || "Unknown",
      discovered: builderDiscovered.value.trim() || "Unknown",
      length: builderLength.value.trim() || "Unknown",
      height: builderHeight.value.trim() || "Unknown",
      weight: builderWeight.value.trim() || "Unknown",
      speed: builderSpeed.value.trim() || "Unknown"
    }
  };

  const wtSections = parseSimpleWikitext(builderWikitext.value);
  Object.entries(wtSections).forEach(([key, value]) => {
    if (!key || !value) return;
    article[key] = value;
  });

  const citations = parseCitations(builderCitations.value);
  if (citations.length > 0) article.citations = citations;

  return article;
}

function loadBuilderFromArticle(article) {
  const data = article && typeof article === "object" ? article : {};
  const sci = data.scientificData && typeof data.scientificData === "object" ? data.scientificData : {};

  builderName.value = data.name || "";
  builderImage.value = data.image || "";
  builderOverview.value = data.overview || "";
  builderType.value = sci.type || "";
  builderPeriod.value = sci.period || "";
  builderDiet.value = sci.diet || "";
  builderLocation.value = sci.location || "";
  builderClassification.value = sci.classification || "";
  builderLength.value = sci.length || "";
  builderHeight.value = sci.height || "";
  builderWeight.value = sci.weight || "";
  builderSpeed.value = sci.speed || "";
  builderDiscovered.value = sci.discovered || "";

  const skip = new Set(["name", "image", "overview", "scientificData", "images", "citations"]);
  const wtLines = [];
  Object.entries(data).forEach(([key, value]) => {
    if (skip.has(key)) return;
    if (value === null || value === undefined) return;
    wtLines.push(`== ${key} ==`);
    wtLines.push(typeof value === "string" ? value : JSON.stringify(value));
    wtLines.push("");
  });
  builderWikitext.value = wtLines.join("\n").trim();

  const cites = Array.isArray(data.citations) ? data.citations : [];
  builderCitations.value = cites.map((c) => [c.title || "", c.url || "", c.source || "", c.year || ""].join(" | ")).join("\n");
}

=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
async function loadJson(path, target) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not load ${path}`);
  const raw = await res.text();
  target.value = raw;
}

loadIndexBtn.addEventListener("click", async () => {
  try {
    await loadJson("data/index.json", indexEditor);
  } catch (e) {
    alert(e.message);
  }
});

downloadIndexBtn.addEventListener("click", () => {
  try {
    JSON.parse(indexEditor.value);
    downloadFile("index.json", indexEditor.value);
  } catch {
    alert("Index JSON is invalid.");
  }
});

loadArticleBtn.addEventListener("click", async () => {
  const id = articleIdInput.value.trim();
  if (!id) {
    alert("Enter an article id first.");
    return;
  }
  try {
    await loadJson(`data/${encodeURIComponent(id)}.json`, articleEditor);
  } catch (e) {
    alert(e.message);
  }
});

downloadArticleBtn.addEventListener("click", () => {
  const id = articleIdInput.value.trim() || "article";
  try {
    JSON.parse(articleEditor.value);
    downloadFile(`${id}.json`, articleEditor.value);
  } catch {
    alert("Article JSON is invalid.");
  }
});
<<<<<<< HEAD

if (builderToArticleBtn) {
  builderToArticleBtn.addEventListener("click", () => {
    try {
      const built = buildArticleFromBuilder();
      articleEditor.value = JSON.stringify(built, null, 2);
    } catch (e) {
      alert(`Could not build article JSON: ${e.message}`);
    }
  });
}

if (builderFromArticleBtn) {
  builderFromArticleBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(articleEditor.value || "{}");
      loadBuilderFromArticle(parsed);
    } catch {
      alert("Article JSON is invalid.");
    }
  });
}

if (builderModeVisualBtn) {
  builderModeVisualBtn.addEventListener("click", () => setBuilderMode("visual"));
}

if (builderModeWikitextBtn) {
  builderModeWikitextBtn.addEventListener("click", () => setBuilderMode("wikitext"));
}

if (builderInsertHeadingBtn) {
  builderInsertHeadingBtn.addEventListener("click", () => {
    setBuilderMode("wikitext");
    insertIntoWikitext("\n== New section ==\n$SELECTION$\n");
  });
}

if (builderInsertLinkBtn) {
  builderInsertLinkBtn.addEventListener("click", () => {
    setBuilderMode("wikitext");
    insertIntoWikitext("[https://example.com $SELECTION$]");
  });
}

if (builderWikitext) {
  builderWikitext.addEventListener("input", () => renderWikitextPreview(builderWikitext.value));
}

async function initFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = String(params.get("id") || params.get("dino") || "").trim();
  if (!id) return;

  articleIdInput.value = id;
  try {
    await loadJson(`data/${encodeURIComponent(id)}.json`, articleEditor);
    const parsed = JSON.parse(articleEditor.value || "{}");
    loadBuilderFromArticle(parsed);
  } catch {
    // no-op: keep editor usable even if file is missing
  }
}

setBuilderMode("visual");
renderWikitextPreview(builderWikitext?.value || "");
initFromUrl();
=======
>>>>>>> eb5bc0419e2d2523b8f33fa53c68b9e22cb56935
