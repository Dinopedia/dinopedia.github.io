const indexEditor = document.getElementById("indexEditor");
const articleEditor = document.getElementById("articleEditor");
const articleIdInput = document.getElementById("articleId");
const loadIndexBtn = document.getElementById("loadIndex");
const downloadIndexBtn = document.getElementById("downloadIndex");
const loadArticleBtn = document.getElementById("loadArticle");
const downloadArticleBtn = document.getElementById("downloadArticle");

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
