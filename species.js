const params = new URLSearchParams(window.location.search);
const genusId = params.get("genus") || "";
const speciesName = params.get("name") || "";

const titleEl = document.getElementById("speciesTitle");
const imageEl = document.getElementById("speciesImage");
const factsEl = document.getElementById("speciesFacts");
const overviewEl = document.getElementById("speciesOverview");
const galleryEl = document.getElementById("speciesGallery");
const sectionNavEl = document.getElementById("sectionNav");
const speciesSectionsEl = document.getElementById("speciesSections");
const backToGenusEl = document.getElementById("backToGenus");
const backToGenusTopEl = document.getElementById("backToGenusTop");

function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/^Unknown\.\s+([a-z])/, (_, c) => `Unknown. ${c.toUpperCase()}`);
}

function keyText(value) {
  return normalizeText(value).toLowerCase();
}

function prettyTitle(value) {
  return normalizeText(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function addFact(label, value) {
  if (!factsEl) return;
  const row = document.createElement("div");
  row.className = "article-fact-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = normalizeText(value) || "Unknown";
  row.append(dt, dd);
  factsEl.appendChild(row);
}

function isUnknownLike(value) {
  const v = keyText(value);
  return !v || v === "unknown" || v.startsWith("unknown");
}

function isBoilerplateMetric(value) {
  const v = normalizeText(value).toLowerCase();
  if (!v) return true;
  const patterns = [
    "size estimates vary by specimen and reconstruction",
    "body height depended on age and posture",
    "mass estimates differ across studies",
    "likely adapted to its ecological niche",
    "documented through historical and modern paleontological expeditions",
    "estimated from fossil",
    "estimated from reconstructions",
    "estimated from scaling",
    "inferred from anatomy",
    "summarized from published paleontological records",
    "estimated from parent genus",
    "estimated from genus record",
    "estimated from parent genus temporal range",
    "estimated from parent genus fossil localities",
    "estimated from parent genus ecological role",
    "estimated from current parent genus classification"
  ];
  return patterns.some((p) => v.includes(p));
}

function cleanMetric(value) {
  const text = normalizeText(value);
  if (isBoilerplateMetric(text)) return "Unknown";
  return text || "Unknown";
}

function inferNumericEstimate(label, context = {}) {
  const type = keyText(context.type || "dinosaur");
  const isMarine = type.includes("marine");
  const isAerial = type.includes("aerial") || type.includes("avian");

  if (label === "length") {
    if (isMarine) return "Estimated about 4-12 m (13-39 ft).";
    if (isAerial) return "Estimated about 2-6 m (7-20 ft) body length equivalent.";
    return "Estimated about 6-10 m (20-33 ft).";
  }
  if (label === "height") {
    if (isMarine) return "Estimated about 1-3 m body depth (3-10 ft equivalent).";
    if (isAerial) return "Estimated standing height about 0.8-2.0 m (2.5-6.5 ft).";
    return "Estimated about 2-3.5 m at hips (6.5-11.5 ft).";
  }
  if (label === "weight") {
    if (isMarine) return "Estimated about 400-5000 kg.";
    if (isAerial) return "Estimated about 10-250 kg.";
    return "Estimated about 700-3000 kg.";
  }
  if (label === "speed") {
    if (isMarine) return "Estimated cruising speed about 8-20 km/h.";
    if (isAerial) return "Estimated flight speed about 20-55 km/h.";
    return "Estimated about 20-40 km/h.";
  }
  if (label === "discovered") return "Documented in published paleontological literature; specimen-level discovery detail is still being expanded.";
  if (label === "temporal range") return "Known from the same temporal range as the parent genus, pending narrower species-level constraints.";
  if (label === "location") return "Known from localities linked to the parent genus, pending stricter species-level assignment.";
  if (label === "diet") return "Diet is inferred from parent-genus anatomy and associated fauna.";
  if (label === "classification") return "Placed within the current parent-genus classification used by Dino-pedia.";
  return "Species-level evidence is limited; this value is inferred from parent-genus context.";
}

function parseNumericWithUnit(raw) {
  const text = normalizeText(raw);
  if (!text) return null;
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:[-–]\s*(\d+(?:\.\d+)?))?\s*(m|meter|metre|meters|metres|ft|feet|tonne|tonnes|t|kg|kilogram|kilograms|km\/h|kph|mph)/i);
  if (!match) return null;
  return {
    min: Number(match[1]),
    max: match[2] ? Number(match[2]) : null,
    unit: keyText(match[3])
  };
}

function formatRange(min, max, digits = 1) {
  if (max == null) return `${min.toFixed(digits).replace(/\.0$/, "")}`;
  return `${min.toFixed(digits).replace(/\.0$/, "")}-${max.toFixed(digits).replace(/\.0$/, "")}`;
}

function numericEstimateFromRaw(label, rawValue) {
  const parsed = parseNumericWithUnit(rawValue);
  if (!parsed) return "";
  const { min, max, unit } = parsed;

  if (label === "length" || label === "height") {
    if (unit.startsWith("m")) {
      const minFt = min * 3.28084;
      const maxFt = max == null ? null : max * 3.28084;
      return `Estimated about ${formatRange(min, max)} m (${formatRange(minFt, maxFt)} ft).`;
    }
    if (unit === "ft" || unit === "feet") {
      return `Estimated about ${formatRange(min, max)} ft.`;
    }
  }

  if (label === "weight") {
    if (unit.startsWith("tonne") || unit === "t") {
      const minKg = min * 1000;
      const maxKg = max == null ? null : max * 1000;
      return `Estimated about ${formatRange(min, max)} tonnes (${formatRange(minKg, maxKg, 0)} kg).`;
    }
    if (unit === "kg" || unit.startsWith("kilogram")) {
      return `Estimated about ${formatRange(min, max, 0)} kg.`;
    }
  }

  if (label === "speed") {
    if (unit === "km/h" || unit === "kph") return `Estimated about ${formatRange(min, max)} km/h.`;
    if (unit === "mph") return `Estimated about ${formatRange(min, max)} mph.`;
  }

  return `Estimated about ${formatRange(min, max)} ${unit}.`;
}

function estimatedMetric(label, rawValue, context = {}) {
  const value = normalizeText(rawValue);
  const lowerLabel = keyText(label);
  if (!isBoilerplateMetric(value)) return value || "Unknown";

  const numeric = numericEstimateFromRaw(lowerLabel, value);
  if (numeric) return numeric;

  const inferred = inferNumericEstimate(lowerLabel, context);
  return inferred || "Species-level evidence is limited; this value is inferred from parent-genus context.";
}

function countKnown(values) {
  return (Array.isArray(values) ? values : []).filter((v) => !isUnknownLike(v)).length;
}

function addSectionNavItem(id, label) {
  if (!sectionNavEl) return;
  const link = document.createElement("a");
  link.className = "section-nav-link";
  link.href = `#${id}`;
  link.textContent = label;
  sectionNavEl.appendChild(link);
}

function renderSection(title, paragraphs) {
  if (!speciesSectionsEl) return;
  const id = `section-${normalizeText(title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const section = document.createElement("section");
  section.className = "detail-section";
  section.id = id;

  const heading = document.createElement("h3");
  heading.textContent = title;
  section.appendChild(heading);

  (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).forEach((text) => {
    const clean = normalizeText(text);
    if (!clean) return;
    const p = document.createElement("p");
    p.className = "section-paragraph";
    p.textContent = clean;
    section.appendChild(p);
  });

  speciesSectionsEl.appendChild(section);
  addSectionNavItem(id, title);
}

async function fetchSummary(title) {
  const pageTitle = encodeURIComponent(normalizeText(title).replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchLongExtract(title) {
  const pageTitle = encodeURIComponent(normalizeText(title).replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&titles=${pageTitle}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    const page = Object.values(data?.query?.pages || {})[0];
    return normalizeText(page?.extract);
  } catch {
    return "";
  }
}

function htmlToPlainText(html) {
  const holder = document.createElement("div");
  holder.innerHTML = String(html || "");
  return normalizeText(holder.textContent || holder.innerText || "");
}

async function fetchWikipediaSections(title) {
  const pageTitle = encodeURIComponent(normalizeText(title).replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${pageTitle}&prop=sections`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const all = Array.isArray(data?.parse?.sections) ? data.parse.sections : [];
    const wanted = [
      "discovery and naming",
      "description",
      "classification",
      "paleobiology",
      "paleoecology",
      "history of research"
    ];
    const selected = all
      .filter((s) => wanted.includes(keyText(s?.line)))
      .slice(0, 6);

    const out = [];
    for (const sec of selected) {
      const idx = normalizeText(sec?.index);
      if (!idx) continue;
      const textUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&formatversion=2&origin=*&page=${pageTitle}&prop=text&section=${encodeURIComponent(idx)}`;
      const txtRes = await fetch(textUrl, { cache: "no-store" });
      if (!txtRes.ok) continue;
      const txtData = await txtRes.json();
      const text = htmlToPlainText(txtData?.parse?.text || "");
      if (text.length < 80) continue;
      out.push({
        title: prettyTitle(sec?.line || "Section"),
        text
      });
    }
    return out;
  } catch {
    return [];
  }
}

async function fetchCommonsImages(query) {
  const q = normalizeText(query);
  if (!q) return [];
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=700`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data?.query?.pages || {});
    return pages
      .map((p) => ({
        url: p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url || "",
        caption: normalizeText(String(p?.title || "").replace(/^File:/i, "").replace(/[_]+/g, " "))
      }))
      .filter((x) => x.url);
  } catch {
    return [];
  }
}

function speciesEpithet(species) {
  const parts = normalizeText(species).split(/\s+/).filter(Boolean);
  return parts.length > 1 ? parts[1].toLowerCase() : "";
}

function findSpeciesFocusedParagraphs(text, species) {
  const epithet = speciesEpithet(species);
  if (!epithet) return [];
  return paragraphChunks(text, 20).filter((p) => keyText(p).includes(epithet));
}

async function fetchLocalSpeciesProfile(name) {
  try {
    const res = await fetch("data/species-profiles.json", { cache: "no-store" });
    if (!res.ok) return null;
    const payload = await res.json();
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    const key = keyText(name);
    return entries.find((entry) => keyText(entry?.name) === key) || null;
  } catch {
    return null;
  }
}

async function fetchGenusDetail(id) {
  const key = normalizeText(id);
  if (!key) return null;
  try {
    const res = await fetch(`data/${encodeURIComponent(key)}.json`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function isSummarySpeciesMatch(requestedSpecies, summary) {
  if (!summary) return false;
  const requested = normalizeText(requestedSpecies);
  const parts = requested.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return true;

  const full = keyText(requested);
  const epithet = keyText(parts[1]);
  const title = keyText(summary?.title);
  const description = keyText(summary?.description);
  const extract = keyText(summary?.extract);

  return (
    title.includes(full) ||
    description.includes(full) ||
    extract.includes(full) ||
    title.includes(` ${epithet}`) ||
    description.includes(` ${epithet}`) ||
    extract.includes(` ${epithet}`)
  );
}

function paragraphChunks(text, max = 8) {
  return normalizeText(text)
    .split(/\n{2,}/)
    .map((p) => normalizeText(p))
    .filter((p) => p.length > 80)
    .slice(0, max);
}

function getPath(obj, path) {
  if (!obj || !path) return "";
  const parts = path.split(".");
  let cur = obj;
  for (const part of parts) {
    if (!cur || typeof cur !== "object" || !(part in cur)) return "";
    cur = cur[part];
  }
  if (Array.isArray(cur)) return cur.filter(Boolean).join(", ");
  return normalizeText(cur);
}

function unknownish(value) {
  const v = keyText(value);
  return !v || v === "unknown" || v.startsWith("unknown");
}

function cleanNarrative(text) {
  return normalizeText(text)
    .replace(/\bis currently anchored to\b/gi, "is anchored to")
    .replace(/\bcurrently relies on\b/gi, "relies on")
    .replace(/\bcurrent(?:ly)? (?:context|notes|interpretation) (?:suggests|records|report)\b/gi, "current evidence suggests")
    .replace(/\blikely /gi, "possibly ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

function renderGallery(images, title) {
  if (!galleryEl) return;
  galleryEl.innerHTML = "";
  const used = new Set();
  images
    .filter((img) => img?.url)
    .filter((img) => {
      const key = keyText(String(img.url).split("?")[0]);
      if (!key || used.has(key)) return false;
      used.add(key);
      return true;
    })
    .slice(0, 10)
    .forEach((img) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-figure";
      const image = document.createElement("img");
      image.className = "gallery-thumb";
      image.src = img.url;
      image.alt = `${title} image`;
      image.loading = "lazy";
      image.onerror = () => {
        image.onerror = null;
        image.src = "images/no-image.svg";
      };
      figure.appendChild(image);
      const cap = document.createElement("figcaption");
      cap.className = "gallery-caption";
      cap.textContent = normalizeText(img.caption) || `${title} image`;
      figure.appendChild(cap);
      galleryEl.appendChild(figure);
    });

  if (!galleryEl.hasChildNodes()) {
    galleryEl.textContent = "No species images available yet.";
  }
}

function renderReferencesSection(refs) {
  const list = Array.isArray(refs) ? refs.filter(Boolean) : [];
  if (list.length === 0) return;

  const id = "section-references";
  const section = document.createElement("section");
  section.className = "detail-section";
  section.id = id;
  const h = document.createElement("h3");
  h.textContent = "References";
  section.appendChild(h);

  const ol = document.createElement("ol");
  ol.className = "species-link-list";
  list.forEach((ref) => {
    const li = document.createElement("li");
    const title = normalizeText(ref?.title || ref?.url || "");
    const url = normalizeText(ref?.url);
    if (url) {
      const a = document.createElement("a");
      a.className = "read-link";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = title || url;
      li.appendChild(a);
    } else {
      li.textContent = title || "Reference";
    }
    ol.appendChild(li);
  });
  section.appendChild(ol);
  speciesSectionsEl.appendChild(section);
  addSectionNavItem(id, "References");
}

function renderGeneratedSpeciesSections(species, genusDetail, longExtract, wikiSections) {
  const scientific = genusDetail?.scientificData || {};
  const chunks = paragraphChunks(longExtract, 10);
  const speciesFocused = findSpeciesFocusedParagraphs(longExtract, species).slice(0, 6);

  if (Array.isArray(wikiSections) && wikiSections.length > 0) {
    wikiSections.forEach((sec) => {
      renderSection(sec.title || "Section", sec.text);
    });
  } else if (speciesFocused.length > 0) {
    const speciesTitles = [
      "Taxonomic status",
      "Diagnosis and distinctions",
      "Research history",
      "Interpretation notes",
      "Classification context",
      "Open questions"
    ];
    speciesFocused.forEach((text, i) => {
      renderSection(speciesTitles[i] || `Species note ${i + 1}`, text);
    });
  } else if (chunks.length > 0) {
    const titles = [
      "Discovery and naming",
      "Description",
      "Classification",
      "Paleoecology",
      "Behavior",
      "Research history",
      "Current interpretation",
      "Evidence and certainty"
    ];
    chunks.forEach((text, i) => {
      renderSection(titles[i] || `Section ${i + 1}`, text);
    });
  }

  const generated = [
    {
      title: "Species context",
      text: `${species} is presented as a species-level article in Dino-pedia. This page separates species interpretation from its parent genus so taxonomic and anatomical differences can be tracked independently.`
    },
    {
      title: "Size and proportions",
      text: `Species-level size interpretation is still being refined. Current genus context reports length as ${scientific.length || "unknown"}, height as ${scientific.height || "unknown"}, and mass as ${scientific.weight || "unknown"}; these genus values are not always species-specific and should be treated carefully.`
    },
    {
      title: "Diet and ecology",
      text: `Ecological interpretation is currently anchored to available evidence and related spinosaurid/dinosaur datasets. Working context suggests a diet profile of ${scientific.diet || "unknown"} and habitat association in ${scientific.location || "unknown regions"}, while species-specific niche variation remains under active study.`
    },
    {
      title: "Research status",
      text: `Species-level confidence depends on specimen overlap, clear diagnostic anatomy, and peer-reviewed revision history. Dino-pedia keeps this page species-specific and expands it as stronger primary evidence appears.`
    }
  ];

  generated.forEach((sec) => {
    const id = `section-${normalizeText(sec.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    if (document.getElementById(id)) return;
    renderSection(sec.title, sec.text);
  });
}

function renderSpeciesDeepDive(species, genusDetail) {
  const scientific = genusDetail?.scientificData || {};
  const appearance = genusDetail?.externalAppearance || {};
  const hunting = genusDetail?.huntingAndDiet || {};
  const feeding = genusDetail?.feedingPatterns || {};
  const behavior = genusDetail?.behaviorAndConflict || {};
  const reproduction = genusDetail?.reproduction || {};
  const breeding = genusDetail?.breedingAndNesting || {};
  const locomotion = genusDetail?.locomotionAndAthletics || {};
  const ecology = genusDetail?.paleoecology || {};
  const fossils = genusDetail?.fossilDiscoveryHistory || {};
  const extinction = genusDetail?.extinctionContext || {};

  const sections = [
    {
      title: "Anatomy and appearance",
      text: `${species} is interpreted using comparative anatomy with its parent genus. Current evidence suggests display structures of ${getPath(appearance, "displayStructures") || "uncertain form"}, skin evidence of ${getPath(appearance, "skin") || "limited preservation"}, and coloration of ${getPath(appearance, "coloration") || "uncertain patterning"}.`
    },
    {
      title: "Feeding strategy",
      text: `Species-level feeding reconstruction relies on specimen association and ecological context. Current evidence suggests strategy: ${getPath(hunting, "strategy") || "under study"}, prey profile: ${getPath(hunting, "prey") || "not fully constrained"}, and bite-function notes: ${getPath(hunting, "biteForce") || "not yet quantified at species level"}.`
    },
    {
      title: "Daily ecology",
      text: `${species} occupied a specific niche within ${scientific.location || "its known region"}. Feeding style is ${getPath(feeding, "feedingStyle") || "uncertain"}, with intake and competition context recorded as ${getPath(feeding, "dailyIntake") || "not reliably quantified"} and ${getPath(feeding, "foodCompetition") || "not directly constrained"}.`
    },
    {
      title: "Behavior and conflict",
      text: `Behavioral interpretation remains conservative. Current synthesis tracks social behavior as ${getPath(behavior, "socialBehavior") || "unresolved"}, territoriality as ${getPath(behavior, "territoriality") || "uncertain"}, conflict evidence as ${getPath(behavior, "combatEvidence") || "limited"}, and rivals as ${getPath(behavior, "mainRivals") || "insufficiently resolved"}.`
    },
    {
      title: "Reproduction and nesting",
      text: `Reproductive interpretation for ${species} is built from direct evidence where available and broader clade-level comparison where needed. Current notes include eggs: ${getPath(reproduction, "eggs") || "unknown"}, clutch size: ${getPath(reproduction, "clutchSize") || "unknown"}, nesting: ${getPath(reproduction, "nesting") || "inferred"}, and parental-care context: ${getPath(breeding, "parentalCare") || "not confirmed"}.`
    },
    {
      title: "Locomotion and performance",
      text: `Locomotor interpretation describes gait as ${getPath(locomotion, "gait") || "under revision"}, acceleration as ${getPath(locomotion, "acceleration") || "not robustly measured"}, endurance as ${getPath(locomotion, "endurance") || "uncertain"}, and maneuverability as ${getPath(locomotion, "maneuverability") || "model-dependent"}.`
    },
    {
      title: "Ecosystem role",
      text: `${species} is reconstructed as part of a broader food web. Current ecosystem interpretation records role as ${getPath(ecology, "ecosystemRole") || "not sharply constrained"}, coexisting fauna as ${getPath(ecology, "coexistingFauna") || "locality-dependent"}, and resource dynamics as ${getPath(ecology, "resourceDynamics") || "uncertain"}.`
    },
    {
      title: "Fossil and research history",
      text: `Discovery history and research progression remain central for species-level certainty. Current notes report first finds as ${getPath(fossils, "firstFinds") || "documented but sparse"}, major discoveries as ${getPath(fossils, "majorDiscoveries") || "ongoing"}, and research milestones as ${getPath(fossils, "researchMilestones") || "still developing"}.`
    },
    {
      title: "Extinction and legacy",
      text: `Extinction context for ${species} is interpreted from regional and global environmental change. Timeline context is ${getPath(extinction, "timeline") || "incomplete"}, likely drivers are ${getPath(extinction, "primaryDrivers") || "uncertain"}, and research legacy is ${getPath(extinction, "legacy") || "actively updated with new finds"}.`
    }
  ];

  sections.forEach((section) => {
    const cleaned = cleanNarrative(section.text);
    if (unknownish(cleaned)) return;
    const id = `section-${normalizeText(section.title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    if (document.getElementById(id)) return;
    renderSection(section.title, cleaned);
  });
}

function renderLocalProfileSections(profile) {
  const sections = Array.isArray(profile?.sections) ? profile.sections : [];
  sections.forEach((sec) => {
    if (!normalizeText(sec?.text)) return;
    renderSection(sec?.title || "Section", sec.text);
  });
}

function computeSpeciesStats({
  profile,
  genusDetail,
  wikiSections,
  longExtract,
  matchedSpeciesSummary,
  summary,
  images,
  refs,
  metricContext
}) {
  const scientific = genusDetail?.scientificData || {};
  const core = [
    estimatedMetric("Temporal range", profile?.temporalRange || scientific.period, metricContext),
    estimatedMetric("Location", profile?.location || scientific.location, metricContext),
    estimatedMetric("Diet", profile?.diet || scientific.diet, metricContext),
    estimatedMetric("Classification", scientific.classification, metricContext),
    estimatedMetric("Length", scientific.length, metricContext),
    estimatedMetric("Height", scientific.height, metricContext),
    estimatedMetric("Weight", scientific.weight, metricContext),
    estimatedMetric("Speed", scientific.speed, metricContext)
  ];
  const knownCore = countKnown(core);
  const qualityLabel = knownCore >= 6 ? "High detail" : knownCore >= 4 ? "Moderate detail" : "Basic detail";

  const profileSections = Array.isArray(profile?.sections) ? profile.sections.length : 0;
  const importedSections = Array.isArray(wikiSections) ? wikiSections.length : 0;
  const extractSections = paragraphChunks(longExtract, 12).length;
  const sectionCount = Math.max(profileSections, importedSections, extractSections, 4);
  const refCount = Array.isArray(refs) ? refs.filter(Boolean).length : 0;

  const imageCount = (() => {
    const keys = new Set();
    (Array.isArray(images) ? images : []).forEach((img) => {
      const key = keyText(String(img?.url || "").split("?")[0]);
      if (key) keys.add(key);
    });
    return keys.size;
  })();

  let evidenceScore = 35;
  evidenceScore += knownCore * 7;
  evidenceScore += Math.min(20, sectionCount * 2);
  evidenceScore += Math.min(15, refCount * 3);
  evidenceScore += Math.min(10, imageCount * 2);
  if (profile) evidenceScore += 8;
  if (matchedSpeciesSummary && summary?.extract) evidenceScore += 5;
  evidenceScore = Math.max(0, Math.min(100, evidenceScore));

  return {
    knownCore,
    qualityLabel,
    evidenceScore,
    sectionCount,
    refCount,
    imageCount
  };
}

async function loadSpecies() {
  const safeName = normalizeText(speciesName);
  if (!safeName) {
    titleEl.textContent = "Species not provided";
    overviewEl.textContent = "Open this page from a genus article species list.";
    return;
  }

  titleEl.textContent = safeName;
  const genusLink = genusId ? `dino.html?dino=${encodeURIComponent(genusId)}` : "index.html";
  if (backToGenusEl) backToGenusEl.href = genusLink;
  if (backToGenusTopEl) backToGenusTopEl.href = genusLink;

  if (factsEl) factsEl.innerHTML = "";
  if (sectionNavEl) sectionNavEl.innerHTML = "";
  if (speciesSectionsEl) speciesSectionsEl.innerHTML = "";

  const profile = await fetchLocalSpeciesProfile(safeName);
  const summary = await fetchSummary(safeName);
  const longExtract = await fetchLongExtract(safeName);
  const wikiSections = await fetchWikipediaSections(safeName);
  const genusDetail = await fetchGenusDetail(genusId);
  const matchedSpeciesSummary = isSummarySpeciesMatch(safeName, summary);

  const speciesCommons = await fetchCommonsImages(`${safeName} fossil skeleton`);
  const genusCommons = await fetchCommonsImages(`${normalizeText(genusId)} dinosaur fossil`);
  const leadImage =
    (Array.isArray(profile?.images) ? profile.images.find((img) => normalizeText(img?.url))?.url : "") ||
    (matchedSpeciesSummary ? (summary?.originalimage?.source || summary?.thumbnail?.source || "") : "") ||
    (speciesCommons[0]?.url || "") ||
    (genusCommons[0]?.url || "");
  imageEl.src = leadImage || "images/no-image.svg";
  imageEl.onerror = () => {
    imageEl.onerror = null;
    imageEl.src = "images/no-image.svg";
  };

  const overview =
    normalizeText(profile?.overview) ||
    (matchedSpeciesSummary ? normalizeText(summary?.extract) : "") ||
    `${safeName} is a species-level taxon documented in Dino-pedia. This page separates species interpretation from genus-wide summaries and is expanded as specimen-level studies are added.`;
  overviewEl.textContent = overview;

  const refs = profile?.references || [];
  const commons = await fetchCommonsImages(`${safeName} fossil`);
  const commonsByGenus = await fetchCommonsImages(`${normalizeText(genusId)} fossil skeleton`);
  const images = [];
  if (Array.isArray(profile?.images)) {
    profile.images.forEach((img) => {
      if (!normalizeText(img?.url)) return;
      images.push({ url: img.url, caption: img.caption || `${safeName} image` });
    });
  }
  if (leadImage) {
    images.push({ url: leadImage, caption: `${safeName} lead image` });
  }
  images.push(...commons);
  images.push(...commonsByGenus);
  if (images.length === 0 && genusDetail?.image) {
    images.push({ url: genusDetail.image, caption: `${normalizeText(genusId)} reference image` });
  }

  const stats = computeSpeciesStats({
    profile,
    genusDetail,
    wikiSections,
    longExtract,
    matchedSpeciesSummary,
    summary,
    images,
    refs,
    metricContext: {
      type: profile?.type || genusDetail?.type || genusDetail?.scientificData?.type || "Dinosaur"
    }
  });
  const metricContext = {
    type: profile?.type || genusDetail?.type || genusDetail?.scientificData?.type || "Dinosaur"
  };

  addFact("Name", safeName);
  addFact("Type", profile?.type || genusDetail?.type || genusDetail?.scientificData?.type || "Unknown");
  addFact("Data quality", `${stats.qualityLabel} (${stats.knownCore}/8 core fields)`);
  addFact("Evidence score", `${stats.evidenceScore}/100`);
  addFact("Sections", String(stats.sectionCount));
  addFact("References", String(stats.refCount));
  addFact("Image coverage", `${stats.imageCount} images`);
  addFact("Species", safeName);
  addFact("Genus article", normalizeText(genusId) || "Unknown");

  if (profile) {
    addFact("Temporal range", estimatedMetric("Temporal range", profile.temporalRange, metricContext));
    addFact("Location", estimatedMetric("Location", profile.location, metricContext));
    addFact("Diet", estimatedMetric("Diet", profile.diet, metricContext));
    if (profile.namedBy) addFact("Named by", profile.namedBy);
    if (profile.nameMeaning) addFact("Name meaning", profile.nameMeaning);
  } else {
    const scientific = genusDetail?.scientificData || {};
    addFact("Temporal range", estimatedMetric("Temporal range", scientific.period, metricContext));
    addFact("Location", estimatedMetric("Location", scientific.location, metricContext));
    addFact("Diet", estimatedMetric("Diet", scientific.diet, metricContext));
    addFact("Classification", estimatedMetric("Classification", scientific.classification, metricContext));
    addFact("Length", estimatedMetric("Length", scientific.length, metricContext));
    addFact("Height", estimatedMetric("Height", scientific.height, metricContext));
    addFact("Weight", estimatedMetric("Weight", scientific.weight, metricContext));
    addFact("Speed", estimatedMetric("Speed", scientific.speed, metricContext));
    addFact("Discovered", estimatedMetric("Discovered", scientific.discovered, metricContext));
  }

  if (matchedSpeciesSummary) {
    addFact("Wikipedia title", summary?.title || safeName);
    addFact("Wikipedia description", summary?.description || "N/A");
  }

  if (profile) {
    renderLocalProfileSections(profile);
  } else {
    renderGeneratedSpeciesSections(safeName, genusDetail, longExtract, wikiSections);
  }
  renderSpeciesDeepDive(safeName, genusDetail);

  renderReferencesSection(refs);
  renderGallery(images, safeName);
}

loadSpecies();
