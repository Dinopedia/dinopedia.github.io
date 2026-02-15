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

const FAVORITES_KEY = "dinoPediaFavorites";
const COMPARE_KEY = "dinoPediaCompare";
const wikiThumbCache = new Map();
const LOCAL_FALLBACK_IMAGES = [
  { url: "images/trex-skull.png", caption: "Image unavailable for this section" }
];

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
let articleSearchHits = [];
let activeSearchHit = -1;

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

function prettyTitle(key) {
  return textFix(
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/^./, (c) => c.toUpperCase())
  );
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.map((v) => textFix(String(v))).join(", ");
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${prettyTitle(k)}: ${normalizeValue(v)}`)
      .join("; ");
  }
  return textFix(String(value));
}

function sentenceCase(text) {
  const clean = textFix(String(text || "")).trim();
  if (!clean) return "";
  return clean[0].toUpperCase() + clean.slice(1);
}

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

function buildQuickFacts(base, detail) {
  quickFactsEl.innerHTML = "";
  addFact("Name", detail?.name || base.name || "Unknown");
  addFact("Type", base.type || "Dinosaur");

  const scientificData = detail?.scientificData || null;

  if (scientificData && typeof scientificData === "object") {
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
      : `${dinoName} ${prettyTitle(key).toLowerCase()} is interpreted as ${normalizeValue(itemValue)}. This interpretation may be revised as new specimens are described.`;
    renderLinkedText(paragraph, text, dinoId);
    sub.appendChild(paragraph);

    section.appendChild(sub);
  });
}

function renderListSection(section, value) {
  if (Array.isArray(value)) {
    const paragraph = document.createElement("p");
    paragraph.className = "section-paragraph";
    renderLinkedText(paragraph, `Documented points include ${normalizeValue(value)}.`, dinoId);
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
      renderLinkedText(paragraph, `${prettyTitle(k)} is currently described as ${normalizeValue(v)}.`, dinoId);
      sub.appendChild(paragraph);

      section.appendChild(sub);
    });
  } else {
    const paragraph = document.createElement("p");
    paragraph.className = "section-paragraph";
    renderLinkedText(paragraph, sentenceCase(normalizeValue(value)), dinoId);
    section.appendChild(paragraph);
  }
}

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
    .filter((key) => value[key])
    .map((key) => `${prettyTitle(key)}: ${normalizeValue(value[key])}`);

  if (sizeBits.length > 0) {
    appendDetailSubsection(
      section,
      "Size",
      `${dinoName} had the following size estimates: ${sizeBits.join("; ")}. These ranges are produced from specimen scaling and can shift with improved reconstructions.`,
      "size"
    );
  }

  const classification = value.classification ? normalizeValue(value.classification) : "";
  const type = value.type ? normalizeValue(value.type) : "";
  if (classification || type) {
    const classText = [type, classification].filter(Boolean).join(" within ");
    appendDetailSubsection(
      section,
      "Classification",
      `${dinoName} is currently placed as ${classText}. This placement can change when new comparative analyses are published.`,
      "classification"
    );
  }

  const historyBits = ["discovered", "period", "location"]
    .filter((key) => value[key])
    .map((key) => `${prettyTitle(key)}: ${normalizeValue(value[key])}`);

  if (historyBits.length > 0) {
    appendDetailSubsection(
      section,
      "Research context",
      `${historyBits.join("; ")}. This context is important for understanding where evidence quality is strongest.`,
      "history"
    );
  }

  const covered = new Set(["length", "height", "weight", "speed", "classification", "type", "discovered", "period", "location"]);
  Object.entries(value).forEach(([key, itemValue]) => {
    if (covered.has(key)) return;
    appendDetailSubsection(
      section,
      prettyTitle(key),
      `${dinoName} ${prettyTitle(key).toLowerCase()} is described as ${normalizeValue(itemValue)}.`,
      key
    );
  });
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

function renderGeneratedDeepDive(base, detail, dinoName) {
  const scientific = detail?.scientificData || {};
  const period = scientific.period || base.period || "an uncertain interval";
  const region = scientific.location || base.where || "uncertain regions";
  const diet = scientific.diet || base.diet || "an uncertain diet";
  const type = base.type || scientific.type || "prehistoric reptile";

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
    `${dinoName} is interpreted as a ${String(diet).toLowerCase()} organism. Functional interpretation uses jaw mechanics, tooth form, body-mass scaling, and associated fauna where available. Evidence quality varies by specimen completeness, but most reconstructions indicate a specialized feeding profile rather than a fully generalized one.`
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
  img.onerror = () => {
    img.onerror = null;
    const blocked = new Set([imageDedupKey(item.url), ...usedInlineKeys]);
    const local = pickLocalFallback(blocked);
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

function pickLocalFallback(excluded = new Set()) {
  for (const candidate of LOCAL_FALLBACK_IMAGES) {
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
  const period = scientific.period || base?.period || "an uncertain period";
  const diet = scientific.diet || base?.diet || "an uncertain diet";
  const location = scientific.location || base?.where || "uncertain regions";
  const type = base?.type || scientific.type || "prehistoric reptile";
  const length = scientific.length ? `Length estimates include ${scientific.length}.` : "";
  const weight = scientific.weight ? `Mass estimates include ${scientific.weight}.` : "";

  dinoInsightEl.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = "Dino-pedia Notes";

  const para = document.createElement("p");
  renderLinkedText(
    para,
    `${name} is currently interpreted as a ${diet.toLowerCase()} ${String(type).toLowerCase()} from ${period}, documented from ${location}. ${length} ${weight} This article combines index data, detailed entry notes, and linked related taxa so you can compare evidence quickly in one place.`,
    dinoId
  );

  dinoInsightEl.append(heading, para);
}

function buildTags(base, detail) {
  tagsEl.innerHTML = "";
  const tags = new Set();

  if (base.period) tags.add(base.period);
  if (base.diet) tags.add(base.diet);
  if (base.where) tags.add(base.where);
  if (base.type) tags.add(base.type);

  const classification = detail?.scientificData?.classification;
  if (classification) tags.add(classification);

  Object.keys(detail || {})
    .filter((key) => !["name", "image", "overview"].includes(key))
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
    const indexResponse = await fetch("data/index.json", { cache: "no-store" });
    if (!indexResponse.ok) throw new Error(`Index load failed: HTTP ${indexResponse.status}`);

    allDinosaurs = await indexResponse.json();
    buildNameLookup();
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

    imageEl.src = imagePath(detail?.image || base.image);
    imageEl.alt = activeName;
    imageEl.onerror = async () => {
      imageEl.onerror = null;
      const wikiThumb = await getWikiThumbByName(activeName);
      imageEl.src = wikiThumb || "images/trex-skull.png";
    };
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
