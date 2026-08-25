const featuredProjects = [
  {
    type: "WEB PROJECT",
    title: "Modern Agenda",
    description: "Legacy application transformed with modern Angular and TypeScript.",
    tags: ["Angular", "TypeScript", "Responsive"]
  },
  {
    type: "COMPARISON PROJECT",
    title: "Rosetta: Core",
    description: "One useful web problem rebuilt across several languages so syntax and architecture can be compared.",
    tags: ["TypeScript", "Python", "Java", "C#"]
  },
  {
    type: "EXPERIMENT",
    title: "Mini Browser",
    description: "A tiny rendering engine exploring parsing, layout, style resolution and Canvas painting.",
    tags: ["TypeScript", "Canvas", "Parsing"]
  }
];

const projects = [
  ["Rosetta: Core", "WEB"],
  ["Modern Agenda", "WEB"],
  ["Mini Browser Engine", "EXPERIMENT"],
  ["Database Lab", "LAB"],
  ["Canvas Playground", "EXPERIMENT"],
  ["API Explorer", "WEB"],
  ["AI Sandbox", "EXPERIMENT"],
  ["Portfolio Engine", "WEB"]
];

const stones = [
  {
    id: "agenda",
    name: "Agenda",
    symbol: "A",
    color: "255 188 70",
    description: "Compare the same event-agenda domain across different implementations.",
    versions: ["Modern Angular / TypeScript", "Legacy AngularJS archive", "Future API-backed version"]
  },
  {
    id: "browser",
    name: "Browser",
    symbol: "B",
    color: "69 153 255",
    description: "Compare rendering and browser concepts across browser-native and systems implementations.",
    versions: ["TypeScript browser renderer", "Rust / WebAssembly study", "C++ systems study"]
  },
  {
    id: "engine",
    name: "Renderer",
    symbol: "R",
    color: "61 215 205",
    description: "Compare rendering architecture as the engine becomes more capable.",
    versions: ["Canvas renderer", "WebAssembly renderer", "Future layout-engine experiments"]
  },
  {
    id: "crm",
    name: "CRM",
    symbol: "C",
    color: "151 89 255",
    description: "Compare enterprise application layers as the Event Operations CRM evolves.",
    versions: ["Angular frontend", "ASP.NET Core API", "PostgreSQL relational model"]
  },
  {
    id: "data",
    name: "Data Lab",
    symbol: "DB",
    color: "112 159 255",
    description: "Compare structured and document data approaches around a common domain.",
    versions: ["PostgreSQL", "MongoDB", "Static JSON baseline"]
  }
];

const references = [
  ["H5", "HTML / CSS", "74 157 255"],
  ["JS", "JavaScript", "255 188 70"],
  ["TS", "TypeScript", "48 138 255"],
  ["GIT", "Git", "255 101 73"],
  ["API", "API Design", "145 91 255"]
];

const dataScience = [
  ["JNB", "Jupyter Notebooks", "66 181 255"],
  ["PD", "pandas Analysis", "79 153 255"],
  ["ML", "scikit-learn", "71 164 255"],
  ["TF", "TensorFlow", "94 131 255"],
  ["VIZ", "Data Visualization", "115 95 255"]
];

const guideResponses = {
  overview:
    "The Developer Sandbox is an employer-facing technical showcase presented as a separate application environment rather than a conventional portfolio page.",
  architecture:
    "Production V1 is planned as React + TypeScript + Vite with modern hand-written CSS, reusable SVG, and structured static project/reference data. Heavy project runtimes remain separate and load only when requested.",
  skills:
    "The shell demonstrates responsive application design, data-driven UI, component thinking, modern CSS, TypeScript, accessibility, performance awareness, and technical communication.",
  implementation:
    "This prototype intentionally uses lightweight glass: transparency, gradients, borders, restrained shadows, and small transforms. It avoids stacking expensive blur effects across the interface.",
  references:
    "Reference surfaces connect project context to Terminal, Git, HTML/CSS, JavaScript, TypeScript, APIs, databases, Docker, data-science tools, and other implementation references."
};

let featuredIndex = 0;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderFeatured() {
  const project = featuredProjects[featuredIndex];

  $("#featured-type").textContent = project.type;
  $("#featured-title").textContent = project.title;
  $("#featured-description").textContent = project.description;
  $("#featured-current").textContent = String(featuredIndex + 1);

  $("#featured-tags").innerHTML = project.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  $$("#featured-dots button").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === featuredIndex);
  });
}

featuredProjects.forEach((project, index) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Show ${project.title}`);
  dot.addEventListener("click", () => {
    featuredIndex = index;
    renderFeatured();
  });
  $("#featured-dots").append(dot);
});

$("#feature-prev").addEventListener("click", () => {
  featuredIndex = (featuredIndex - 1 + featuredProjects.length) % featuredProjects.length;
  renderFeatured();
});

$("#feature-next").addEventListener("click", () => {
  featuredIndex = (featuredIndex + 1) % featuredProjects.length;
  renderFeatured();
});

$("#project-grid").innerHTML = projects
  .map(([name, status]) => `
    <button class="project-card">
      <div class="project-card__art" aria-hidden="true"></div>
      <strong>${name}</strong>
      <small>${status}</small>
    </button>
  `)
  .join("");

$("#stone-grid").innerHTML = stones
  .map((stone) => `
    <button class="stone-card" data-stone="${stone.id}">
      <span class="stone" style="--stone:${stone.color}">
        <b>${stone.symbol}</b>
      </span>
      <small>${stone.name}</small>
    </button>
  `)
  .join("");

function renderReferenceTiles(items) {
  return items
    .map(([abbr, label, color]) => `
      <button class="reference-card" data-guide="${label}">
        <span class="reference-icon" style="--icon:${color}">${abbr}</span>
        <strong>${label}</strong>
      </button>
    `)
    .join("");
}

$("#reference-grid").innerHTML = renderReferenceTiles(references);
$("#data-grid").innerHTML = renderReferenceTiles(dataScience);

renderFeatured();

$$("[data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .getElementById(button.dataset.target)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

const backdrop = $(".backdrop");
const systemModal = $("#system-modal");
const stoneModal = $("#stone-modal");

function openModal(modal) {
  backdrop.hidden = false;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModals() {
  backdrop.hidden = true;
  systemModal.hidden = true;
  stoneModal.hidden = true;
  document.body.style.overflow = "";
}

$("#system-button").addEventListener("click", () => openModal(systemModal));
$("#system-nav").addEventListener("click", () => openModal(systemModal));

$$(".modal-close").forEach((button) => {
  button.addEventListener("click", closeModals);
});

backdrop.addEventListener("click", closeModals);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModals();
});

$$("[data-response]").forEach((button) => {
  button.addEventListener("click", () => {
    $(".guide-response").textContent = guideResponses[button.dataset.response];
  });
});

$$("[data-stone]").forEach((button) => {
  button.addEventListener("click", () => {
    const stone = stones.find((item) => item.id === button.dataset.stone);

    $("#stone-modal-title").textContent = `${stone.name} Rosetta Stone`;
    $("#stone-modal-content").innerHTML = `
      <div class="stone-detail">
        <span class="stone" style="--stone:${stone.color}">
          <b>${stone.symbol}</b>
        </span>
        <div>
          <h3>${stone.name}</h3>
          <p>${stone.description}</p>
        </div>
      </div>
      <div class="version-list">
        ${stone.versions.map((version) => `<div>${version}</div>`).join("")}
      </div>
    `;

    openModal(stoneModal);
  });
});

$$("[data-guide]").forEach((button) => {
  button.addEventListener("click", () => {
    $("#system-modal-title").textContent = `${button.dataset.guide} Reference`;
    $(".guide-response").textContent =
      `Prototype behavior: this opens the ${button.dataset.guide} reference surface inside the Sandbox.`;
    openModal(systemModal);
  });
});
