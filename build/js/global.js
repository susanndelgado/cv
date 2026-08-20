/* ========================================================================
   BUILD SITE JAVASCRIPT

   MAP
   1. Shared helpers
   2. Technical Work interactions: cursor + project lightbox
   3. Fine Arts gallery renderer
   4. Fine Arts About page motion
   5. Shared Technical project data
   6. Technical Work archive
   7. Project detail pages
   8. Exhibitions archive
   9. Progress Chronicles archive
   10. Resume print action
   11. Page initialization

   This file intentionally contains only behavior used by the current /build
   pages. Legacy header normalization, iframe preview code, index-page code and
   old inline-script compatibility code were removed because the current build
   does not use them.
   ======================================================================== */
(function () {
  "use strict";

  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec";

  /* ======================================================================
     1. SHARED HELPERS
     ====================================================================== */

  function runWhenReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function escapeHTML(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function textValue(value) {
    if (Array.isArray(value)) {
      return value
        .filter(function (item) {
          return item !== null && item !== undefined;
        })
        .join(" ")
        .trim();
    }
    return value === null || value === undefined ? "" : String(value).trim();
  }

  function normalizeKey(value) {
    return String(value || "")
      .replace(/[\s_-]/g, "")
      .toLowerCase();
  }

  /* Reads a field even when archive data stores it in misc or uses a
     slightly different spelling/casing. */
  function getField(item) {
    var wanted = Array.prototype.slice.call(arguments, 1).map(normalizeKey);
    var sources = [item || {}, (item && item.misc) || {}];

    for (var s = 0; s < sources.length; s++) {
      var source = sources[s];
      for (var key in source) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
        if (wanted.indexOf(normalizeKey(key)) === -1) continue;
        var value = textValue(source[key]);
        if (value) return value;
      }
    }
    return "";
  }

  /* Google Apps Script file fields can contain metadata on multiple lines.
     This returns every actual http/https URL found in those entries. */
  function extractFileUrls(filesValue) {
    var files = Array.isArray(filesValue)
      ? filesValue
      : filesValue
        ? [filesValue]
        : [];
    var urls = [];

    files.forEach(function (entry) {
      if (!entry) return;
      var raw = typeof entry === "string" ? entry : JSON.stringify(entry);
      raw
        .split(/\r?\n/)
        .map(function (line) {
          return line.trim();
        })
        .filter(function (line) {
          return /^https?:\/\//i.test(line);
        })
        .forEach(function (url) {
          urls.push(url);
        });
    });

    return Array.from(new Set(urls));
  }

  function assetPath(value) {
    var path = String(value || "").trim();
    if (!path) return "";
    if (/^(?:https?:)?\/\//i.test(path) || path.charAt(0) === "/") return path;
    return "/" + path;
  }

  /* ======================================================================
     2. TECHNICAL WORK INTERACTIONS
     Custom cursor and project-image lightbox. These run only on body#work.
     ====================================================================== */

  function ensureInteractionStylesheet() {
    if (document.getElementById("sd-interactions-css")) return;
    var link = document.createElement("link");
    link.id = "sd-interactions-css";
    link.rel = "stylesheet";
    link.href = "/css/interactions.css";
    document.head.appendChild(link);
  }

  function initTechnicalCursor() {
    if (!document.body || document.body.id !== "work") return;
    if (!window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer:fine) and (hover:hover)").matches) return;
    if (document.querySelector(".sd-cursor")) return;

    var cursor = document.createElement("div");
    cursor.className = "sd-cursor";
    document.body.appendChild(cursor);
    document.documentElement.classList.add("sd-cursor-enabled");

    var lastMode = "";

    function setMode(target) {
      var imageTarget =
        target &&
        target.closest &&
        target.closest(
          ".project-image,.case-visual img,#projectPreview img,.preview-stack a",
        );
      var linkTarget =
        target && target.closest && target.closest('a,button,[role="button"]');
      var mode = imageTarget ? "image" : linkTarget ? "link" : "";

      if (mode === lastMode) return;
      lastMode = mode;
      document.documentElement.classList.toggle(
        "sd-cursor-image",
        mode === "image",
      );
      document.documentElement.classList.toggle(
        "sd-cursor-link",
        mode === "link",
      );
    }

    document.addEventListener(
      "pointermove",
      function (event) {
        cursor.style.transform =
          "translate3d(" +
          event.clientX +
          "px," +
          event.clientY +
          "px,0) translate(-50%,-50%)";
        document.documentElement.classList.add("sd-cursor-live");
        setMode(event.target);
      },
      { passive: true },
    );

    function hideCursor() {
      document.documentElement.classList.remove(
        "sd-cursor-live",
        "sd-cursor-link",
        "sd-cursor-image",
      );
      lastMode = "";
    }

    document.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);
  }

  function initProjectLightbox() {
    if (!document.body || document.body.id !== "work") return;
    if (!document.getElementById("projectContent")) return;

    var currentTrigger = null;

    function ensureLightbox() {
      var box = document.querySelector(".sd-lightbox");
      if (box) return box;

      box = document.createElement("div");
      box.className = "sd-lightbox";
      box.hidden = true;
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Expanded project image");
      box.innerHTML =
        '<div class="sd-lightbox-inner"><button class="sd-lightbox-close" type="button" aria-label="Close expanded image">×</button><img alt=""><p class="sd-lightbox-caption"></p></div>';
      document.body.appendChild(box);
      return box;
    }

    function closeLightbox() {
      var box = document.querySelector(".sd-lightbox");
      if (!box || box.hidden) return;
      box.hidden = true;
      document.documentElement.classList.remove("sd-lightbox-open");
      box.querySelector("img").removeAttribute("src");
      if (currentTrigger && document.contains(currentTrigger)) {
        currentTrigger.focus({ preventScroll: true });
      }
      currentTrigger = null;
    }

    function openLightbox(image) {
      var box = ensureLightbox();
      var expanded = box.querySelector("img");
      var caption = box.querySelector(".sd-lightbox-caption");

      currentTrigger = image;
      expanded.src = image.currentSrc || image.src;
      expanded.alt = image.alt || "Expanded project image";
      caption.textContent = image.alt || "";
      caption.hidden = !caption.textContent;
      box.hidden = false;
      document.documentElement.classList.add("sd-lightbox-open");
      box.querySelector(".sd-lightbox-close").focus({ preventScroll: true });
    }

    /* Called after project content changes so images are keyboard accessible.
       Click/keydown handling is delegated below, so no per-image listeners are
       required. */
    function prepareProjectImages(root) {
      (root || document)
        .querySelectorAll(".case-visual img,#projectPreview img")
        .forEach(function (image) {
          image.setAttribute("role", "button");
          image.setAttribute("tabindex", "0");
          image.setAttribute(
            "aria-label",
            (image.alt || "Project image") + " — open larger",
          );
        });
    }

    document.addEventListener("click", function (event) {
      var close = event.target.closest(".sd-lightbox-close");
      var box = event.target.closest(".sd-lightbox");
      if (close || (box && event.target === box)) {
        closeLightbox();
        return;
      }

      var image = event.target.closest(
        "#projectContent .case-visual img,#projectContent #projectPreview img",
      );
      if (!image) return;
      event.preventDefault();
      openLightbox(image);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      var image = event.target.closest(
        "#projectContent .case-visual img,#projectContent #projectPreview img",
      );
      if (!image) return;
      event.preventDefault();
      openLightbox(image);
    });

    window.ProjectImageUI = {
      prepare: prepareProjectImages,
    };
  }

  function initTechnicalInteractions() {
    if (!document.body || document.body.id !== "work") return;
    ensureInteractionStylesheet();
    initTechnicalCursor();
    initProjectLightbox();
  }

  /* ======================================================================
     3. FINE ARTS GALLERY RENDERER
     Loads gallery records from the shared archive and opens works in the
     gallery lightbox already present in the gallery HTML.
     ====================================================================== */

  function initFineArtsGallery() {
    var grid = document.getElementById("artGalleryGrid");
    if (!grid) return;

    var body = document.body;
    var type = (body.getAttribute("data-gallery-type") || "").toLowerCase();
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
      !lightbox ||
      !lightboxImage ||
      !lightboxTitle ||
      !lightboxMeta ||
      !lightboxDescription ||
      !close
    ) {
      return;
    }

    function getArchive() {
      if (
        window.SiteArchiveData &&
        typeof window.SiteArchiveData.get === "function"
      ) {
        return window.SiteArchiveData.get();
      }
      return fetch(SCRIPT_URL).then(function (response) {
        if (!response.ok) throw new Error("Archive unavailable");
        return response.json();
      });
    }

    function makeCard(item, index) {
      var urls = extractFileUrls(item && item.files);
      var src = urls[0] || "";
      var title = getField(item, "title") || "Untitled";
      var media = getField(item, "media", "medium") || "Masterwork";
      var dimensions = getField(item, "dimensions", "size");
      var year = getField(item, "year", "date");
      var availability = getField(item, "status", "availability");
      var description = textValue(item && item.description);
      var meta = [media, dimensions, year, availability]
        .filter(Boolean)
        .join(" · ");

      var figure = document.createElement("figure");
      figure.className = "art-gallery-card";
      figure.innerHTML =
        '<button type="button" class="art-gallery-open" data-index="' +
        index +
        '" aria-label="View ' +
        escapeHTML(title) +
        ' larger"><span class="art-gallery-media-stage">' +
        (src
          ? '<img src="' +
            escapeHTML(src) +
            '" alt="' +
            escapeHTML(title) +
            '" loading="lazy">'
          : '<span class="art-gallery-image-missing">Image forthcoming</span>') +
        "</span></button>" +
        '<figcaption class="art-gallery-caption"><h2>' +
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
            return String((item && item.type) || "")
              .trim()
              .toLowerCase() === type;
          })
          .sort(function (a, b) {
            return Number((a && a.id) || 0) - Number((b && b.id) || 0);
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
      })
      .catch(function () {
        if (status) {
          status.textContent = "The gallery archive could not be loaded.";
        }
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

    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  /* ======================================================================
     4. FINE ARTS ABOUT PAGE MOTION
     Adds reveal classes when process sections enter the viewport and avoids
     autoplaying process videos on slow/save-data connections.
     ====================================================================== */

  function initAboutPage() {
    if (!document.body || document.body.id !== "arts about") return;

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

    var connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    document.querySelectorAll(".process-video").forEach(function (video) {
      video.muted = true;
      if (!connection) return;
      if (
        connection.saveData ||
        ["slow-2g", "2g", "3g"].indexOf(connection.effectiveType) !== -1
      ) {
        video.pause();
        video.autoplay = false;
      } else {
        video.play().catch(function () {});
      }
    });
  }

  /* ======================================================================
     5. SHARED TECHNICAL PROJECT DATA
     Merges the legacy project JSON files with build/js/casestudies.json.
     ====================================================================== */

  var confirmedAngularPosts = new Set(["14", "18", "44", "45"]);
  var unverifiedAngularPosts = new Set(["16", "39"]);

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

    function yearNumber(value) {
      var match = String(value || "").match(/\d{4}/);
      return match ? parseInt(match[0], 10) : 0;
    }

    function contains(item, token) {
      return (
        (" " + String(item.filters || "") + " ").indexOf(
          " " + token + " ",
        ) !== -1
      );
    }

    function isCrfRelated(item) {
      return /Cardiovascular Research Foundation|\bCRF\b/i.test(
        [item.client, item.role, strip(item.content), item.summary].join(" "),
      );
    }

    /* Normalizes skill labels once while loading data instead of repeatedly
       patching cards after they have rendered. */
    function normalizeProject(item) {
      var next = Object.assign({}, item);
      var id = String(next.legacyId || next.id || "");
      var skills = lines(next.skills).map(function (skill) {
        return /^AngularJS$/i.test(skill) ? "Angular" : skill;
      });

      skills = skills.filter(function (skill) {
        return !/^(Rapha[eë]l(?:\.js)?|TweenLite|Animate\.css)$/i.test(skill);
      });

      if (confirmedAngularPosts.has(id)) {
        if (
          !skills.some(function (skill) {
            return /^Angular$/i.test(skill);
          })
        ) {
          skills.push("Angular");
        }
      }

      if (unverifiedAngularPosts.has(id)) {
        skills = skills.filter(function (skill) {
          return !/^Angular(?:JS)?$/i.test(skill);
        });
      }

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
      ) {
        skills.push("Salesforce Pardot");
      }

      next.skills = Array.from(new Set(skills)).join("<br>");
      return next;
    }

    function merge(base, extras) {
      var result = (base || []).map(function (item) {
        return Object.assign({}, item, { legacyId: String(item.id) });
      });

      (extras || []).forEach(function (extra) {
        var overrides = (extra && extra.overrides) || {};

        result = result.map(function (item) {
          var override =
            overrides[String(item.legacyId)] ||
            overrides[String(item.id)] ||
            {};
          return Object.assign({}, item, override, {
            legacyId: String(item.legacyId),
          });
        });

        ((extra && extra.posts) || []).forEach(function (item) {
          var id = String(item.id);
          var index = result.findIndex(function (candidate) {
            return String(candidate.legacyId) === id;
          });
          var next = Object.assign({}, item, { legacyId: id });

          if (index >= 0) {
            result[index] = Object.assign({}, result[index], next);
          } else {
            result.push(next);
          }
        });
      });

      return result
        .filter(function (item) {
          return !item.hidden && String(item.legacyId) !== "11";
        })
        .map(normalizeProject)
        .sort(function (a, b) {
          return (
            yearNumber(b.year) - yearNumber(a.year) ||
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
        };
      });
    }

    return {
      strip: strip,
      lines: lines,
      key: key,
      loadProjects: loadProjects,
    };
  }

  var project = projectHelpers();

  /* ======================================================================
     6. TECHNICAL WORK ARCHIVE
     Builds featured/archive cards and applies category/skill filters.
     ====================================================================== */

  function initWorkPage() {
    var featured = document.getElementById("featuredProjects");
    var archive = document.getElementById("projectArchive");
    var filterStatus = document.getElementById("archiveFilterStatus");
    var buttons = document.querySelectorAll(".filter");
    if (!featured || !archive || !filterStatus) return;

    var featuredIds = ["23", "22", "16", "1"];
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

    function projectUrl(item) {
      return "project.html?post=" + encodeURIComponent(item.legacyId);
    }

    function imagePath(item) {
      return assetPath(item.thumb || item.image || "");
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
        projectUrl(item) +
        '"><img src="' +
        imagePath(item) +
        '" alt="' +
        escapeHTML(project.strip(item.title)) +
        '" loading="lazy"></a><div class="project-copy"><p class="project-meta">' +
        escapeHTML(meta) +
        '</p><h3><a href="' +
        projectUrl(item) +
        '">' +
        escapeHTML(project.strip(item.title)) +
        "</a></h3><p>" +
        escapeHTML(project.strip(item.summary || "Professional project.")) +
        '</p><div class="project-role">' +
        escapeHTML(project.strip(item.role).replace(/\s+/g, " · ")) +
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
    }

    function cardMatches(node, type, skill) {
      if (
        type &&
        type !== "all" &&
        (" " + node.dataset.filters + " ").indexOf(" " + type + " ") === -1
      ) {
        return false;
      }

      if (
        skill &&
        String(node.dataset.skills || "")
          .split("||")
          .indexOf(project.key(skill)) === -1
      ) {
        return false;
      }

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
    }

    function setStatus(type, skill) {
      if (!type && !skill) {
        filterStatus.hidden = true;
        filterStatus.innerHTML = "";
        return;
      }

      var label = skill
        ? "Skill: <strong>" + escapeHTML(project.strip(skill)) + "</strong>"
        : "Category: <strong>" +
          escapeHTML(typeLabels[type] || project.strip(type)) +
          "</strong>";

      filterStatus.innerHTML =
        "Showing " +
        label +
        ' <a href="work.html#projectArchive" data-clear-filter>Clear filter</a>';
      filterStatus.hidden = false;
    }

    /* The animation is visual polish only. It is kept because it is currently
       working, but filtering still falls back to an instant state when motion
       is reduced or the Web Animations API is unavailable. */
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
            return !node.hidden && showing.indexOf(node) === -1;
          })
          .forEach(function (node) {
            var before = first.get(node);
            var after = last.get(node);
            if (!before || !after) return;

            var dx = before.left - after.left;
            var dy = before.top - after.top;
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
        var type = params.get("type");
        var skill = params.get("skill");

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
  }

  /* ======================================================================
     7. PROJECT DETAIL PAGES
     Loads the shared template, project data, case-study sections and preview.
     The old renderHero function is intentionally gone; renderProjectHeader
     creates only the title/meta/skills/image that are actually wanted.
     ====================================================================== */

  function initProjectPage() {
    var target = document.getElementById("projectContent");
    if (!target) return;

    function loadTemplate() {
      var url = target.getAttribute("data-template");
      if (!url) return Promise.reject(new Error("Project template unavailable"));

      return fetch(url)
        .then(function (response) {
          if (!response.ok) throw new Error("Project template unavailable");
          return response.text();
        })
        .then(function (html) {
          target.innerHTML = html;
        });
    }

    function projectUrl(item) {
      return "project.html?post=" + encodeURIComponent(item.legacyId);
    }

    function navMarkup(previous, next) {
      return (
        '<a class="case-nav-link previous" href="' +
        projectUrl(previous) +
        '"><span class="direction">← Previous</span><span class="project">' +
        escapeHTML(project.strip(previous.title)) +
        '</span></a><a class="case-nav-all" href="work.html#projectArchive">All work</a><a class="case-nav-link next" href="' +
        projectUrl(next) +
        '"><span class="direction">Next →</span><span class="project">' +
        escapeHTML(project.strip(next.title)) +
        "</span></a>"
      );
    }

    function getProjectElements() {
      return {
        header: document.getElementById("caseHero"),
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

    /* Previous / All Work / Next navigation. */
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

    /* Project title area. No summary and no Category pills are generated here. */
    function renderProjectHeader(item, elements) {
      var title = project.strip(item.title) || "Project";
      var role = project.lines(item.role).join(" · ");
      var kicker =
        [item.year, project.strip(item.client)].filter(Boolean).join(" · ") ||
        "Professional project";
      var image = assetPath(item.image || item.thumb || "");
      var skills = project.lines(item.skills);

      var skillsMarkup = skills.length
        ? '<div class="case-taxonomy"><div class="case-taxonomy-group"><span class="case-taxonomy-label">Skills</span><div class="pills">' +
          skills
            .map(function (skill) {
              return '<span class="pill">' + escapeHTML(skill) + "</span>";
            })
            .join("") +
          "</div></div></div>"
        : "";

      var visual = image
        ? '<div class="case-visual"><img src="' +
          image +
          '" alt="' +
          escapeHTML(title) +
          ' project preview"></div>'
        : "";

      document.title = title + " | Susan Delgado";
      elements.header.classList.remove("status");
      elements.header.innerHTML =
        '<div class="case-grid"><div><p class="kicker">' +
        escapeHTML(kicker) +
        '</p><h1 class="case-title">' +
        escapeHTML(title) +
        "</h1>" +
        skillsMarkup +
        '</div><dl class="case-meta"><div><dt>Client / company</dt><dd>' +
        escapeHTML(project.strip(item.client) || "Not recorded") +
        "</dd></div><div><dt>Role</dt><dd>" +
        escapeHTML(role || "Not recorded") +
        "</dd></div><div><dt>Year</dt><dd>" +
        escapeHTML(item.year || "Not recorded") +
        "</dd></div></dl></div>" +
        visual;

      if (window.ProjectImageUI) window.ProjectImageUI.prepare(elements.header);
    }

    /* Main written project context below the header. */
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
      ) {
        return;
      }

      if (elements.uxTitle) elements.uxTitle.textContent = ux.title || "";
      if (elements.uxIntro) elements.uxIntro.textContent = ux.intro || "";
      if (elements.uxPanels) {
        elements.uxPanels.innerHTML = panels
          .map(function (panel) {
            return (
              '<article class="panel"><h3>' +
              escapeHTML(panel.title) +
              "</h3><p>" +
              escapeHTML(panel.copy) +
              "</p></article>"
            );
          })
          .join("");
      }
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
      ) {
        return;
      }

      elements.workflowGrid.innerHTML = workflow
        .map(function (step) {
          return (
            '<article class="process-step"><span class="step">' +
            escapeHTML(step.label) +
            "</span><h3>" +
            escapeHTML(step.title) +
            "</h3><p>" +
            escapeHTML(step.copy) +
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
      ) {
        return;
      }

      if (elements.systemTitle) {
        elements.systemTitle.textContent = system.title || "Technical structure";
      }
      if (elements.systemIntro) elements.systemIntro.textContent = system.intro || "";
      if (elements.systemGrid) {
        elements.systemGrid.innerHTML = nodes
          .map(function (node) {
            return (
              '<article class="node"><h3>' +
              escapeHTML(node.title) +
              "</h3><p>" +
              escapeHTML(node.copy) +
              "</p></article>"
            );
          })
          .join("");
      }
      elements.systemSection.hidden = false;
    }

    function renderStructure(structure, elements) {
      var items =
        structure && Array.isArray(structure.items) ? structure.items : [];
      if (
        !items.length ||
        !elements.structureSection ||
        !elements.structureGrid
      ) {
        return;
      }

      if (elements.structureTitle) {
        elements.structureTitle.textContent = structure.title || "Website structure";
      }
      if (elements.structureIntro) {
        elements.structureIntro.textContent = structure.intro || "";
      }

      elements.structureGrid.innerHTML = items
        .map(function (item) {
          var children = (item.children || [])
            .map(function (child) {
              return "<li>" + escapeHTML(child) + "</li>";
            })
            .join("");
          return (
            '<article class="structure-node"><h3>' +
            escapeHTML(item.label) +
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
      ) {
        return;
      }

      elements.deliverableGrid.innerHTML = items
        .map(function (deliverable) {
          return (
            '<div class="deliverable"><strong>' +
            escapeHTML(deliverable.title) +
            "</strong><span>" +
            escapeHTML(deliverable.copy) +
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

    /* Old showcase fragments use paths such as img/example.jpg. Once inserted
       into project.html those must be normalized back to /showcase/img/.... */
    function normalizePreviewImagePaths(preview) {
      preview.querySelectorAll("img").forEach(function (image) {
        var src = (image.getAttribute("src") || "").trim();
        if (
          !src ||
          /^(?:https?:)?\/\//i.test(src) ||
          /^(?:data|blob):/i.test(src) ||
          src.charAt(0) === "/"
        ) {
          return;
        }

        src = src.replace(/^\.\//, "");
        if (src.indexOf("../showcase/") === 0) {
          src = src.replace(/^\.\.\//, "");
        }

        if (src.indexOf("showcase/") === 0) {
          src = "/" + src;
        } else if (src.indexOf("img/") === 0 || src.indexOf("thumbs/") === 0) {
          src = "/showcase/" + src;
        } else {
          src = "/" + src;
        }

        image.setAttribute("src", src);
      });
    }

    /* This is a legacy content correction that is still active: project 10's
       old preview fragment contains one unwanted photograph. It should
       eventually be removed from the source fragment instead of handled here. */
    function cleanWinterBallPreview(projectId, preview) {
      if (String(projectId) !== "10") return;

      var image = Array.prototype.find.call(
        preview.querySelectorAll("img"),
        function (candidate) {
          return (
            (candidate.getAttribute("src") || "").indexOf(
              "pcwp-winterball-photo-2018.jpg",
            ) !== -1
          );
        },
      );
      if (!image) return;

      var row = image.closest(".row");
      var column = image.closest('[class*="col-"]');
      if (column) column.remove();
      else image.remove();

      if (!row) return;
      var remaining = Array.prototype.slice
        .call(row.children)
        .filter(function (child) {
          return child.querySelector && child.querySelector("img");
        });
      if (remaining.length === 2) {
        remaining.forEach(function (child) {
          child.className = "col-lg-6 col-md-6 col-sm-12";
        });
      }
    }

    function renderPreview(data, projectId, elements) {
      if (!data || !elements.visualSection || !elements.preview) return false;

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

        if (!sections.length) return false;

        elements.preview.innerHTML = sections
          .map(function (section) {
            var columnClass = previewColumnClass(section.columns);
            var images = Array.isArray(section.images) ? section.images : [];
            var imageMarkup = images
              .map(function (image) {
                var src = assetPath(image.src || "");
                if (!src) return "";
                var size = image.size
                  ? ' data-preview-size="' +
                    escapeHTML(project.strip(image.size)) +
                    '"'
                  : "";
                return (
                  '<div class="' +
                  columnClass +
                  '"><img class="responsive"' +
                  size +
                  ' src="' +
                  src +
                  '" alt="' +
                  escapeHTML(project.strip(image.alt || "")) +
                  '"></div>'
                );
              })
              .join("");

            return (
              '<div class="container">' +
              (section.title
                ? "<h2>" + escapeHTML(section.title) + "</h2>"
                : "") +
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

      normalizePreviewImagePaths(elements.preview);
      cleanWinterBallPreview(projectId, elements.preview);

      if (
        !elements.preview.textContent.trim() &&
        !elements.preview.querySelector("img")
      ) {
        return false;
      }

      elements.visualSection.hidden = false;
      if (window.ProjectImageUI) window.ProjectImageUI.prepare(elements.preview);
      return true;
    }

    /* JSON-native previews take priority. Older projects fall back to the
       previewSources map in casestudies.json and load their preserved showcase
       fragment. There is deliberately no duplicated-hero fallback anymore. */
    function renderProjectPreview(preview, previewSource, projectId, elements) {
      if (preview && renderPreview(preview, projectId, elements)) {
        return Promise.resolve();
      }
      if (!previewSource) return Promise.resolve();

      return fetch(assetPath(previewSource))
        .then(function (response) {
          if (!response.ok) throw new Error("Project preview source unavailable");
          return response.text();
        })
        .then(function (html) {
          renderPreview({ html: html }, projectId, elements);
        })
        .catch(function (error) {
          console.error("Project preview load error:", error);
        });
    }

    /* Legacy project-specific UX copy. This is still used, but the content
       belongs in casestudies.json long-term rather than in JavaScript. */
    function applyFellowsUxFallback(projectId, caseStudy) {
      if (projectId !== "17" && projectId !== "21") return caseStudy;

      var next = Object.assign({}, caseStudy || {});
      next.ux = {
        title: "Selectable conference content component",
        intro:
          "The Fellows interface let visitors move between conference topics without leaving the page.",
        panels: [
          {
            title: "Coordinated content switching",
            copy:
              "Selecting an item updated both the featured image and the corresponding explanatory text in place.",
          },
          {
            title: "In-page topic navigation",
            copy:
              "The interaction kept the visual reference and related information paired while visitors moved between topics.",
          },
        ],
      };
      return next;
    }

    function renderProject() {
      var elements = getProjectElements();
      if (!elements.header || !elements.context) {
        throw new Error("Project template is incomplete");
      }

      return project.loadProjects().then(function (result) {
        var posts = result.posts || [];
        var buildData = result.build || {};
        var requested =
          new URLSearchParams(location.search).get("post") || "23";

        /* Project 11 is intentionally excluded from the current portfolio. */
        if (requested === "11") {
          location.replace("work.html#projectArchive");
          return;
        }

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
        var previewSource =
          buildData.previewSources && buildData.previewSources[id]
            ? buildData.previewSources[id]
            : "";

        caseStudy = applyFellowsUxFallback(id, caseStudy);
        target.dataset.projectId = id;

        renderProjectNav(item, posts, elements);
        renderProjectHeader(item, elements);
        renderContext(item, elements);
        renderUX(caseStudy, elements);
        renderWorkflow(caseStudy, elements);
        renderSystem(caseStudy, elements);
        renderStructure(structure, elements);
        renderDeliverables(caseStudy, elements);

        return renderProjectPreview(preview, previewSource, id, elements);
      });
    }

    loadTemplate()
      .then(renderProject)
      .catch(function (error) {
        console.error("Project render error:", error);
        target.innerHTML =
          '<p class="status">Project data could not be loaded.</p>';
      });
  }

  /* ======================================================================
     8. EXHIBITIONS ARCHIVE
     Builds exhibition cards and Bootstrap carousels from the archive data.
     ====================================================================== */

  function initExhibitionsPage() {
    var list = document.getElementById("exhibition-list");
    if (!list) return;

    var allExhibitions = [];
    var currentIndex = 0;
    var perPage = 5;
    var button = document.getElementById("loadMoreExhibitions");
    var cacheKey = "exhibitions_cache_v2";
    var cacheTimeKey = "exhibitions_cache_time_v2";
    var cacheDuration = 1000 * 60 * 10;

    function isValidWebsiteURL(value) {
      if (!value) return false;
      try {
        var url = new URL(String(value).trim());
        return url.protocol === "http:" || url.protocol === "https:";
      } catch (error) {
        return false;
      }
    }

    function imageCaptions(item) {
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

    function detailRow(label, value, options) {
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

    function detailRows(item) {
      var rows = [
        detailRow("Venue", getField(item, "venue", "gallery", "institution")),
        detailRow("Location", getField(item, "location", "city", "address")),
        detailRow("Dates", getField(item, "dates", "exhibitiondates")),
        detailRow(
          "Reception",
          getField(
            item,
            "reception",
            "receptiondate",
            "opening",
            "openingreception",
          ),
        ),
        detailRow(
          "Organizer",
          getField(item, "organizer", "organization", "presentedby"),
        ),
        detailRow(
          "Works",
          getField(item, "works", "artworks", "pieces", "worksshown"),
          { pipeSeparated: true },
        ),
        detailRow("Award", getField(item, "award", "recognition")),
      ].filter(Boolean);

      return rows.length
        ? '<ul class="exhibition-details">' + rows.join("") + "</ul>"
        : "";
    }

    function makeCarousel(item, index) {
      var images = extractFileUrls(item && item.files);
      var captions = imageCaptions(item);
      var title = getField(item, "title") || "Exhibition";
      var carouselId = "exhibition-carousel-" + index;

      if (!images.length) {
        return '<div class="exhibition-placeholder">Images forthcoming</div>';
      }

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
            '">' +
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
        detailRows(item) +
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
      var now = Date.now();
      var cached = localStorage.getItem(cacheKey);
      var cachedTime = Number(localStorage.getItem(cacheTimeKey));

      if (cached && cachedTime && now - cachedTime < cacheDuration) {
        try {
          return Promise.resolve(JSON.parse(cached));
        } catch (error) {
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(cacheTimeKey);
        }
      }

      return fetch(SCRIPT_URL + "?t=" + now)
        .then(function (response) {
          if (!response.ok) {
            throw new Error(
              "Archive request failed with status " + response.status + ".",
            );
          }
          return response.json();
        })
        .then(function (archive) {
          if (!Array.isArray(archive)) {
            throw new Error("The exhibition archive returned an invalid format.");
          }
          localStorage.setItem(cacheKey, JSON.stringify(archive));
          localStorage.setItem(cacheTimeKey, String(now));
          return archive;
        });
    }

    function renderMore() {
      var next = allExhibitions.slice(currentIndex, currentIndex + perPage);
      var html = "";

      next.forEach(function (item, localIndex) {
        html += renderExhibition(item, currentIndex + localIndex);
      });

      list.insertAdjacentHTML("beforeend", html);
      currentIndex += next.length;

      if (button) {
        button.style.display =
          currentIndex < allExhibitions.length ? "inline-block" : "none";
      }
    }

    /* The build page currently has no Load More button, so all exhibitions are
       rendered instead of silently stopping after the first five. */
    getArchive()
      .then(function (archive) {
        allExhibitions = archive
          .filter(function (item) {
            return textValue(item && item.type).toLowerCase() === "exhibit";
          })
          .sort(function (a, b) {
            return Number((b && b.id) || 0) - Number((a && a.id) || 0);
          });

        list.innerHTML = "";
        currentIndex = 0;

        if (!allExhibitions.length) {
          list.innerHTML =
            '<div class="exhibition-empty">No exhibition records are published yet.</div>';
          if (button) button.style.display = "none";
          return;
        }

        if (!button) perPage = allExhibitions.length;
        renderMore();
      })
      .catch(function (error) {
        console.error("Exhibition load error:", error);
        list.innerHTML =
          '<div class="exhibition-error">The exhibition archive could not be loaded. Please return shortly.</div>';
        if (button) button.style.display = "none";
      });

    if (button) button.addEventListener("click", renderMore);

    /* Replace broken carousel images without exporting a global error handler. */
    list.addEventListener(
      "error",
      function (event) {
        if (!event.target || event.target.tagName !== "IMG") return;
        var slide = event.target.closest(".carousel-item");
        if (slide) {
          slide.innerHTML =
            '<div class="exhibition-placeholder">Image unavailable</div>';
        } else {
          event.target.style.display = "none";
        }
      },
      true,
    );
  }

  /* ======================================================================
     9. PROGRESS CHRONICLES ARCHIVE
     Renders progress records in alternating image/text rows.
     ====================================================================== */

  function initProgressPage() {
    var container = document.getElementById("chronicle-container");
    if (!container) return;

    var allChronicles = [];
    var currentIndex = 0;
    var pageSize = 4;
    var button = document.getElementById("loadMoreBtn");
    var loading = document.getElementById("loadingMessage");

    function renderImage(fileEntry) {
      var urls = extractFileUrls(fileEntry);
      var url = urls[0] || "https://via.placeholder.com/600";
      return (
        '<img src="' +
        escapeHTML(url) +
        '" style="width:100%; height:100%; object-fit:cover;" loading="lazy" alt="">'
      );
    }

    function renderChronicles() {
      var nextItems = allChronicles.slice(currentIndex, currentIndex + pageSize);
      var html = "";

      nextItems.forEach(function (item, localIndex) {
        var globalIndex = currentIndex + localIndex;
        var isEven = globalIndex % 2 === 0;
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
          escapeHTML(categoryDisplay || "Study") +
          '</span><h3 class="node-title chronicle-title">' +
          escapeHTML(item.title || "") +
          '</h3><div class="node-text chronicle-desc">' +
          description +
          '</div><div class="chronicle-meta mt-3"><span>' +
          escapeHTML(item.author || "") +
          "</span><span>" +
          escapeHTML((item.misc && item.misc.postdate) || item.date || "") +
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
      currentIndex += nextItems.length;

      if (button && currentIndex >= allChronicles.length) {
        button.style.display = "none";
      }
    }

    fetch(SCRIPT_URL + "?t=" + Date.now())
      .then(function (response) {
        if (!response.ok) throw new Error("Archive request failed");
        return response.json();
      })
      .then(function (archive) {
        if (!Array.isArray(archive)) throw new Error("Invalid response format");

        /* The old raw-data JSON dump and console.log were debugging output and
           are intentionally not produced anymore. */
        allChronicles = archive
          .filter(function (item) {
            return String((item && item.type) || "")
              .trim()
              .toLowerCase() === "progress";
          })
          .sort(function (a, b) {
            return Number((a && a.id) || 0) - Number((b && b.id) || 0);
          });

        container.innerHTML = "";
        currentIndex = 0;
        renderChronicles();
        if (loading) loading.style.display = "none";
      })
      .catch(function (error) {
        console.error("Chronicle load error:", error);
        container.innerHTML =
          '<p style="color:red;">The progress archive could not be loaded.</p>';
        if (loading) {
          loading.textContent = "Archive failed to load.";
          loading.style.color = "red";
        }
      });

    if (button) button.addEventListener("click", renderChronicles);
  }

  /* ======================================================================
     10. RESUME PRINT ACTION
     The button opens the browser print dialog so the resume can be saved PDF.
     ====================================================================== */

  function initResumePage() {
    if (!document.getElementById("resume")) return;
    var button = document.getElementById("saveResumePdf");
    if (!button) return;
    button.addEventListener("click", function () {
      window.print();
    });
  }

  /* ======================================================================
     11. PAGE INITIALIZATION
     Every initializer checks for its own page DOM, so there is no legacy
     marker/force dispatcher and no duplicate inline-script compatibility layer.
     ====================================================================== */

  runWhenReady(function () {
    initTechnicalInteractions();
    initFineArtsGallery();
    initAboutPage();
    initWorkPage();
    initProjectPage();
    initExhibitionsPage();
    initProgressPage();
    initResumePage();
  });
})();