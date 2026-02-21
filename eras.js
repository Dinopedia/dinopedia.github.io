const eraTabsEl = document.getElementById("eraTabs");
const eraTitleEl = document.getElementById("eraTitle");
const eraOverviewEl = document.getElementById("eraOverview");
const eraSectionNavEl = document.getElementById("eraSectionNav");
const eraSectionsEl = document.getElementById("eraSections");
const eraFactsEl = document.getElementById("eraFacts");
const eraImageEl = document.getElementById("eraImage");
const eraImageCaptionEl = document.getElementById("eraImageCaption");

const ERA_CONTENT = {
  mesozoic: {
    title: "Mesozoic Era",
    range: "252 to 66 million years ago",
    duration: "about 186 million years",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/FSAC-KK-11888.jpg",
    imageCaption: "Mesozoic ecosystems were dominated by archosaurs on land and marine reptiles in the oceans.",
    overview:
      "The Mesozoic was a long greenhouse interval marked by continental breakup, repeated sea-level shifts, and rapid biological turnover. Dinosaurs, pterosaurs, marine reptiles, and early birds diversified in different waves as climates, coastlines, and food webs changed.",
    conditions:
      "Global temperatures were generally warmer than modern averages for much of the era, with limited long-term polar ice. Pangaea fragmented over time, creating new coastlines and regional climate zones.",
    life:
      "Early Mesozoic systems were mixed archosaur communities, but dinosaurs became dominant large land vertebrates by the Jurassic. In parallel, pterosaurs expanded in aerial niches and marine reptiles occupied apex predator roles in many seas.",
    plants:
      "Gymnosperms dominated early and middle intervals, while flowering plants spread strongly in the Cretaceous and reshaped terrestrial food webs.",
    transitions:
      "The era begins after the end-Permian extinction and ends at the K-Pg extinction around 66 million years ago."
  },
  triassic: {
    title: "Triassic Period",
    range: "252 to 201 million years ago",
    duration: "about 51 million years",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Coelophysis_BW.jpg",
    imageCaption: "Triassic ecosystems included early dinosaurs among many competing archosaurs.",
    overview:
      "The Triassic was a recovery interval after Earth’s largest mass extinction. Early in the period, ecosystems were simplified and often harsh; by the Late Triassic, dinosaur lineages had appeared and were diversifying, though not yet globally dominant.",
    conditions:
      "Most continents were joined in Pangaea, creating vast inland belts with arid climates and strong seasonal extremes. Volcanism and elevated greenhouse gases likely amplified environmental instability.",
    life:
      "Faunas included many non-dinosaur archosaurs, synapsid survivors, early crocodile-line predators, and the first known dinosaurs. Ecological competition remained intense through much of the period.",
    plants:
      "Vegetation was dominated by conifers, seed ferns, cycads, and other gymnosperm groups adapted to warm conditions.",
    transitions:
      "The end-Triassic extinction removed many competitor groups and opened ecological space that dinosaurs expanded into during the Jurassic."
  },
  jurassic: {
    title: "Jurassic Period",
    range: "201 to 145 million years ago",
    duration: "about 56 million years",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Brachiosaurus_DB.jpg",
    imageCaption: "Jurassic floodplains supported giant sauropods and large theropod predators.",
    overview:
      "During the Jurassic, dinosaurs became dominant in many terrestrial ecosystems. Large herbivore and predator guilds stabilized in numerous regions, and early bird-line dinosaurs diversified alongside classic theropod and sauropod lineages.",
    conditions:
      "Pangaea continued to split, increasing coastline length and regional climate variation. Warm greenhouse conditions remained widespread with productive floodplain systems in many basins.",
    life:
      "Sauropods achieved extreme body sizes, stegosaurs and other herbivore groups expanded, and large theropods occupied apex roles. Early avialans represent key steps toward modern birds.",
    plants:
      "Conifers and other gymnosperms remained dominant, with extensive fern understories in humid environments.",
    transitions:
      "By Late Jurassic time, faunal provinces were becoming more regionalized as continental separation accelerated."
  },
  cretaceous: {
    title: "Cretaceous Period",
    range: "145 to 66 million years ago",
    duration: "about 79 million years",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sue_at_the_Field_Museum.jpg",
    imageCaption: "Late Cretaceous ecosystems were highly diverse and regionally specialized.",
    overview:
      "The Cretaceous combined high biodiversity with strong regional differentiation. Flowering plants expanded, herbivore guilds became more specialized, and major predator clades diversified across separate continental systems.",
    conditions:
      "Sea levels were often high, with epicontinental seas shaping habitat and dispersal barriers. Climate stayed generally warm but varied substantially by latitude and time slice.",
    life:
      "Ceratopsians, hadrosaurs, titanosaurs, abelisaurids, and tyrannosaurids diversified in different regions. Marine systems included mosasaurs and advanced plesiosaurs before terminal collapse at the K-Pg boundary.",
    plants:
      "Angiosperms spread widely and likely changed herbivore feeding strategies, seasonal dynamics, and terrestrial ecosystem structure.",
    transitions:
      "The period ends at the K-Pg extinction around 66 million years ago, removing non-avian dinosaurs and many marine reptiles."
  }
};

function slugify(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function setActiveTab(key) {
  const tabs = [...eraTabsEl.querySelectorAll(".era-tab")];
  tabs.forEach((tab) => {
    const active = tab.dataset.era === key;
    tab.classList.toggle("era-tab-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

function addFact(label, value) {
  const row = document.createElement("div");
  row.className = "article-fact-row";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value;
  row.append(dt, dd);
  eraFactsEl.appendChild(row);
}

function addSectionNavItem(id, label) {
  const link = document.createElement("a");
  link.href = `#${id}`;
  link.className = "section-nav-link";
  link.textContent = label;
  eraSectionNavEl.appendChild(link);
}

function addSection(title, text) {
  const section = document.createElement("section");
  section.className = "detail-section";
  section.id = `section-${slugify(title)}`;

  const heading = document.createElement("h3");
  heading.textContent = title;
  section.appendChild(heading);

  const paragraph = document.createElement("p");
  paragraph.className = "section-paragraph";
  paragraph.textContent = text;
  section.appendChild(paragraph);

  eraSectionsEl.appendChild(section);
  addSectionNavItem(section.id, title);
}

function renderEra(key) {
  const era = ERA_CONTENT[key] || ERA_CONTENT.mesozoic;
  setActiveTab(key);

  eraTitleEl.textContent = era.title;
  eraOverviewEl.textContent = era.overview;

  eraFactsEl.innerHTML = "";
  addFact("Interval", era.range);
  addFact("Duration", era.duration);
  addFact("Climate", "Predominantly greenhouse conditions");
  addFact("Dominant groups", "Dinosaurs, pterosaurs, marine reptiles");
  addFact("Major transitions", era.transitions);

  eraImageEl.src = era.image;
  eraImageEl.alt = `${era.title} illustration`;
  eraImageEl.onerror = () => {
    eraImageEl.onerror = null;
    eraImageEl.src = "images/no-image.svg";
  };
  eraImageCaptionEl.textContent = era.imageCaption;

  eraSectionNavEl.innerHTML = "";
  eraSectionsEl.innerHTML = "";
  addSection("Earth Conditions", era.conditions);
  addSection("Life In General", era.life);
  addSection("Plant World", era.plants);
  addSection("Transitions And Turning Points", era.transitions);
}

eraTabsEl.addEventListener("click", (event) => {
  const btn = event.target.closest(".era-tab");
  if (!btn) return;
  renderEra(btn.dataset.era);
});

renderEra("mesozoic");
