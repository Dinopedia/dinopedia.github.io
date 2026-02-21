const eraTabsEl = document.getElementById("eraTabs");
const eraPanelEl = document.getElementById("eraPanel");

const ERA_CONTENT = {
  mesozoic: {
    label: "Mesozoic Era",
    range: "252 to 66 million years ago",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/FSAC-KK-11888.jpg",
    imageCaption: "Mesozoic archosaur-dominated ecosystems included many giant reptiles.",
    summary:
      "The Mesozoic was a long interval of warm greenhouse climates, repeated sea-level changes, and major evolutionary turnover. Dinosaurs rose from minor archosaur groups to globally dominant terrestrial vertebrates, while marine reptiles and pterosaurs diversified in parallel.",
    conditions: [
      "Climate was generally warmer than today, with little or no permanent polar ice for long intervals.",
      "Continents drifted from Pangaea toward more modern positions, reshaping coastlines and rainfall patterns.",
      "Plant communities shifted from gymnosperm dominance toward increasing angiosperm influence by Late Cretaceous time."
    ],
    life: [
      "Early Mesozoic faunas were mixed, then dinosaurs became the dominant large land vertebrates.",
      "Pterosaurs filled aerial predator and fish-hunter niches long before modern birds diversified.",
      "Marine systems hosted ichthyosaurs, plesiosaurs, and mosasaurs at different times."
    ]
  },
  triassic: {
    label: "Triassic Period",
    range: "252 to 201 million years ago",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tyrannosaurus_rex_size_comparison.svg",
    imageCaption: "Triassic ecosystems had smaller early dinosaurs among many archosaur competitors.",
    summary:
      "The Triassic followed the end-Permian mass extinction and began as a recovery world with harsh climatic extremes. By the Late Triassic, early dinosaurs appeared and started diversifying, but they still coexisted with many non-dinosaur archosaurs.",
    conditions: [
      "Most land was joined in Pangaea, producing extensive interior arid zones and strong seasonal swings.",
      "CO2 levels were elevated and climates were often hot, with episodic instability.",
      "River and floodplain habitats created local biodiversity hotspots despite broader dryness."
    ],
    life: [
      "Early dinosaurs were generally smaller and not yet ecologically dominant worldwide.",
      "Croc-line archosaurs, rauisuchians, and other groups were major competitors or predators.",
      "End-Triassic turnover opened ecological space that favored dinosaur expansion in the Jurassic."
    ]
  },
  jurassic: {
    label: "Jurassic Period",
    range: "201 to 145 million years ago",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Spinosaurus_aegyptiacus_reconstruction.png",
    imageCaption: "Jurassic terrestrial systems supported large sauropods and big theropod predators.",
    summary:
      "During the Jurassic, dinosaurs became globally dominant in many terrestrial food webs. Vast floodplains and warm conditions supported giant sauropods, while theropod predators and early birds diversified in parallel.",
    conditions: [
      "Pangaea began to split, creating new coastlines, humid belts, and regionally distinct climates.",
      "Warm greenhouse conditions persisted, with broad vegetated lowlands in many basins.",
      "Marine transgressions expanded shallow seas and changed continental ecosystem connectivity."
    ],
    life: [
      "Sauropods reached exceptional body sizes and dominated many herbivore guilds.",
      "Theropods diversified into multiple apex and mesopredator lineages.",
      "Early avialans and feathered theropods mark key steps toward modern bird evolution."
    ]
  },
  cretaceous: {
    label: "Cretaceous Period",
    range: "145 to 66 million years ago",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sue_at_the_Field_Museum.jpg",
    imageCaption: "Late Cretaceous ecosystems included giant theropods and highly diverse herbivore lineages.",
    summary:
      "The Cretaceous saw major biogeographic partitioning, flowering plant radiation, and high dinosaur diversity across continents. It ended with the K-Pg mass extinction at 66 million years ago, which removed non-avian dinosaurs and many marine groups.",
    conditions: [
      "High sea levels and epicontinental seas shaped regional climates and migration barriers.",
      "Angiosperms expanded, altering food webs and herbivore adaptation patterns.",
      "Late Cretaceous climates varied regionally but remained generally warmer than modern averages."
    ],
    life: [
      "Ceratopsians, hadrosaurs, titanosaurs, abelisaurids, and tyrannosaurids radiated in different regions.",
      "Bird-line dinosaurs continued diversifying and crossed the K-Pg boundary as surviving avian clades.",
      "Marine systems were dominated by mosasaurs and advanced plesiosaurs before end-Cretaceous collapse."
    ]
  }
};

function setActiveTab(key) {
  const tabs = [...eraTabsEl.querySelectorAll(".era-tab")];
  tabs.forEach((tab) => {
    const active = tab.dataset.era === key;
    tab.classList.toggle("era-tab-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

function bulletList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderEra(key) {
  const era = ERA_CONTENT[key] || ERA_CONTENT.mesozoic;
  setActiveTab(key);
  eraPanelEl.innerHTML = `
    <article class="era-article">
      <header class="era-head">
        <h3>${era.label}</h3>
        <p class="search-count">${era.range}</p>
      </header>
      <div class="era-grid">
        <figure class="era-figure">
          <img src="${era.image}" alt="${era.label} illustration" loading="lazy">
          <figcaption>${era.imageCaption}</figcaption>
        </figure>
        <section>
          <p>${era.summary}</p>
          <h4>Earth Conditions</h4>
          ${bulletList(era.conditions)}
          <h4>Life In General</h4>
          ${bulletList(era.life)}
        </section>
      </div>
    </article>
  `;

  const img = eraPanelEl.querySelector("img");
  if (img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = "images/trex-skull.png";
    };
  }
}

eraTabsEl.addEventListener("click", (event) => {
  const btn = event.target.closest(".era-tab");
  if (!btn) return;
  renderEra(btn.dataset.era);
});

renderEra("mesozoic");
