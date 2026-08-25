// const menuItems = document.querySelectorAll(".sandbox-menu__item");

// menuItems.forEach((item) => {
//   item.addEventListener("click", () => {
//     menuItems.forEach((button) => {
//       button.classList.remove("is-active");
//     });

//     item.classList.add("is-active");

//     console.log("Selected:", item.dataset.section);
//   });
// });
// /* FEATURED */

// const featuredProjects = [
//   {
//     type: "WEB PROJECT",
//     title: "Modern Agenda",

//     description:
//       "Legacy application transformed with modern Angular and TypeScript.",

//     tags: ["Angular", "TypeScript", "Responsive"],
//   },

//   {
//     type: "COMPARISON PROJECT",
//     title: "Rosetta: Core",

//     description:
//       "One web-oriented problem implemented across several languages for direct comparison.",

//     tags: ["TypeScript", "Python", "Java", "C#"],
//   },

//   {
//     type: "EXPERIMENT",
//     title: "Mini Browser",

//     description:
//       "A tiny browser rendering engine exploring parsing, layout, and Canvas painting.",

//     tags: ["TypeScript", "Canvas", "Parsing"],
//   },
// ];

// let currentFeaturedProject = 0;

// const featuredType = document.getElementById("featured-type");

// const featuredTitle = document.getElementById("featured-title");

// const featuredDescription = document.getElementById("featured-description");

// const featuredTags = document.getElementById("featured-tags");

// const featuredCurrent = document.getElementById("featured-current");

// const featuredDots = document.getElementById("featured-dots");

// /* =============================================
//    BUILD DOTS
//    ============================================= */

// featuredProjects.forEach((project, index) => {
//   const dot = document.createElement("button");

//   dot.setAttribute("aria-label", `Show ${project.title}`);

//   dot.addEventListener("click", () => {
//     currentFeaturedProject = index;

//     renderFeaturedProject();
//   });

//   featuredDots.appendChild(dot);
// });

// /* =============================================
//    RENDER ACTIVE PROJECT
//    ============================================= */

// function renderFeaturedProject() {
//   const project = featuredProjects[currentFeaturedProject];

//   featuredType.textContent = project.type;

//   featuredTitle.textContent = project.title;

//   featuredDescription.textContent = project.description;

//   featuredCurrent.textContent = currentFeaturedProject + 1;

//   featuredTags.innerHTML = project.tags
//     .map((tag) => `<span>${tag}</span>`)
//     .join("");

//   const dots = featuredDots.querySelectorAll("button");

//   dots.forEach((dot, index) => {
//     dot.classList.toggle("is-active", index === currentFeaturedProject);
//   });
// }

// /* =============================================
//    PREVIOUS
//    ============================================= */

// document.getElementById("featured-previous").addEventListener("click", () => {
//   currentFeaturedProject--;

//   if (currentFeaturedProject < 0) {
//     currentFeaturedProject = featuredProjects.length - 1;
//   }

//   renderFeaturedProject();
// });

// /* =============================================
//    NEXT
//    ============================================= */

// document.getElementById("featured-next").addEventListener("click", () => {
//   currentFeaturedProject++;

//   if (currentFeaturedProject >= featuredProjects.length) {
//     currentFeaturedProject = 0;
//   }

//   renderFeaturedProject();
// });

// /* initial display */

// renderFeaturedProject();
