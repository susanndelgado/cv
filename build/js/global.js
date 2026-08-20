/* ========================================================= 
    SUSAN DELGADO SUMMER 2026
    FUNCTION GUIDE
   =========================================================
   This file is shared by several pages. The notes below describe what each
   named function is responsible for. They are documentation only;.

            BUILD HEADER
            - addClasses(element, names): Adds one or more CSS class names safely.
            - isWorkSide(header): Detects whether the current page belongs to the
              Technical Work side of the site.
            - createWorkMainNav(header): Builds the Technical Work navigation when the
              page does not already contain it.
            - normalizeHeader(root): Applies the shared Bootstrap-compatible classes and
              active-state structure to the site header.

            BUILD MOTION / TECHNICAL PORTFOLIO
            - currentFile(): Returns the current HTML filename from the URL.
            - isWorkPage(): Checks whether the visitor is on work.html.
            - isProjectPage(): Checks whether the visitor is on project.html.
            - ensureBuildHeader(): Makes sure the shared header initializer is available.
            - ensureInteractionStylesheet(): Loads the Technical interaction/cursor CSS.
            - getPostId(): Reads the project post ID from the project-page query string.
            - postIdFromLink(link): Extracts a project post ID from a project link.
            - normalizePortfolioNavigation(root): Normalizes project/archive navigation,
              category links, skills pills and legacy archive anchors.
            - normalizeAngularLabel(text): Renames AngularJS display text to Angular.
            - applyVerifiedTechnologyEvidence(root): Corrects Angular skill labels based
              on the verified source archive for specific projects.
            - removePostEleven(): Removes/redirects the retired project with ID 11.
            - addFellowsInteraction(): Adds the Fellows-specific UX explanation panels.
            - cleanWinterBallPreview(): Removes one unwanted Winter Ball preview image and
              repairs the remaining preview column layout.
            - ensureLightbox(): Creates the reusable project-image lightbox and its close
              behavior. Its nested close() function closes and resets the lightbox.
            - openLightbox(trigger): Opens the lightbox with the selected project image.
            - bindLightboxImages(root): Makes project images keyboard/click accessible as
              lightbox triggers.
            - runPortfolioFixes(root): Runs all Technical Work/project compatibility fixes.
            - installPortfolioObserver(): Watches dynamically rendered project content and
              reruns the fixes when that content changes.
            - initCursor(): Creates and manages the custom Technical Work cursor. Its
              nested setMode(target) function switches cursor state for links and images.
            - initBuildMotion(root): Public initializer for Technical Work interactions.
            - init(): Starts the Technical Work interaction layer on page load.

            FINE ARTS INTERIOR
            - ensureBuildHeader(): Makes sure the shared header initializer is available
              on Fine Arts interior pages.
            - resizeFrame(doc): Resizes an embedded Fine Arts preview iframe to its
              document height.

   FINE ARTS GALLERY
   - ensureBuildHeader(): Makes sure the shared header initializer is available.
   - text(value): Converts archive values to clean display text.
   - normalizeKey(value): Normalizes field names for flexible archive lookup.
   - field(item, ...names): Finds the first matching field in an archive record.
   - escapeHTML(value): Escapes text before inserting it into generated markup.
   - imageURL(item): Extracts an image URL from an archive record's files field.
   - getArchive(): Gets Fine Arts archive data from the shared cache/API.
   - insertGalleryNavigation(type): Adds gallery-category navigation to the hero.
   - makeCard(item, index): Builds one Fine Arts gallery card and its metadata.
   - init(): Loads and renders the Fine Arts gallery and wires its lightbox.
     Its nested closeLightbox() function closes that gallery lightbox.

   EMBEDDED BUILD PAGE SCRIPTS / SHARED HELPERS
   - inlineContains(marker): Checks whether a legacy inline script is still on
     the page so the same initializer is not run twice.
   - runWhenReady(fn): Runs a function immediately or after DOMContentLoaded.
   - loadTemplate(target): Fetches and inserts the reusable project template.
   - initProcessVideos(): Starts/stops process videos based on connection/data
     saving conditions.
   - pages.index(): Handles the home splash-video fallback.
     Nested useBlackFallback() hides a failed splash video.
   - pages.finearts(): Initializes Fine Arts process videos.
   - pages.about(): Initializes About-page reveal effects and process videos.
   - pages.resume(): Connects the resume PDF button to browser printing.

   PROJECT DATA HELPERS
   - projectHelpers(): Creates shared helpers used by Work and Project pages.
     - strip(value): Removes HTML and returns plain text.
     - lines(value): Splits <br>-separated values into clean text items.
     - key(value): Creates normalized lowercase comparison text.
     - yearNum(value): Extracts a sortable four-digit year.
     - contains(project, token): Checks a project's filter-token list.
     - isCrfRelated(project): Detects CRF-related project records.
     - normalizeProject(project): Normalizes project skills/metadata.
     - merge(base, extras): Merges baseline posts with correction/addition data.
     - optionalJson(url): Loads optional JSON without breaking the page if absent.
     - loadProjects(): Loads posts.json plus all supplemental project JSON,
       including /build/js/casestudies.json, and merges them into one project set.

   WORK PAGE
   - pages.work(): Controls the Technical Work project listing and filters.
     - url(item): Builds the reusable project.html URL for a project.
     - image(item): Chooses the project thumbnail/hero path.
     - card(item, small): Builds a featured or archive project card.
     - renderFeatured(): Renders the selected featured project IDs.
     - defaultArchivePosts(): Returns archive projects excluding featured items.
     - renderArchive(source): Renders a supplied set of archive project cards.
     - cardMatches(node, type, skill): Tests whether a card matches filters.
     - setButtonState(type): Updates active filter-button styling.
     - setStatus(type, skill): Updates the visible filter-status message.
     - filter(type, skill, instant): Filters cards and animates layout changes.

   PROJECT POST PAGE
   - pages.project(): Loads and renders one reusable project/case-study page.
     - projectUrl(item): Builds another project's detail-page URL.
     - filterUrl(kind, value): Builds a Work-page filtered archive URL.
     - assetPath(value): Converts relative asset paths to root-relative paths.
     - skillPills(item): Builds the Skills pills markup.
     - typePills(item): Builds project-type/category filter pills.
     - navMarkup(previous, next): Builds Previous / All Work / Next navigation.
     - getProjectElements(): Collects reusable template DOM targets.
     - renderProjectNav(item, posts, elements): Renders project navigation.
     - renderHero(item, elements): Renders project title, metadata and hero image.
     - renderContext(item, elements): Renders the main project narrative.
     - renderUX(caseStudy, elements): Renders UX panels from case-study data.
     - renderWorkflow(caseStudy, elements): Renders project workflow steps.
     - renderSystem(caseStudy, elements): Renders technical/system information.
     - renderStructure(structure, elements): Renders site/content structure.
     - renderDeliverables(caseStudy, elements): Renders deliverable summaries.
     - previewColumnClass(columns): Chooses Bootstrap preview-column widths.
     - renderPreview(data, elements): Renders JSON preview sections/HTML safely.
     - renderProject(): Loads merged project data, selects the requested project
       and calls all project-section renderers.

   EXHIBITIONS PAGE
   - pages.exhibits(): Loads, caches and renders exhibition records.
     - normalizeText(value): Converts exhibition values to display text.
     - normalizeKey(value): Normalizes field names for flexible lookup.
     - escapeHTML(value): Escapes exhibition text before HTML insertion.
     - isValidWebsiteURL(value): Allows only valid http/https exhibition links.
     - getField(item, ...names): Reads alternate exhibition field names.
     - extractImages(item): Extracts unique image URLs from record files.
     - extractImageCaptions(item): Splits stored image captions.
     - formatPipeSeparatedValue(value): Converts pipe-separated values to spans.
     - createDetailRow(label, value, options): Builds one exhibition detail row.
     - makeDetailRows(item): Builds all available exhibition metadata rows.
     - makeCarousel(item, index): Builds an exhibition image carousel.
     - handleExhibitionImageError(imageElement): Replaces broken images with a
       placeholder.
     - renderExhibition(item, index): Builds one complete exhibition card.
     - getArchive(): Loads exhibition data from cache or the remote endpoint.
     - renderMore(): Appends the next page of exhibition records.
     - initiate(): Starts exhibition loading and the Load More control.

   PROGRESS CHRONICLES PAGE
   - pages.progress(): Loads and renders Progress Chronicle entries.
     - extractFileUrl(fileEntry): Finds a usable image URL in a file record.
     - renderImage(file): Builds Chronicle image markup.
     - renderChronicles(): Appends the next batch of Chronicle entries.
     - initiate(): Loads Chronicle data and connects the Load More button.

   PAGE DISPATCHER
   - currentDefinition(): Finds which page initializer matches the current DOM.
   - initCurrent(options): Runs the matching page initializer once unless a
     legacy inline version is intentionally handling that page.
   ========================================================= */

/* =========================================================
   BUILD HEADER
   ========================================================= */
/* Shared only header normalizer.
 * Keeps Fine Arts as the global header treatment and adds Bootstrap-compatible
 * structural classes without loading Bootstrap's global stylesheet.
 */
// (function () {
//   "use strict";

//   function addClasses(element, names) {
//     if (!element) return;
//     names
//       .split(/\s+/)
//       .filter(Boolean)
//       .forEach(function (name) {
//         element.classList.add(name);
//       });
//   }

//   function isWorkSide(header) {
//     if (document.body.classList.contains("work-page")) return true;
//     if (
//       /\/(?:work|project|contact|resume(?:-build)?)\.html$/.test(
//         location.pathname,
//       )
//     )
//       return true;
//     return !!header.querySelector(
//       '.tabs .active a[href*="work.html"],.tabs a[aria-current="page"][href*="work.html"]',
//     );
//   }

//   function createWorkMainNav(header) {
//     var nav = document.createElement("div");
//     nav.className = "main-nav";
//     nav.innerHTML =
//       '<div class="main-nav-inner"><a class="site-brand" href="/index.html">SUSAN DELGADO</a><nav class="site-links" aria-label="Technical portfolio navigation"><a href="work.html">TECHNICAL WORK</a><a href="project.html?post=23">PROJECTS</a><a href="contact.html" aria-current="page">CONTACT</a></nav></div>';
//     header.appendChild(nav);
//     return nav;
//   }

//   function normalizeHeader(root) {
//     root = root || document;
//     var header = root.querySelector(".site-header");
//     if (!header) return;

//     var workSide = isWorkSide(header);
//     addClasses(header, "site-header w-100");

//     var topTabs = header.querySelector(".top-tabs");
//     addClasses(topTabs, "w-100");

//     var tabs = header.querySelector(".tabs");
//     if (tabs) {
//       addClasses(tabs, "nav nav-tabs");
//       tabs.querySelectorAll(":scope > li").forEach(function (item) {
//         addClasses(item, "nav-item");
//         var link = item.querySelector(":scope > a");
//         addClasses(link, "nav-link");
//         if (
//           item.classList.contains("active") ||
//           (link && link.getAttribute("aria-current") === "page")
//         )
//           link.classList.add("active");
//       });
//     }

//     var mainNav = header.querySelector(".main-nav");
//     if (!mainNav && workSide) mainNav = createWorkMainNav(header);
//     if (!mainNav) return;

//     addClasses(mainNav, "navbar navbar-expand-lg");
//     mainNav.classList.toggle("nav-work", workSide);

//     var inner = mainNav.querySelector(".main-nav-inner");
//     addClasses(inner, "container-fluid");

//     var brand = mainNav.querySelector(".site-brand");
//     addClasses(brand, "navbar-brand");

//     var links = mainNav.querySelector(".site-links");
//     addClasses(links, "navbar-nav ms-auto");
//     if (links) {
//       links.querySelectorAll(":scope > a").forEach(function (link) {
//         addClasses(link, "nav-link");
//       });
//     }
//   }

//   window.initBuildHeader = normalizeHeader;

//   if (document.readyState === "loading")
//     document.addEventListener("DOMContentLoaded", function () {
//       normalizeHeader(document);
//     });
//   else normalizeHeader(document);
// })();

/* =========================================================
   BUILD MOTION / TECHNICAL PORTFOLIO
   ========================================================= */
// (function () {
//   "use strict";

//   var portfolioObserverInstalled = false;
//   var currentLightboxTrigger = null;

//   /* Evidence status from the surviving source archive.
//      CHIP, SCAI and TRAC have inspectable Angular application source.
//      Dallas Leipzig has inspectable surviving source without Angular.
//      TVT remains unverified in the current archive. */
//   var confirmedAngularPosts = new Set(["14", "18", "44", "45"]);
//   var unverifiedAngularPosts = new Set(["16", "39"]);

//   function currentFile() {
//     return location.pathname.split("/").pop() || "";
//   }

//   function isWorkPage() {
//     return currentFile() === "work.html";
//   }

//   function isProjectPage() {
//     return currentFile() === "project.html";
//   }

//   function ensureBuildHeader() {
//     if (window.initBuildHeader) {
//       window.initBuildHeader(document);
//       return;
//     }
//     if (document.getElementById("sd-header-js")) return;
//     var script = document.createElement("script");
//     script.id = "sd-header-js";
//     script.src = "/js/header.js";
//     document.head.appendChild(script);
//   }

//   function ensureInteractionStylesheet() {
//     if (document.getElementById("sd-interactions-css")) return;
//     var link = document.createElement("link");
//     link.id = "sd-interactions-css";
//     link.rel = "stylesheet";
//     link.href = "/css/interactions.css";
//     document.head.appendChild(link);
//   }

//   function getPostId() {
//     if (!isProjectPage()) return "";
//     return new URLSearchParams(location.search).get("post") || "23";
//   }

//   function postIdFromLink(link) {
//     if (!link) return "";
//     try {
//       var url = new URL(link.getAttribute("href") || "", location.href);
//       return url.pathname.endsWith("/project.html")
//         ? url.searchParams.get("post") || ""
//         : "";
//     } catch (e) {
//       return "";
//     }
//   }

//   function normalizePortfolioNavigation(root) {
//     root = root || document;
//     var archiveHeading = document.querySelector("#archive .section-head h2");
//     if (
//       archiveHeading &&
//       archiveHeading.textContent.trim() === "Additional professional work"
//     ) {
//       archiveHeading.id = "additional-professional-work";
//     }

//     root.querySelectorAll(".case-taxonomy-group").forEach(function (group) {
//       var label = group.querySelector(".case-taxonomy-label");
//       if (!label) return;
//       var labelText = label.textContent.trim();
//       if (labelText === "Project type" || labelText === "Category") {
//         label.textContent = "Category";
//         group.querySelectorAll("a.pill").forEach(function (link) {
//           var href = link.getAttribute("href") || "";
//           if (href.indexOf("#archive") !== -1)
//             href = href.replace("#archive", "#projectArchive");
//           if (href.indexOf("#additional-professional-work") !== -1)
//             href = href.replace(
//               "#additional-professional-work",
//               "#projectArchive",
//             );
//           link.setAttribute("href", href);
//         });
//       } else if (labelText === "Skills") {
//         group.querySelectorAll("a.pill").forEach(function (link) {
//           var span = document.createElement("span");
//           span.className = "pill";
//           span.textContent = link.textContent;
//           link.replaceWith(span);
//         });
//       }
//     });

//     root.querySelectorAll("a.case-nav-all").forEach(function (link) {
//       link.setAttribute("href", "work.html#projectArchive");
//     });
//     root
//       .querySelectorAll('a[href*="work.html?type="]')
//       .forEach(function (link) {
//         var href = link.getAttribute("href") || "";
//         if (href.indexOf("#archive") !== -1)
//           href = href.replace("#archive", "#projectArchive");
//         if (href.indexOf("#additional-professional-work") !== -1)
//           href = href.replace(
//             "#additional-professional-work",
//             "#projectArchive",
//           );
//         link.setAttribute("href", href);
//       });
//     root
//       .querySelectorAll(
//         'a[href="work.html#archive"],a[href="work.html#additional-professional-work"]',
//       )
//       .forEach(function (link) {
//         link.setAttribute("href", "work.html#projectArchive");
//       });

//     var filterStatus = document.getElementById("archiveFilterStatus");
//     if (filterStatus) {
//       Array.prototype.slice
//         .call(filterStatus.childNodes)
//         .forEach(function (node) {
//           if (
//             node.nodeType === Node.TEXT_NODE &&
//             node.nodeValue.indexOf("Project type:") !== -1
//           ) {
//             node.nodeValue = node.nodeValue.replace(
//               "Project type:",
//               "Category:",
//             );
//           }
//         });
//       filterStatus
//         .querySelectorAll(
//           'a[href="work.html#archive"],a[href="work.html#additional-professional-work"]',
//         )
//         .forEach(function (link) {
//           link.setAttribute("href", "work.html#projectArchive");
//         });
//     }

//     if (
//       isWorkPage() &&
//       (location.hash === "#archive" ||
//         location.hash === "#additional-professional-work")
//     ) {
//       history.replaceState(
//         null,
//         "",
//         location.pathname + location.search + "#projectArchive",
//       );
//     }
//   }

//   function normalizeAngularLabel(text) {
//     return /^AngularJS$/i.test(String(text || "").trim())
//       ? "Angular"
//       : String(text || "").trim();
//   }

//   function applyVerifiedTechnologyEvidence(root) {
//     root = root || document;

//     if (isWorkPage()) {
//       root
//         .querySelectorAll(".project-card,.archive-card")
//         .forEach(function (card) {
//           var id = postIdFromLink(
//             card.querySelector('a[href*="project.html?post="]'),
//           );
//           if (!id) return;
//           var skills = String(card.dataset.skills || "")
//             .split("||")
//             .map(normalizeAngularLabel)
//             .filter(Boolean);
//           skills = skills.filter(function (skill) {
//             return skill.toLowerCase() !== "angularjs";
//           });
//           var hasAngular = skills.some(function (skill) {
//             return skill.toLowerCase() === "angular";
//           });
//           if (confirmedAngularPosts.has(id) && !hasAngular)
//             skills.push("angular");
//           if (unverifiedAngularPosts.has(id))
//             skills = skills.filter(function (skill) {
//               return skill.toLowerCase() !== "angular";
//             });
//           card.dataset.skills = Array.from(new Set(skills)).join("||");
//         });
//     }

//     if (isProjectPage()) {
//       var id = getPostId();
//       root.querySelectorAll(".case-taxonomy-group").forEach(function (group) {
//         var label = group.querySelector(".case-taxonomy-label");
//         if (!label || label.textContent.trim() !== "Skills") return;
//         var pills = Array.prototype.slice.call(group.querySelectorAll(".pill"));
//         pills.forEach(function (pill) {
//           if (/^AngularJS$/i.test(pill.textContent.trim()))
//             pill.textContent = "Angular";
//         });
//         pills = Array.prototype.slice.call(group.querySelectorAll(".pill"));
//         var angularPill = pills.find(function (pill) {
//           return /^Angular$/i.test(pill.textContent.trim());
//         });
//         var holder = group.querySelector(".pills");
//         if (confirmedAngularPosts.has(id) && holder && !angularPill) {
//           var span = document.createElement("span");
//           span.className = "pill";
//           span.textContent = "Angular";
//           holder.appendChild(span);
//         }
//         if (unverifiedAngularPosts.has(id)) {
//           group.querySelectorAll(".pill").forEach(function (pill) {
//             if (/^Angular(?:JS)?$/i.test(pill.textContent.trim()))
//               pill.remove();
//           });
//         }
//       });
//     }
//   }

//   function removePostEleven() {
//     if (isProjectPage() && getPostId() === "11") {
//       location.replace("work.html#additional-professional-work");
//       return true;
//     }
//     if (isWorkPage()) {
//       document
//         .querySelectorAll('a[href*="project.html?post=11"]')
//         .forEach(function (link) {
//           var card = link.closest(".project-card,.archive-card");
//           if (card) card.remove();
//         });
//     }
//     return false;
//   }

//   function addFellowsInteraction() {
//     var id = getPostId();
//     if (id !== "17" && id !== "21") return;
//     var section = document.getElementById("uxSection");
//     var title = document.getElementById("uxTitle");
//     var intro = document.getElementById("uxIntro");
//     var panels = document.getElementById("uxPanels");
//     if (
//       !section ||
//       !title ||
//       !intro ||
//       !panels ||
//       section.dataset.sdFellows === "1"
//     )
//       return;
//     title.textContent = "Selectable conference content component";
//     intro.textContent =
//       "The Fellows interface let visitors move between conference topics without leaving the page.";
//     panels.innerHTML =
//       '<article class="panel"><h3>Coordinated content switching</h3><p>Selecting an item updated both the featured image and the corresponding explanatory text in place.</p></article><article class="panel"><h3>In-page topic navigation</h3><p>The interaction kept the visual reference and related information paired while visitors moved between topics.</p></article>';
//     section.hidden = false;
//     section.dataset.sdFellows = "1";
//   }

//   function cleanWinterBallPreview() {
//     if (getPostId() !== "10") return;
//     var preview = document.getElementById("projectPreview");
//     if (!preview) return;
//     var image = Array.prototype.find.call(
//       preview.querySelectorAll("img"),
//       function (img) {
//         return (
//           (img.getAttribute("src") || "").indexOf(
//             "pcwp-winterball-photo-2018.jpg",
//           ) !== -1
//         );
//       },
//     );
//     if (!image) return;
//     var row = image.closest(".row");
//     var column = image.closest('[class*="col-"]');
//     if (column) column.remove();
//     else image.remove();
//     if (row) {
//       var remaining = Array.prototype.slice
//         .call(row.children)
//         .filter(function (child) {
//           return child.querySelector && child.querySelector("img");
//         });
//       if (remaining.length === 2)
//         remaining.forEach(function (child) {
//           child.className = "col-lg-6 col-md-6 col-sm-12";
//         });
//     }
//   }

//   function ensureLightbox() {
//     var box = document.querySelector(".sd-lightbox");
//     if (box) return box;
//     box = document.createElement("div");
//     box.className = "sd-lightbox";
//     box.hidden = true;
//     box.setAttribute("role", "dialog");
//     box.setAttribute("aria-modal", "true");
//     box.setAttribute("aria-label", "Expanded project image");
//     box.innerHTML =
//       '<div class="sd-lightbox-inner"><button class="sd-lightbox-close" type="button" aria-label="Close expanded image">×</button><img alt=""><p class="sd-lightbox-caption"></p></div>';
//     document.body.appendChild(box);

//     function close() {
//       if (box.hidden) return;
//       box.hidden = true;
//       document.documentElement.classList.remove("sd-lightbox-open");
//       box.querySelector("img").removeAttribute("src");
//       if (currentLightboxTrigger && document.contains(currentLightboxTrigger))
//         currentLightboxTrigger.focus({ preventScroll: true });
//       currentLightboxTrigger = null;
//     }

//     box.addEventListener("click", function (event) {
//       if (event.target === box || event.target.closest(".sd-lightbox-close"))
//         close();
//     });
//     document.addEventListener("keydown", function (event) {
//       if (event.key === "Escape" && !box.hidden) close();
//     });
//     return box;
//   }

//   function openLightbox(trigger) {
//     var box = ensureLightbox();
//     var image = box.querySelector("img");
//     var caption = box.querySelector(".sd-lightbox-caption");
//     currentLightboxTrigger = trigger;
//     image.src = trigger.currentSrc || trigger.src;
//     image.alt = trigger.alt || "Expanded project image";
//     caption.textContent = trigger.alt || "";
//     caption.hidden = !caption.textContent;
//     box.hidden = false;
//     document.documentElement.classList.add("sd-lightbox-open");
//     box.querySelector(".sd-lightbox-close").focus({ preventScroll: true });
//   }

//   function bindLightboxImages(root) {
//     if (!isProjectPage()) return;
//     root = root || document;
//     root
//       .querySelectorAll(".case-visual img,#projectPreview img")
//       .forEach(function (img) {
//         if (img.dataset.sdLightbox === "1") return;
//         img.dataset.sdLightbox = "1";
//         img.setAttribute("role", "button");
//         img.setAttribute("tabindex", "0");
//         img.setAttribute(
//           "aria-label",
//           (img.alt || "Project image") + " — open larger",
//         );
//         img.addEventListener("click", function (event) {
//           event.preventDefault();
//           event.stopPropagation();
//           openLightbox(img);
//         });
//         img.addEventListener("keydown", function (event) {
//           if (event.key === "Enter" || event.key === " ") {
//             event.preventDefault();
//             openLightbox(img);
//           }
//         });
//       });
//   }

//   function runPortfolioFixes(root) {
//     if (removePostEleven()) return;
//     normalizePortfolioNavigation(root || document);
//     applyVerifiedTechnologyEvidence(root || document);
//     cleanWinterBallPreview();
//     addFellowsInteraction();
//     bindLightboxImages(root || document);
//   }

//   function installPortfolioObserver() {
//     if (portfolioObserverInstalled || !window.MutationObserver) return;
//     var targets = [
//       document.getElementById("caseHero"),
//       document.getElementById("caseNavTop"),
//       document.getElementById("caseNavBottom"),
//       document.getElementById("caseNarrative"),
//       document.getElementById("uxSection"),
//       document.getElementById("projectPreview"),
//       document.getElementById("projectArchive"),
//       document.getElementById("archiveFilterStatus"),
//     ].filter(Boolean);
//     if (!targets.length) return;
//     portfolioObserverInstalled = true;
//     var queued = false;
//     var observer = new MutationObserver(function () {
//       if (queued) return;
//       queued = true;
//       requestAnimationFrame(function () {
//         queued = false;
//         runPortfolioFixes(document);
//       });
//     });
//     targets.forEach(function (target) {
//       observer.observe(target, { childList: true, subtree: true });
//     });
//   }

//   function initCursor() {
//     if (
//       !window.matchMedia ||
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches
//     )
//       return;
//     if (
//       !window.matchMedia("(pointer:fine) and (hover:hover)").matches ||
//       document.querySelector(".sd-cursor")
//     )
//       return;
//     var cursor = document.createElement("div");
//     cursor.className = "sd-cursor";
//     document.body.appendChild(cursor);
//     document.documentElement.classList.add("sd-cursor-enabled");
//     var lastMode = "";

//     function setMode(target) {
//       var image =
//         target &&
//         target.closest &&
//         target.closest(
//           "[data-sd-lightbox],.project-image,.case-visual,.preview-stack a",
//         );
//       var link =
//         target && target.closest && target.closest('a,button,[role="button"]');
//       var mode = image ? "image" : link ? "link" : "";
//       if (mode === lastMode) return;
//       lastMode = mode;
//       document.documentElement.classList.toggle(
//         "sd-cursor-image",
//         mode === "image",
//       );
//       document.documentElement.classList.toggle(
//         "sd-cursor-link",
//         mode === "link",
//       );
//     }

//     document.addEventListener(
//       "pointermove",
//       function (event) {
//         cursor.style.transform =
//           "translate3d(" +
//           event.clientX +
//           "px," +
//           event.clientY +
//           "px,0) translate(-50%,-50%)";
//         document.documentElement.classList.add("sd-cursor-live");
//         setMode(event.target);
//       },
//       { passive: true },
//     );
//     document.addEventListener("pointerleave", function () {
//       document.documentElement.classList.remove(
//         "sd-cursor-live",
//         "sd-cursor-link",
//         "sd-cursor-image",
//       );
//       lastMode = "";
//     });
//     window.addEventListener("blur", function () {
//       document.documentElement.classList.remove(
//         "sd-cursor-live",
//         "sd-cursor-link",
//         "sd-cursor-image",
//       );
//       lastMode = "";
//     });
//   }

//   function initBuildMotion(root) {
//     ensureBuildHeader();
//     ensureInteractionStylesheet();
//     runPortfolioFixes(root || document);
//     installPortfolioObserver();
//   }

//   window.initBuildMotion = initBuildMotion;

//   function init() {
//     ensureBuildHeader();
//     ensureInteractionStylesheet();
//     runPortfolioFixes(document);
//     installPortfolioObserver();
//     initCursor();
//   }

//   if (document.readyState === "loading")
//     document.addEventListener("DOMContentLoaded", init);
//   else init();
// })();

/* =========================================================
   FINE ARTS INTERIOR
   ========================================================= */
// (function () {
//   "use strict";

//   function ensureBuildHeader() {
//     if (window.initBuildHeader) {
//       window.initBuildHeader(document);
//       return;
//     }
//     if (document.getElementById("sd-header-js")) return;
//     var script = document.createElement("script");
//     script.id = "sd-header-js";
//     script.src = "/js/header.js";
//     document.head.appendChild(script);
//   }

//   ensureBuildHeader();

//   var frame = document.querySelector(".finearts-preview-frame");
//   if (!frame) return;

//   function resizeFrame(doc) {
//     if (!doc || !doc.documentElement) return;
//     var height = Math.max(
//       doc.documentElement.scrollHeight || 0,
//       doc.body ? doc.body.scrollHeight : 0,
//       900,
//     );
//     frame.style.height = height + "px";
//   }

//   frame.addEventListener("load", function () {
//     var doc = frame.contentDocument;
//     if (!doc) return;

//     var hideChrome = doc.createElement("style");
//     hideChrome.textContent =
//       "#top{display:none!important} footer{display:none!important}";
//     doc.head.appendChild(hideChrome);

//     var theme = doc.createElement("link");
//     theme.rel = "stylesheet";
//     theme.href = "/css/finearts-build.css";
//     doc.head.appendChild(theme);

//     doc
//       .querySelectorAll(".process-hero,.boutique-hero")
//       .forEach(function (hero) {
//         hero.classList.add("finearts-hero");
//       });

//     resizeFrame(doc);
//     if (window.ResizeObserver && doc.body) {
//       var observer = new ResizeObserver(function () {
//         resizeFrame(doc);
//       });
//       observer.observe(doc.body);
//     }
//     setTimeout(function () {
//       resizeFrame(doc);
//     }, 500);
//     setTimeout(function () {
//       resizeFrame(doc);
//     }, 1800);
//   });
// })();

/* =========================================================
   FINE ARTS GALLERY
   ========================================================= */
/* Review-only Fine Arts gallery renderer.
 * Uses the same archive JSON as the live site but presents works as an
 * editorial exhibition rather than a card grid.
 */
(function () {
  "use strict";

  var ENDPOINT =
    "https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec";
  var GALLERIES = [
    {
      type: "gstory",
      label: "Narrative",
      href: "narrative-gallery-build.html",
    },
    { type: "gnature", label: "Wildlife", href: "wildlife-gallery-build.html" },
    {
      type: "gdecor",
      label: "Decorative",
      href: "decorative-gallery-build.html",
    },
    {
      type: "gstudy",
      label: "Academic Studies",
      href: "studies-gallery-build.html",
    },
  ];

  function ensureBuildHeader() {
    // if (window.initBuildHeader) {
    //   window.initBuildHeader(document);
    //   return;
    // }
    // if (document.getElementById("sd-header-js")) return;
    // var script = document.createElement("script");
    // script.id = "sd-header-js";
    // script.src = "/js/header.js";
    // document.head.appendChild(script);
  }

  function text(value) {
    if (Array.isArray(value)) return value.filter(Boolean).join(" ").trim();
    return value === null || value === undefined ? "" : String(value).trim();
  }

  function normalizeKey(value) {
    return String(value || "")
      .replace(/[\s_-]/g, "")
      .toLowerCase();
  }

  function field(item) {
    var names = [].slice.call(arguments, 1).map(normalizeKey);
    var sources = [item || {}, (item && item.misc) || {}];
    for (var s = 0; s < sources.length; s++) {
      var source = sources[s];
      for (var key in source) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
        if (names.indexOf(normalizeKey(key)) !== -1) {
          var value = text(source[key]);
          if (value) return value;
        }
      }
    }
    return "";
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function imageURL(item) {
    var files = Array.isArray(item && item.files)
      ? item.files
      : item && item.files
        ? [item.files]
        : [];
    for (var f = 0; f < files.length; f++) {
      var entry = files[f];
      if (typeof entry !== "string") continue;
      var parts = entry.split(/\r?\n/).map(function (x) {
        return x.trim();
      });
      if (parts.length >= 3 && /^https?:\/\//i.test(parts[2])) return parts[2];
      for (var i = parts.length - 1; i >= 0; i--) {
        if (/^https?:\/\//i.test(parts[i])) return parts[i];
      }
    }
    return "";
  }

  function getArchive() {
    if (
      window.SiteArchiveData &&
      typeof window.SiteArchiveData.get === "function"
    )
      return window.SiteArchiveData.get();
    return fetch(ENDPOINT).then(function (r) {
      if (!r.ok) throw new Error("Archive unavailable");
      return r.json();
    });
  }

  function insertGalleryNavigation(type) {
    var hero = document.querySelector(".art-gallery-hero");
    if (!hero || hero.querySelector(".art-gallery-categories")) return;
    var target = hero.querySelector(".container") || hero;
    var nav = document.createElement("nav");
    nav.className = "art-gallery-categories";
    nav.setAttribute("aria-label", "Fine Arts galleries");
    nav.innerHTML = GALLERIES.map(function (gallery) {
      return (
        '<a href="' +
        gallery.href +
        '"' +
        (gallery.type === type ? ' class="active" aria-current="page"' : "") +
        ">" +
        gallery.label +
        "</a>"
      );
    }).join("");
    target.appendChild(nav);
  }

  function makeCard(item, index) {
    var src = imageURL(item);
    var title = field(item, "title") || "Untitled";
    var media = field(item, "media", "medium") || "Masterwork";
    var dimensions = field(item, "dimensions", "size");
    var year = field(item, "year", "date");
    var status = field(item, "status", "availability");
    var description = text(item.description);
    var meta = [media, dimensions, status].filter(Boolean).join(" · ");

    var figure = document.createElement("figure");
    figure.className = "art-gallery-card";
    figure.innerHTML =
      '<button type="button" class="art-gallery-open" data-index="' +
      index +
      '" aria-label="View ' +
      escapeHTML(title) +
      ' larger">' +
      '<span class="art-gallery-media-stage">' +
      (src
        ? '<img src="' +
          escapeHTML(src) +
          '" alt="' +
          escapeHTML(title) +
          '" loading="lazy">'
        : '<span class="art-gallery-image-missing">Image forthcoming</span>') +
      "</span>" +
      "</button>" +
      '<figcaption class="art-gallery-caption">' +
      "<h2>" +
      escapeHTML(title) +
      "</h2>" +
      (meta ? '<p class="art-gallery-meta">' + escapeHTML(meta) + "</p>" : "") +
      (description
        ? '<p class="art-gallery-description">' +
          escapeHTML(description) +
          "</p>"
        : "") +
      "</figcaption>";
    return {
      node: figure,
      src: src,
      title: title,
      meta: meta,
      description: description,
    };
  }

  function init() {
    // ensureBuildHeader();
    var body = document.body;
    var type = (body.getAttribute("data-gallery-type") || "").toLowerCase();
    var grid = document.getElementById("artGalleryGrid");
    var status = document.getElementById("artGalleryStatus");
    var lightbox = document.getElementById("artGalleryLightbox");
    var lightboxImage = document.getElementById("artGalleryLightboxImage");
    var lightboxTitle = document.getElementById("artGalleryLightboxTitle");
    var lightboxMeta = document.getElementById("artGalleryLightboxMeta");
    var lightboxDescription = document.getElementById(
      "artGalleryLightboxDescription",
    );
    var close = document.getElementById("artGalleryClose");
    var records = [];

    if (
      !type ||
      !grid ||
      !lightbox ||
      !lightboxImage ||
      !lightboxTitle ||
      !lightboxMeta ||
      !lightboxDescription ||
      !close
    )
      return;

    insertGalleryNavigation(type);

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImage.removeAttribute("src");
    }

    getArchive()
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error("Invalid archive data");
        var items = data
          .filter(function (item) {
            return (
              String(item.type || "")
                .trim()
                .toLowerCase() === type
            );
          })
          .sort(function (a, b) {
            return Number(a.id || 0) - Number(b.id || 0);
          });

        if (status) status.remove();
        if (!items.length) {
          grid.innerHTML =
            '<p class="art-gallery-empty">No works are currently assigned to this gallery.</p>';
          return;
        }

        items.forEach(function (item, index) {
          var record = makeCard(item, index);
          records.push(record);
          grid.appendChild(record.node);
        });

        grid.addEventListener("click", function (event) {
          var button = event.target.closest(".art-gallery-open");
          if (!button) return;
          var record = records[Number(button.getAttribute("data-index"))];
          if (!record || !record.src) return;
          lightboxImage.src = record.src;
          lightboxImage.alt = record.title;
          lightboxTitle.textContent = record.title;
          lightboxMeta.textContent = record.meta;
          lightboxDescription.textContent = record.description;
          lightbox.classList.add("open");
          lightbox.setAttribute("aria-hidden", "false");
          close.focus();
        });
      })
      .catch(function () {
        if (status)
          status.textContent = "The gallery archive could not be loaded.";
      });

    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("open"))
        closeLightbox();
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* =========================================================
   EMBEDDED BUILD PAGE SCRIPTS
   =========================================================
   These functions archive JavaScript that currently lives inline in HTML
   files under /build. They are page-gated by the existing body id and DOM.

   While an HTML page still contains its legacy inline script, the dispatcher
   detects a marker in that inline block and does NOT run the archived copy.
   Once that inline script is removed later, the same global file will run the
   correct initializer automatically. No HTML is changed here.
   ========================================================= */
(function () {
  "use strict";

  var pages = (window.BuildInlinePages = window.BuildInlinePages || {});
  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec";

  function inlineContains(marker) {
    if (!marker) return false;
    return Array.prototype.some.call(document.scripts, function (script) {
      return !script.src && (script.textContent || "").indexOf(marker) !== -1;
    });
  }

  function runWhenReady(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function loadTemplate(target) {
    var url = target && target.getAttribute("data-template");
    if (!target || !url)
      return Promise.reject(new Error("Project template target unavailable"));
    return fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("Project template unavailable");
        return response.text();
      })
      .then(function (html) {
        target.innerHTML = html;
        return target;
      });
  }

  function initProcessVideos() {
    var connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    document.querySelectorAll(".process-video").forEach(function (video) {
      video.muted = true;
      if (!connection) return;
      if (
        connection.saveData ||
        ["slow-2g", "2g", "3g"].includes(connection.effectiveType)
      ) {
        console.log("The winds are weak. Staying the process-video motion.");
        video.pause();
        video.autoplay = false;
      } else {
        video.play().catch(function () {
          console.log("Motion paused by browser policy.");
        });
      }
    });
  }

  pages.index = function () {
    var video = document.querySelector(".splash-video");
    var source = video && video.querySelector("source");
    function useBlackFallback() {
      if (video) video.style.display = "none";
    }
    if (video) video.addEventListener("error", useBlackFallback);
    if (source) source.addEventListener("error", useBlackFallback);
  };

  pages.finearts = function () {
    initProcessVideos();
  };

  pages.about = function () {
    if (window.IntersectionObserver) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) entry.target.classList.add("active-node");
          });
        },
        { threshold: 0.15 },
      );
      document
        .querySelectorAll(
          ".process-node,.mastery-parallax-window,.mastery-content-box",
        )
        .forEach(function (node) {
          observer.observe(node);
        });
    }
    initProcessVideos();
  };

  pages.resume = function () {
    var button = document.getElementById("saveResumePdf");
    if (button)
      button.addEventListener("click", function () {
        window.print();
      });
  };

  /* ------------------------------------------------
     Shared project-data helpers used by Work and Project.
     --------------------------------------------------------- */
  function projectHelpers() {
    function strip(value) {
      var div = document.createElement("div");
      div.innerHTML = String(value || "");
      return (div.textContent || "").trim();
    }
    function lines(value) {
      return String(value || "")
        .split(/<br\s*\/?\s*>/i)
        .map(strip)
        .filter(Boolean);
    }
    function key(value) {
      return strip(value).toLowerCase().replace(/\s+/g, " ").trim();
    }
    function yearNum(value) {
      var match = String(value || "").match(/\d{4}/);
      return match ? parseInt(match[0], 10) : 0;
    }
    function contains(project, token) {
      return (
        (" " + String(project.filters || "") + " ").indexOf(
          " " + token + " ",
        ) !== -1
      );
    }
    function isCrfRelated(project) {
      return /Cardiovascular Research Foundation|\bCRF\b/i.test(
        [
          project.client,
          project.role,
          strip(project.content),
          project.summary,
        ].join(" "),
      );
    }
    function normalizeProject(project) {
      var next = Object.assign({}, project);
      var skills = lines(next.skills).map(function (skill) {
        return skill === "AngularJS" ? "Angular" : skill;
      });
      skills = skills.filter(function (skill) {
        return !/^(Rapha[eë]l(?:\.js)?|TweenLite|Animate\.css)$/i.test(skill);
      });
      var emailRelated =
        contains(next, "email") ||
        skills.some(function (skill) {
          return /^Email Development$/i.test(skill);
        });
      if (
        emailRelated &&
        isCrfRelated(next) &&
        !skills.some(function (skill) {
          return /^Salesforce Pardot$/i.test(skill);
        })
      )
        skills.push("Salesforce Pardot");
      next.skills = skills.join("<br>");
      return next;
    }
    function merge(base, extras) {
      var result = (base || []).map(function (project) {
        return Object.assign({}, project, { legacyId: String(project.id) });
      });
      (extras || []).forEach(function (extra) {
        var overrides = (extra && extra.overrides) || {};
        result = result.map(function (project) {
          var override =
            overrides[String(project.legacyId)] ||
            overrides[String(project.id)] ||
            {};
          return Object.assign({}, project, override, {
            legacyId: String(project.legacyId),
          });
        });
        ((extra && extra.posts) || []).forEach(function (project) {
          var id = String(project.id);
          var index = result.findIndex(function (item) {
            return String(item.legacyId) === id;
          });
          var next = Object.assign({}, project, { legacyId: id });
          if (index >= 0)
            result[index] = Object.assign({}, result[index], next);
          else result.push(next);
        });
      });
      return result
        .filter(function (project) {
          return !project.hidden;
        })
        .map(normalizeProject)
        .sort(function (a, b) {
          return (
            yearNum(b.year) - yearNum(a.year) ||
            strip(a.title).localeCompare(strip(b.title))
          );
        });
    }
    function optionalJson(url) {
      return fetch(url)
        .then(function (response) {
          return response.ok ? response.json() : {};
        })
        .catch(function () {
          return {};
        });
    }
    function loadProjects() {
      return Promise.all([
        fetch("/js/posts.json").then(function (response) {
          if (!response.ok) throw new Error("Project baseline unavailable");
          return response.json();
        }),
        optionalJson("/js/posts-extra.json"),
        optionalJson("/js/posts-corrections.json"),
        optionalJson("/js/posts-project-copy.json"),
        optionalJson("/js/posts-new.json"),
        optionalJson("/build/js/casestudies.json"),
      ]).then(function (data) {
        var buildData = data[5] || {};
        return {
          posts: merge((data[0] && data[0].posts) || [], [
            data[1] || {},
            data[2] || {},
            data[3] || {},
            data[4] || {},
            buildData,
          ]),
          build: buildData,
          raw: data,
        };
      });
    }
    return {
      strip: strip,
      lines: lines,
      key: key,
      yearNum: yearNum,
      contains: contains,
      normalizeProject: normalizeProject,
      merge: merge,
      optionalJson: optionalJson,
      loadProjects: loadProjects,
    };
  }

  var project = projectHelpers();

  pages.work = function () {
    var featuredIds = ["23", "22", "16", "1"];
    var featured = document.getElementById("featuredProjects");
    var archive = document.getElementById("projectArchive");
    var filterStatus = document.getElementById("archiveFilterStatus");
    var buttons = document.querySelectorAll(".filter");
    var posts = [];
    var filterRun = 0;
    var typeLabels = {
      conf: "Campaigns",
      web: "Websites",
      email: "Emails",
      dig: "Digital",
      print: "Print Collateral",
      brand: "Branding",
    };
    if (!featured || !archive || !filterStatus) return;

    function url(item) {
      return "project.html?post=" + encodeURIComponent(item.legacyId);
    }
    function image(item) {
      return "/" + (item.thumb || item.image || "");
    }
    function card(item, small) {
      var article = document.createElement("article");
      article.className = small ? "archive-card" : "project-card";
      article.dataset.filters = item.filters || "";
      article.dataset.skills = project
        .lines(item.skills)
        .map(project.key)
        .join("||");
      var meta = [item.year, project.strip(item.client)]
        .filter(Boolean)
        .join(" · ");
      article.innerHTML =
        '<a class="project-image" href="' +
        url(item) +
        '"><img src="' +
        image(item) +
        '" alt="' +
        project.strip(item.title) +
        '" loading="lazy"></a><div class="project-copy"><p class="project-meta">' +
        meta +
        '</p><h3><a href="' +
        url(item) +
        '">' +
        item.title +
        "</a></h3><p>" +
        (item.summary || "Professional project.") +
        '</p><div class="project-role">' +
        project.strip(item.role).replace(/\s+/g, " · ") +
        "</div></div>";
      return article;
    }
    function renderFeatured() {
      featured.innerHTML = "";
      featuredIds.forEach(function (id) {
        var item = posts.find(function (candidate) {
          return String(candidate.legacyId) === id;
        });
        if (item) featured.appendChild(card(item, false));
      });
    }
    function defaultArchivePosts() {
      return posts.filter(function (item) {
        return featuredIds.indexOf(String(item.legacyId)) === -1;
      });
    }
    function renderArchive(source) {
      archive.innerHTML = "";
      (source || []).forEach(function (item) {
        archive.appendChild(card(item, true));
      });
      if (window.initBuildMotion) window.initBuildMotion(document);
    }
    function cardMatches(node, type, skill) {
      if (
        type &&
        type !== "all" &&
        (" " + node.dataset.filters + " ").indexOf(" " + type + " ") === -1
      )
        return false;
      if (
        skill &&
        String(node.dataset.skills || "")
          .split("||")
          .indexOf(project.key(skill)) === -1
      )
        return false;
      return true;
    }
    function setButtonState(type) {
      buttons.forEach(function (button) {
        button.classList.toggle(
          "active",
          type
            ? button.dataset.filter === type
            : button.dataset.filter === "all",
        );
      });
      if (!type)
        buttons.forEach(function (button) {
          button.classList.toggle("active", button.dataset.filter === "all");
        });
    }
    function setStatus(type, skill) {
      if (!type && !skill) {
        filterStatus.hidden = true;
        filterStatus.innerHTML = "";
        return;
      }
      var label = skill
        ? "Skill: <strong>" + project.strip(skill) + "</strong>"
        : "Project type: <strong>" +
          (typeLabels[type] || project.strip(type)) +
          "</strong>";
      filterStatus.innerHTML =
        "Showing " +
        label +
        ' <a href="work.html#projectArchive" data-clear-filter>Clear filter</a>';
      filterStatus.hidden = false;
    }
    function filter(type, skill, instant) {
      var run = ++filterRun;
      var cards = Array.prototype.slice.call(
        archive.querySelectorAll(".archive-card"),
      );
      var reduce =
        instant ||
        (window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
        !Element.prototype.animate;
      setStatus(type, skill);
      setButtonState(skill ? null : type || null);
      if (reduce) {
        cards.forEach(function (node) {
          node.hidden = !cardMatches(node, type, skill);
        });
        return;
      }
      cards.forEach(function (node) {
        node.getAnimations().forEach(function (animation) {
          animation.cancel();
        });
      });
      var first = new Map();
      cards
        .filter(function (node) {
          return !node.hidden;
        })
        .forEach(function (node) {
          first.set(node, node.getBoundingClientRect());
        });
      var hiding = cards.filter(function (node) {
        return !node.hidden && !cardMatches(node, type, skill);
      });
      var showing = cards.filter(function (node) {
        return node.hidden && cardMatches(node, type, skill);
      });
      var exits = hiding.map(function (node) {
        return node
          .animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 150,
            easing: "ease-out",
            fill: "forwards",
          })
          .finished.catch(function () {});
      });
      Promise.all(exits).then(function () {
        if (run !== filterRun) return;
        hiding.forEach(function (node) {
          node.hidden = true;
          node.style.opacity = "";
        });
        showing.forEach(function (node) {
          node.hidden = false;
          node.style.opacity = "0";
        });
        var last = new Map();
        cards
          .filter(function (node) {
            return !node.hidden;
          })
          .forEach(function (node) {
            last.set(node, node.getBoundingClientRect());
          });
        cards
          .filter(function (node) {
            return !node.hidden && !showing.includes(node);
          })
          .forEach(function (node) {
            var a = first.get(node),
              b = last.get(node);
            if (!a || !b) return;
            var dx = a.left - b.left,
              dy = a.top - b.top;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
            node.animate(
              [
                { transform: "translate(" + dx + "px," + dy + "px)" },
                { transform: "translate(0,0)" },
              ],
              { duration: 380, easing: "cubic-bezier(.2,.65,.25,1)" },
            );
          });
        showing.forEach(function (node, index) {
          node
            .animate(
              [
                { opacity: 0, transform: "translateY(10px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 330,
                delay: index * 28,
                easing: "ease-out",
                fill: "both",
              },
            )
            .finished.then(function () {
              node.style.opacity = "";
            })
            .catch(function () {});
        });
      });
    }

    filterStatus.addEventListener("click", function (event) {
      var clear = event.target.closest("[data-clear-filter]");
      if (!clear) return;
      event.preventDefault();
      var scrollTop = window.scrollY;
      renderArchive(defaultArchivePosts());
      setStatus(null, null);
      setButtonState(null);
      history.replaceState(null, "", "work.html#projectArchive");
      requestAnimationFrame(function () {
        window.scrollTo({ top: scrollTop, left: 0, behavior: "auto" });
      });
    });

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.dataset.filter;
        if (value === "all") {
          renderArchive(defaultArchivePosts());
          setStatus(null, null);
          setButtonState(null);
          history.replaceState(null, "", "work.html#projectArchive");
          return;
        }
        renderArchive(posts);
        filter(value, null, false);
        history.replaceState(
          null,
          "",
          "work.html?type=" + encodeURIComponent(value) + "#projectArchive",
        );
      });
    });

    project
      .loadProjects()
      .then(function (result) {
        posts = result.posts;
        renderFeatured();
        var params = new URLSearchParams(location.search);
        var type = params.get("type"),
          skill = params.get("skill");
        if (type || skill) {
          renderArchive(posts);
          filter(type, skill, true);
        } else {
          renderArchive(defaultArchivePosts());
          setButtonState(null);
        }
      })
      .catch(function () {
        featured.innerHTML = "<p>Project data is unavailable.</p>";
        archive.innerHTML = "";
      });
  };

  pages.project = function () {
    var target = document.getElementById("projectContent");
    if (!target) return;

    var typeMap = [
      { token: "conf", label: "Campaigns" },
      { token: "web", label: "Websites" },
      { token: "email", label: "Emails" },
      { token: "print", label: "Print collateral" },
      { token: "dig", label: "Digital" },
      { token: "brand", label: "Branding" },
    ];

    function projectUrl(item) {
      return "project.html?post=" + encodeURIComponent(item.legacyId);
    }
    function filterUrl(kind, value) {
      return (
        "work.html?" +
        kind +
        "=" +
        encodeURIComponent(value) +
        "#projectArchive"
      );
    }
    function assetPath(value) {
      var path = String(value || "").trim();
      if (!path) return "";
      if (/^(?:https?:)?\/\//i.test(path) || path.charAt(0) === "/")
        return path;
      return "/" + path;
    }
    function skillPills(item) {
      return project
        .lines(item.skills)
        .map(function (skill) {
          return '<span class="pill">' + skill + "</span>";
        })
        .join("");
    }
    function typePills(item) {
      return typeMap
        .filter(function (type) {
          return project.contains(item, type.token);
        })
        .map(function (type) {
          return (
            '<a class="pill pill-link" href="' +
            filterUrl("type", type.token) +
            '">' +
            type.label +
            "</a>"
          );
        })
        .join("");
    }
    function navMarkup(previous, next) {
      return (
        '<a class="case-nav-link previous" href="' +
        projectUrl(previous) +
        '"><span class="direction">← Previous</span><span class="project">' +
        project.strip(previous.title) +
        '</span></a><a class="case-nav-all" href="work.html#projectArchive">All work</a><a class="case-nav-link next" href="' +
        projectUrl(next) +
        '"><span class="direction">Next →</span><span class="project">' +
        project.strip(next.title) +
        "</span></a>"
      );
    }
    function getProjectElements() {
      return {
        hero: document.getElementById("caseHero"),
        navTop: document.getElementById("caseNavTop"),
        navBottom: document.getElementById("caseNavBottom"),
        context: document.getElementById("caseContext"),
        narrative: document.getElementById("caseNarrative"),
        uxSection: document.getElementById("uxSection"),
        uxTitle: document.getElementById("uxTitle"),
        uxIntro: document.getElementById("uxIntro"),
        uxPanels: document.getElementById("uxPanels"),
        workflowSection: document.getElementById("workflowSection"),
        workflowGrid: document.getElementById("workflowGrid"),
        systemSection: document.getElementById("systemSection"),
        systemTitle: document.getElementById("systemTitle"),
        systemIntro: document.getElementById("systemIntro"),
        systemGrid: document.getElementById("systemGrid"),
        structureSection: document.getElementById("structureSection"),
        structureTitle: document.getElementById("structureTitle"),
        structureIntro: document.getElementById("structureIntro"),
        structureGrid: document.getElementById("structureGrid"),
        deliverableSection: document.getElementById("deliverableSection"),
        deliverableGrid: document.getElementById("deliverableGrid"),
        visualSection: document.getElementById("visualSection"),
        preview: document.getElementById("projectPreview"),
      };
    }
    function renderProjectNav(item, posts, elements) {
      var index = posts.findIndex(function (candidate) {
        return String(candidate.legacyId) === String(item.legacyId);
      });
      if (index < 0 || !posts.length) return;
      var html = navMarkup(
        posts[(index - 1 + posts.length) % posts.length],
        posts[(index + 1) % posts.length],
      );
      if (elements.navTop) elements.navTop.innerHTML = html;
      if (elements.navBottom) elements.navBottom.innerHTML = html;
    }
    function renderHero(item, elements) {
      var role = project.lines(item.role).join(" · ");
      var types = typePills(item);
      var skills = skillPills(item);
      var title = project.strip(item.title) || "Project";
      var summary = project.strip(item.summary || "");
      var kicker =
        [item.year, project.strip(item.client)].filter(Boolean).join(" · ") ||
        "Professional project";
      var image = assetPath(item.image || item.thumb || "");
      var taxonomy =
        (types
          ? '<div class="case-taxonomy-group"><span class="case-taxonomy-label">Category</span><div class="pills">' +
            types +
            "</div></div>"
          : "") +
        (skills
          ? '<div class="case-taxonomy-group"><span class="case-taxonomy-label">Skills</span><div class="pills">' +
            skills +
            "</div></div>"
          : "");
      var visual = image
        ? '<div class="case-visual"><img src="' +
          image +
          '" alt="' +
          title +
          ' project preview"></div>'
        : "";

      document.title = title + " | Susan Delgado";
      elements.hero.classList.remove("status");
      elements.hero.innerHTML =
        '<div class="case-grid"><div><p class="kicker">' +
        kicker +
        '</p><h1 class="case-title">' +
        title +
        "</h1>" +
        (summary ? '<p class="case-summary">' + summary + "</p>" : "") +
        (taxonomy ? '<div class="case-taxonomy">' + taxonomy + "</div>" : "") +
        '</div><dl class="case-meta"><div><dt>Client / company</dt><dd>' +
        (project.strip(item.client) || "Not recorded") +
        "</dd></div><div><dt>Role</dt><dd>" +
        (role || "Not recorded") +
        "</dd></div><div><dt>Year</dt><dd>" +
        (item.year || "Not recorded") +
        "</dd></div></dl></div>" +
        visual;
    }
    function renderContext(item, elements) {
      var content =
        item.content || (item.summary ? "<p>" + item.summary + "</p>" : "");
      if (!content || !elements.context || !elements.narrative) return;
      elements.narrative.innerHTML = content;
      elements.context.hidden = false;
    }
    function renderUX(caseStudy, elements) {
      var ux = caseStudy && caseStudy.ux;
      var panels = ux && Array.isArray(ux.panels) ? ux.panels : [];
      if (
        !ux ||
        (!ux.title && !ux.intro && !panels.length) ||
        !elements.uxSection
      )
        return;
      if (elements.uxTitle) elements.uxTitle.textContent = ux.title || "";
      if (elements.uxIntro) elements.uxIntro.textContent = ux.intro || "";
      if (elements.uxPanels)
        elements.uxPanels.innerHTML = panels
          .map(function (panel) {
            return (
              '<article class="panel"><h3>' +
              panel.title +
              "</h3><p>" +
              panel.copy +
              "</p></article>"
            );
          })
          .join("");
      elements.uxSection.hidden = false;
    }
    function renderWorkflow(caseStudy, elements) {
      var workflow =
        caseStudy && Array.isArray(caseStudy.workflow)
          ? caseStudy.workflow
          : [];
      if (
        !workflow.length ||
        !elements.workflowSection ||
        !elements.workflowGrid
      )
        return;
      elements.workflowGrid.innerHTML = workflow
        .map(function (step) {
          return (
            '<article class="process-step"><span class="step">' +
            step.label +
            "</span><h3>" +
            step.title +
            "</h3><p>" +
            step.copy +
            "</p></article>"
          );
        })
        .join("");
      elements.workflowSection.hidden = false;
    }
    function renderSystem(caseStudy, elements) {
      var system = caseStudy && caseStudy.system;
      var nodes = system && Array.isArray(system.nodes) ? system.nodes : [];
      if (
        !system ||
        (!system.title && !system.intro && !nodes.length) ||
        !elements.systemSection
      )
        return;
      if (elements.systemTitle)
        elements.systemTitle.textContent =
          system.title || "Technical structure";
      if (elements.systemIntro)
        elements.systemIntro.textContent = system.intro || "";
      if (elements.systemGrid)
        elements.systemGrid.innerHTML = nodes
          .map(function (node) {
            return (
              '<article class="node"><h3>' +
              node.title +
              "</h3><p>" +
              node.copy +
              "</p></article>"
            );
          })
          .join("");
      elements.systemSection.hidden = false;
    }
    function renderStructure(structure, elements) {
      var items =
        structure && Array.isArray(structure.items) ? structure.items : [];
      if (
        !items.length ||
        !elements.structureSection ||
        !elements.structureGrid
      )
        return;
      if (elements.structureTitle)
        elements.structureTitle.textContent =
          structure.title || "Website structure";
      if (elements.structureIntro)
        elements.structureIntro.textContent = structure.intro || "";
      elements.structureGrid.innerHTML = items
        .map(function (item) {
          var children = (item.children || [])
            .map(function (child) {
              return "<li>" + child + "</li>";
            })
            .join("");
          return (
            '<article class="structure-node"><h3>' +
            item.label +
            "</h3>" +
            (children ? "<ul>" + children + "</ul>" : "") +
            "</article>"
          );
        })
        .join("");
      elements.structureSection.hidden = false;
    }
    function renderDeliverables(caseStudy, elements) {
      var items =
        caseStudy && Array.isArray(caseStudy.deliverables)
          ? caseStudy.deliverables
          : [];
      if (
        !items.length ||
        !elements.deliverableSection ||
        !elements.deliverableGrid
      )
        return;
      elements.deliverableGrid.innerHTML = items
        .map(function (deliverable) {
          return (
            '<div class="deliverable"><strong>' +
            deliverable.title +
            "</strong><span>" +
            deliverable.copy +
            "</span></div>"
          );
        })
        .join("");
      elements.deliverableSection.hidden = false;
    }
    function previewColumnClass(columns) {
      var count = Number(columns) || 1;
      if (count >= 4) return "col-lg-3 col-md-6 col-sm-12";
      if (count === 3) return "col-lg-4 col-md-4 col-sm-12";
      if (count === 2) return "col-lg-6 col-md-6 col-sm-12";
      return "col-lg-12 col-md-12 col-sm-12";
    }
    function renderPreview(data, elements) {
      if (!data || !elements.visualSection || !elements.preview) return;

      if (data.html) {
        elements.preview.innerHTML = String(data.html);
      } else {
        var sections = Array.isArray(data.sections)
          ? data.sections.filter(function (section) {
              return (
                section &&
                (section.title ||
                  (Array.isArray(section.images) && section.images.length))
              );
            })
          : [];
        if (!sections.length) return;
        elements.preview.innerHTML = sections
          .map(function (section) {
            var columnClass = previewColumnClass(section.columns);
            var images = Array.isArray(section.images) ? section.images : [];
            var imageMarkup = images
              .map(function (image) {
                var size = image.size
                  ? ' data-preview-size="' + project.strip(image.size) + '"'
                  : "";
                var src = assetPath(image.src || "");
                return src
                  ? '<div class="' +
                      columnClass +
                      '"><img class="responsive"' +
                      size +
                      ' src="' +
                      src +
                      '" alt="' +
                      project.strip(image.alt || "") +
                      '"></div>'
                  : "";
              })
              .join("");
            return (
              '<div class="container">' +
              (section.title ? "<h2>" + section.title + "</h2>" : "") +
              (imageMarkup
                ? '<div class="row">' + imageMarkup + "</div>"
                : "") +
              "</div>"
            );
          })
          .join("");
      }

      elements.preview
        .querySelectorAll("script,style,link,header,nav,footer")
        .forEach(function (element) {
          element.remove();
        });
      if (
        !elements.preview.textContent.trim() &&
        !elements.preview.querySelector("img")
      )
        return;
      elements.visualSection.hidden = false;
    }
    function renderProject() {
      var elements = getProjectElements();
      if (!elements.hero || !elements.context)
        throw new Error("Project template is incomplete");

      return project.loadProjects().then(function (result) {
        var posts = result.posts || [];
        var buildData = result.build || {};
        var requested =
          new URLSearchParams(location.search).get("post") || "23";
        var item = posts.find(function (candidate) {
          return String(candidate.legacyId) === String(requested);
        });
        if (!item) throw new Error("Requested project is unavailable");

        var id = String(item.legacyId);
        var caseStudy =
          item.caseStudy ||
          (buildData.caseStudies && buildData.caseStudies[id]) ||
          null;
        var structure =
          item.structure ||
          (buildData.structures && buildData.structures[id]) ||
          null;
        var preview =
          item.preview ||
          (buildData.previews && buildData.previews[id]) ||
          null;

        target.dataset.projectId = id;
        renderProjectNav(item, posts, elements);
        renderHero(item, elements);
        renderContext(item, elements);
        renderUX(caseStudy, elements);
        renderWorkflow(caseStudy, elements);
        renderSystem(caseStudy, elements);
        renderStructure(structure, elements);
        renderDeliverables(caseStudy, elements);
        renderPreview(preview, elements);

        if (window.initBuildMotion) window.initBuildMotion(document);
      });
    }

    loadTemplate(target)
      .then(renderProject)
      .catch(function (error) {
        console.error("Project render error:", error);
        target.innerHTML =
          '<p class="status">Project data could not be loaded.</p>';
      });
  };

  pages.exhibits = function () {
    var allExhibitions = [];
    var currentExhibitionIndex = 0;
    var perPage = 5;
    var cacheKey = "exhibitions_cache_v2";
    var cacheTimeKey = "exhibitions_cache_time_v2";
    var cacheDuration = 1000 * 60 * 10;

    function normalizeText(value) {
      if (Array.isArray(value))
        return value
          .filter(function (item) {
            return item !== null && item !== undefined;
          })
          .join(" ")
          .trim();
      return value === null || value === undefined ? "" : String(value).trim();
    }
    function normalizeKey(value) {
      return String(value || "")
        .replace(/[\s_-]/g, "")
        .toLowerCase();
    }
    function escapeHTML(value) {
      return String(value === null || value === undefined ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    function isValidWebsiteURL(value) {
      if (!value) return false;
      try {
        var url = new URL(String(value).trim());
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (error) {
        return false;
      }
    }
    function getField(item) {
      var wanted = Array.prototype.slice.call(arguments, 1).map(normalizeKey);
      var sources = [item || {}, (item && item.misc) || {}];
      for (var s = 0; s < sources.length; s++)
        for (var key in sources[s])
          if (Object.prototype.hasOwnProperty.call(sources[s], key)) {
            var value = normalizeText(sources[s][key]);
            if (wanted.indexOf(normalizeKey(key)) !== -1 && value) return value;
          }
      return "";
    }
    function extractImages(item) {
      var files = Array.isArray(item && item.files)
          ? item.files
          : item && item.files
            ? [item.files]
            : [],
        urls = [];
      files.forEach(function (fileEntry) {
        if (!fileEntry) return;
        var text =
          typeof fileEntry === "string" ? fileEntry : JSON.stringify(fileEntry);
        text
          .split(/\r?\n/)
          .map(function (line) {
            return line.trim();
          })
          .filter(function (line) {
            return line.startsWith("http://") || line.startsWith("https://");
          })
          .forEach(function (url) {
            urls.push(url);
          });
      });
      return Array.from(new Set(urls));
    }
    function extractImageCaptions(item) {
      var captions = getField(
        item,
        "imagecaptions",
        "image captions",
        "captions",
      );
      return captions
        ? captions
            .split("|")
            .map(function (caption) {
              return caption.trim();
            })
            .filter(Boolean)
        : [];
    }
    function formatPipeSeparatedValue(value) {
      return value
        ? value
            .split("|")
            .map(function (part) {
              return part.trim();
            })
            .filter(Boolean)
            .map(function (part) {
              return (
                '<span class="exhibition-work-item">' +
                escapeHTML(part) +
                "</span>"
              );
            })
            .join("")
        : "";
    }
    function createDetailRow(label, value, options) {
      if (!value) return "";
      var displayed =
        options && options.pipeSeparated
          ? '<div class="exhibition-work-list">' +
            formatPipeSeparatedValue(value) +
            "</div>"
          : "<span>" + escapeHTML(value) + "</span>";
      return (
        "<li><strong>" + escapeHTML(label) + "</strong>" + displayed + "</li>"
      );
    }
    function makeDetailRows(item) {
      var rows = [
        createDetailRow(
          "Venue",
          getField(item, "venue", "gallery", "institution"),
        ),
        createDetailRow(
          "Location",
          getField(item, "location", "city", "address"),
        ),
        createDetailRow("Dates", getField(item, "dates", "exhibitiondates")),
        createDetailRow(
          "Reception",
          getField(
            item,
            "reception",
            "receptiondate",
            "opening",
            "openingreception",
          ),
        ),
        createDetailRow(
          "Organizer",
          getField(item, "organizer", "organization", "presentedby"),
        ),
        createDetailRow(
          "Works",
          getField(item, "works", "artworks", "pieces", "worksshown"),
          { pipeSeparated: true },
        ),
        createDetailRow("Award", getField(item, "award", "recognition")),
      ].filter(Boolean);
      return rows.length
        ? '<ul class="exhibition-details">' + rows.join("") + "</ul>"
        : "";
    }
    function makeCarousel(item, index) {
      var images = extractImages(item),
        captions = extractImageCaptions(item),
        title = getField(item, "title") || "Exhibition",
        carouselId = "exhibition-carousel-" + index;
      if (!images.length)
        return '<div class="exhibition-placeholder">Images forthcoming</div>';
      var indicators =
        images.length > 1
          ? '<div class="carousel-indicators">' +
            images
              .map(function (image, i) {
                return (
                  '<button type="button" data-bs-target="#' +
                  carouselId +
                  '" data-bs-slide-to="' +
                  i +
                  '" class="' +
                  (i === 0 ? "active" : "") +
                  '" aria-current="' +
                  (i === 0 ? "true" : "false") +
                  '" aria-label="Image ' +
                  (i + 1) +
                  '"></button>'
                );
              })
              .join("") +
            "</div>"
          : "";
      var slides = images
        .map(function (src, i) {
          var caption = captions[i] || "";
          return (
            '<div class="carousel-item ' +
            (i === 0 ? "active" : "") +
            '"><img src="' +
            escapeHTML(src) +
            '" class="d-block w-100" loading="lazy" alt="' +
            escapeHTML(title) +
            " image " +
            (i + 1) +
            '" onerror="handleExhibitionImageError(this)">' +
            (caption
              ? '<div class="carousel-caption d-none d-md-block"><p>' +
                escapeHTML(caption) +
                "</p></div>"
              : "") +
            "</div>"
          );
        })
        .join("");
      var controls =
        images.length > 1
          ? '<button class="carousel-control-prev" type="button" data-bs-target="#' +
            carouselId +
            '" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#' +
            carouselId +
            '" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>'
          : "";
      return (
        '<div id="' +
        carouselId +
        '" class="carousel slide exhibition-carousel" data-bs-ride="false">' +
        indicators +
        '<div class="carousel-inner">' +
        slides +
        "</div>" +
        controls +
        "</div>"
      );
    }
    function handleExhibitionImageError(imageElement) {
      var slide = imageElement.closest(".carousel-item");
      if (!slide) {
        imageElement.style.display = "none";
        return;
      }
      slide.innerHTML =
        '<div class="exhibition-placeholder">Image unavailable</div>';
    }
    window.handleExhibitionImageError = handleExhibitionImageError;
    function renderExhibition(item, index) {
      var title = getField(item, "title") || "Untitled Exhibition";
      var description = getField(
        item,
        "description",
        "exhibitdescription",
        "summary",
      );
      var media = getField(item, "media", "medium", "category");
      var status = getField(item, "status", "exhibitstatus") || "Exhibition";
      var officialLink = getField(
        item,
        "link",
        "url",
        "website",
        "officiallink",
      );
      var imageColumn =
        '<div class="col-lg-6 p-0">' + makeCarousel(item, index) + "</div>";
      var copyColumn =
        '<div class="col-lg-6 d-flex align-items-center"><div class="exhibition-copy"><span class="exhibition-status">' +
        escapeHTML(status) +
        '</span><h2 class="exhibition-title">' +
        escapeHTML(title) +
        "</h2>" +
        (media
          ? '<div class="exhibition-media">' + escapeHTML(media) + "</div>"
          : "") +
        (description
          ? '<div class="exhibition-description">' +
            escapeHTML(description) +
            "</div>"
          : "") +
        makeDetailRows(item) +
        (isValidWebsiteURL(officialLink)
          ? '<a class="exhibition-link" href="' +
            escapeHTML(officialLink) +
            '" target="_blank" rel="noopener noreferrer">Exhibition Details</a>'
          : "") +
        "</div></div>";
      return (
        '<article class="exhibition-card" data-exhibition-id="' +
        escapeHTML((item && item.id) || "") +
        '"><div class="row g-0">' +
        (index % 2 === 1
          ? copyColumn + imageColumn
          : imageColumn + copyColumn) +
        "</div></article>"
      );
    }
    function getArchive() {
      var request;

      if (
        window.SiteArchiveData &&
        typeof window.SiteArchiveData.get === "function"
      ) {
        request = window.SiteArchiveData.get();
      } else {
        request = fetch(ENDPOINT).then(function (response) {
          if (!response.ok) {
            throw new Error("Archive unavailable");
          }

          return response.json();
        });
      }

      return request.then(function (data) {
        if (!Array.isArray(data)) {
          throw new Error("Invalid archive data");
        }

        return data.map(function (item) {
          return {
            id: item.id,
            type: String(item.type || "")
              .trim()
              .toLowerCase(),

            title: String(item.title || "").trim(),

            media: String(item.media || item.medium || "").trim(),

            dimensions: String(item.dimensions || item.size || "").trim(),

            // year: String(item.year || item.date || "").trim(),

            status: String(item.status || item.availability || "").trim(),

            description: String(item.description || "").trim(),

            files: item.files || [],
          };
        });
      });
    }
    function renderMore() {
      var list = document.getElementById("exhibition-list"),
        button = document.getElementById("loadMoreExhibitions");
      if (!list) return;
      var next = allExhibitions.slice(
          currentExhibitionIndex,
          currentExhibitionIndex + perPage,
        ),
        html = "";
      next.forEach(function (item, localIndex) {
        html += renderExhibition(item, currentExhibitionIndex + localIndex);
      });
      list.insertAdjacentHTML("beforeend", html);
      currentExhibitionIndex += next.length;
      if (button)
        button.style.display =
          currentExhibitionIndex < allExhibitions.length
            ? "inline-block"
            : "none";
    }
    function initiate() {
      var list = document.getElementById("exhibition-list"),
        button = document.getElementById("loadMoreExhibitions");
      if (!list) return;
      getArchive()
        .then(function (archive) {
          allExhibitions = archive
            .filter(function (item) {
              return (
                normalizeText(item && item.type).toLowerCase() === "exhibit"
              );
            })
            .sort(function (a, b) {
              return Number((b && b.id) || 0) - Number((a && a.id) || 0);
            });
          list.innerHTML = "";
          currentExhibitionIndex = 0;
          if (!allExhibitions.length) {
            list.innerHTML =
              '<div class="exhibition-empty">No exhibition records are published yet.</div>';
            if (button) button.style.display = "none";
            return;
          }
          renderMore();
        })
        .catch(function (error) {
          console.error("Exhibition load error:", error);
          list.innerHTML =
            '<div class="exhibition-error">The exhibition archive could not be loaded. Please return shortly.</div>';
          if (button) button.style.display = "none";
        });
      if (button) button.addEventListener("click", renderMore);
    }
    initiate();
  };

  pages.progress = function () {
    var allChronicles = [];
    var currentIndex = 0;
    var pageSize = 4;
    function extractFileUrl(fileEntry) {
      if (!fileEntry || typeof fileEntry !== "string") return null;
      var parts = fileEntry.split("\n");
      if (parts.length >= 3 && parts[2] && parts[2].startsWith("http"))
        return parts[2].trim();
      for (var i = parts.length - 1; i >= 0; i--)
        if (parts[i].startsWith("http")) return parts[i].trim();
      return null;
    }
    function renderImage(file) {
      var url = extractFileUrl(file) || "https://via.placeholder.com/600";
      return (
        '<img src="' +
        url +
        '" style="width:100%; height:100%; object-fit:cover;" loading="lazy">'
      );
    }
    function renderChronicles() {
      var container = document.getElementById("chronicle-container");
      if (!container) return;
      var nextItems = allChronicles.slice(
          currentIndex,
          currentIndex + pageSize,
        ),
        html = "";
      nextItems.forEach(function (item, i) {
        var globalIndex = currentIndex + i,
          isEven = globalIndex % 2 === 0;
        var description =
          (item.misc && item.misc.Description) ||
          (Array.isArray(item.description)
            ? item.description.join("<br>")
            : item.description || "");
        var categories = item.misc && item.misc.categories;
        var categoryDisplay = Array.isArray(categories)
          ? categories.join(" ")
          : categories || "";
        var mediaHTML = renderImage(item.files && item.files[0]);
        var text =
          '<div class="col-md-6 ' +
          (isEven ? "pr-md-5" : "pl-md-5") +
          '"><span class="node-step">' +
          (categoryDisplay || "Study") +
          '</span><h3 class="node-title chronicle-title">' +
          (item.title || "") +
          '</h3><div class="node-text chronicle-desc">' +
          description +
          '</div><div class="chronicle-meta mt-3"><span>' +
          (item.author || "") +
          "</span><span>" +
          ((item.misc && item.misc.postdate) || item.date || "") +
          "</span></div></div>";
        var media =
          '<div class="col-md-6 ' +
          (isEven ? "pl-md-5" : "pr-md-5") +
          '"><div class="node-image-frame">' +
          mediaHTML +
          "</div></div>";
        html +=
          '<div class="process-chronicals-node chronicle-node" data-index="' +
          globalIndex +
          '"><div class="row align-items-center">' +
          (isEven ? text + media : media + text) +
          "</div></div>";
      });
      container.insertAdjacentHTML("beforeend", html);
      currentIndex += pageSize;
      var button = document.getElementById("loadMoreBtn");
      if (button && currentIndex >= allChronicles.length)
        button.style.display = "none";
    }
    function initiate() {
      var container = document.getElementById("chronicle-container"),
        dump = document.getElementById("raw-data-log"),
        loading = document.getElementById("loadingMessage");
      fetch(SCRIPT_URL + "?t=" + Date.now())
        .then(function (response) {
          return response.json();
        })
        .then(function (satchel) {
          if (!Array.isArray(satchel))
            throw new Error("Invalid response format");
          if (dump) {
            dump.style.display = "none";
            dump.textContent = JSON.stringify(satchel, null, 2);
          }
          console.log(satchel);
          allChronicles = satchel
            .filter(function (item) {
              return String(item.type).trim().toLowerCase() === "progress";
            })
            .sort(function (a, b) {
              return Number(a.id) - Number(b.id);
            });
          container.innerHTML = "";
          currentIndex = 0;
          renderChronicles();
          if (loading) loading.style.display = "none";
        })
        .catch(function (error) {
          console.error("Chronicle load error:", error);
          if (container)
            container.innerHTML =
              '<p style="color:red;">' + error.message + "</p>";
          if (loading) {
            loading.innerText = "Archive failed to load.";
            loading.style.color = "red";
          }
        });
      var button = document.getElementById("loadMoreBtn");
      if (button) button.addEventListener("click", renderChronicles);
    }
    initiate();
  };

  var definitions = [
    {
      name: "index",
      marker: "useBlackFallback",
      test: function () {
        return document.body && document.body.id === "index";
      },
    },
    {
      name: "finearts",
      marker: "The winds are weak. Staying the process-video motion.",
      test: function () {
        return document.body && document.body.id === "arts";
      },
    },
    {
      name: "about",
      marker: "active-node",
      test: function () {
        return document.body && document.body.id === "arts about";
      },
    },
    {
      name: "exhibits",
      marker: "EXHIBITION_SCRIPT_URL",
      test: function () {
        return document.body && document.body.id === "arts exhibit";
      },
    },
    {
      name: "progress",
      marker: "CHRONICLE SCRIBE v7.1",
      test: function () {
        return document.body && document.body.id === "arts chronicals";
      },
    },
    {
      name: "resume",
      marker: "saveResumePdf",
      test: function () {
        return document.body && document.body.id === "work resume";
      },
    },
    {
      name: "work",
      marker: "featuredIds",
      test: function () {
        return (
          document.body &&
          document.body.id === "work" &&
          document.getElementById("featuredProjects")
        );
      },
    },
    {
      name: "project",
      marker: null,
      test: function () {
        return (
          document.body &&
          document.body.id === "work" &&
          document.getElementById("projectContent")
        );
      },
    },
  ];

  function currentDefinition() {
    return (
      definitions.find(function (definition) {
        return definition.test();
      }) || null
    );
  }
  function initCurrent(options) {
    var definition = currentDefinition();
    if (!definition || typeof pages[definition.name] !== "function") return;
    var force = !!(options && options.force);
    if (!force && inlineContains(definition.marker)) return;
    var key = "sdInlinePage" + definition.name;
    if (!force && document.documentElement.dataset[key] === "1") return;
    document.documentElement.dataset[key] = "1";
    pages[definition.name]();
  }

  window.initBuildInlinePage = initCurrent;
  runWhenReady(function () {
    initCurrent();
  });
})();
