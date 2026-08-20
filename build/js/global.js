/* ========================================================= 
    SUSAN DELGADO SUMMER 2026
    FUNCTION GUIDE
   =========================================================
 */
(function () {
  "use strict";

  var ENDPOINT =
    "https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec";

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
  function makeCard(item, index) {
    var src = imageURL(item);
    var title = field(item, "title") || "Untitled";
    var media = field(item, "media", "medium") || "Artwork";
    var dimensions = field(item, "dimensions", "size");
    var year = field(item, "year", "date");
    var status = field(item, "status", "availability");
    var description = field(item, "description") || "";
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
      return fetch("/build/js/casestudies.json")
        .then(function (response) {
          if (!response.ok) throw new Error("Project data unavailable");
          return response.json();
        })
        .then(function (data) {
          return {
            posts: merge((data && data.posts) || [], []),
            build: data || {},
            raw: [data || {}],
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

    var exhibitionsPerPage = 5;

    var exhibitionCacheKey = "exhibitions_cache_v2";
    var exhibitionCacheTimeKey = "exhibitions_cache_time_v2";
    var exhibitionCacheDuration = 1000 * 60 * 10;

    /* =========================================================
     TEXT HELPERS
     ========================================================= */

    function normalizeText(value) {
      if (Array.isArray(value)) {
        return value
          .filter(function (item) {
            return item !== null && item !== undefined;
          })
          .join(" ")
          .trim();
      }

      if (value === null || value === undefined) {
        return "";
      }

      return String(value).trim();
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

    /* =========================================================
     WEBSITE URL VALIDATION
     ========================================================= */

    function isValidWebsiteURL(value) {
      if (!value) return false;

      try {
        var url = new URL(String(value).trim());

        return url.protocol === "http:" || url.protocol === "https:";
      } catch (error) {
        return false;
      }
    }

    /* =========================================================
     FIELD READER
     Checks both the main item and item.misc.
     ========================================================= */

    function getField(item) {
      var possibleNames = Array.prototype.slice.call(arguments, 1);

      var wantedKeys = possibleNames.map(normalizeKey);

      var sources = [item || {}, (item && item.misc) || {}];

      for (var sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
        var source = sources[sourceIndex];

        if (!source || typeof source !== "object") {
          continue;
        }

        for (var key in source) {
          if (!Object.prototype.hasOwnProperty.call(source, key)) {
            continue;
          }

          var normalizedValue = normalizeText(source[key]);

          if (wantedKeys.indexOf(normalizeKey(key)) !== -1 && normalizedValue) {
            return normalizedValue;
          }
        }
      }

      return "";
    }

    /* =========================================================
     IMAGE READER
     ========================================================= */

    function extractImages(item) {
      var files = Array.isArray(item && item.files)
        ? item.files
        : item && item.files
          ? [item.files]
          : [];

      var urls = [];

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

    /* =========================================================
     IMAGE CAPTIONS
     Caption One | Caption Two | Caption Three
     ========================================================= */

    function extractImageCaptions(item) {
      var captions = getField(
        item,
        "imagecaptions",
        "image captions",
        "captions",
      );

      if (!captions) {
        return [];
      }

      return captions
        .split("|")
        .map(function (caption) {
          return caption.trim();
        })
        .filter(Boolean);
    }

    /* =========================================================
     DISPLAY HELPERS
     ========================================================= */

    function formatPipeSeparatedValue(value) {
      if (!value) {
        return "";
      }

      return value
        .split("|")
        .map(function (part) {
          return part.trim();
        })
        .filter(Boolean)
        .map(function (part) {
          return (
            '<span class="exhibition-work-item">' + escapeHTML(part) + "</span>"
          );
        })
        .join("");
    }

    function createDetailRow(label, value, options) {
      if (!value) {
        return "";
      }

      var displayedValue = "";

      if (options && options.pipeSeparated) {
        displayedValue =
          '<div class="exhibition-work-list">' +
          formatPipeSeparatedValue(value) +
          "</div>";
      } else {
        displayedValue = "<span>" + escapeHTML(value) + "</span>";
      }

      return (
        "<li>" +
        "<strong>" +
        escapeHTML(label) +
        "</strong>" +
        displayedValue +
        "</li>"
      );
    }

    function makeDetailRows(item) {
      var venue = getField(item, "venue", "gallery", "institution");

      var location = getField(item, "location", "city", "address");

      var dates = getField(item, "dates", "exhibitiondates");

      var reception = getField(
        item,
        "reception",
        "receptiondate",
        "opening",
        "openingreception",
      );

      var organizer = getField(
        item,
        "organizer",
        "organization",
        "presentedby",
      );

      var works = getField(item, "works", "artworks", "pieces", "worksshown");

      var award = getField(item, "award", "recognition");

      var rows = [
        createDetailRow("Venue", venue),

        createDetailRow("Location", location),

        createDetailRow("Dates", dates),

        createDetailRow("Reception", reception),

        createDetailRow("Organizer", organizer),

        createDetailRow("Works", works, {
          pipeSeparated: true,
        }),

        createDetailRow("Award", award),
      ].filter(Boolean);

      if (!rows.length) {
        return "";
      }

      return '<ul class="exhibition-details">' + rows.join("") + "</ul>";
    }

    /* =========================================================
     BOOTSTRAP CAROUSEL
     ========================================================= */

    function makeCarousel(item, exhibitionIndex) {
      var images = extractImages(item);

      var captions = extractImageCaptions(item);

      var title = getField(item, "title") || "Exhibition";

      var carouselId = "exhibition-carousel-" + exhibitionIndex;

      if (!images.length) {
        return (
          '<div class="exhibition-placeholder">' +
          "Images forthcoming" +
          "</div>"
        );
      }

      var indicators = "";

      if (images.length > 1) {
        indicators =
          '<div class="carousel-indicators">' +
          images
            .map(function (image, index) {
              return (
                "<button " +
                'type="button" ' +
                'data-bs-target="#' +
                carouselId +
                '" ' +
                'data-bs-slide-to="' +
                index +
                '" ' +
                'class="' +
                (index === 0 ? "active" : "") +
                '" ' +
                'aria-current="' +
                (index === 0 ? "true" : "false") +
                '" ' +
                'aria-label="Image ' +
                (index + 1) +
                '">' +
                "</button>"
              );
            })
            .join("") +
          "</div>";
      }

      var slides = images
        .map(function (src, index) {
          var caption = captions[index] || "";

          return (
            '<div class="carousel-item ' +
            (index === 0 ? "active" : "") +
            '">' +
            "<img " +
            'src="' +
            escapeHTML(src) +
            '" ' +
            'class="d-block w-100 exhibition-image" ' +
            'loading="lazy" ' +
            'alt="' +
            escapeHTML(title) +
            " image " +
            (index + 1) +
            '">' +
            (caption
              ? '<div class="carousel-caption d-none d-md-block">' +
                "<p>" +
                escapeHTML(caption) +
                "</p>" +
                "</div>"
              : "") +
            "</div>"
          );
        })
        .join("");

      var controls = "";

      if (images.length > 1) {
        controls =
          "<button " +
          'class="carousel-control-prev" ' +
          'type="button" ' +
          'data-bs-target="#' +
          carouselId +
          '" ' +
          'data-bs-slide="prev">' +
          '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
          '<span class="visually-hidden">Previous</span>' +
          "</button>" +
          "<button " +
          'class="carousel-control-next" ' +
          'type="button" ' +
          'data-bs-target="#' +
          carouselId +
          '" ' +
          'data-bs-slide="next">' +
          '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
          '<span class="visually-hidden">Next</span>' +
          "</button>";
      }

      return (
        "<div " +
        'id="' +
        carouselId +
        '" ' +
        'class="carousel slide exhibition-carousel" ' +
        'data-bs-ride="false">' +
        indicators +
        '<div class="carousel-inner">' +
        slides +
        "</div>" +
        controls +
        "</div>"
      );
    }

    /* =========================================================
     BROKEN IMAGE HANDLING
     No inline onerror attribute.
     ========================================================= */

    function handleExhibitionImageError(imageElement) {
      var slide = imageElement.closest(".carousel-item");

      if (!slide) {
        imageElement.style.display = "none";

        return;
      }

      slide.innerHTML =
        '<div class="exhibition-placeholder">' + "Image unavailable" + "</div>";
    }

    function bindExhibitionImageErrors(root) {
      if (!root) return;

      root.querySelectorAll(".exhibition-image").forEach(function (image) {
        if (image.dataset.exhibitionErrorBound === "1") {
          return;
        }

        image.dataset.exhibitionErrorBound = "1";

        image.addEventListener("error", function () {
          handleExhibitionImageError(image);
        });
      });
    }

    /* =========================================================
     ONE EXHIBITION
     ========================================================= */

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
        '<div class="col-lg-6 d-flex align-items-center">' +
        '<div class="exhibition-copy">' +
        '<span class="exhibition-status">' +
        escapeHTML(status) +
        "</span>" +
        '<h2 class="exhibition-title">' +
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
          ? '<a class="exhibition-link" ' +
            'href="' +
            escapeHTML(officialLink) +
            '" ' +
            'target="_blank" ' +
            'rel="noopener noreferrer">' +
            "Exhibition Details" +
            "</a>"
          : "") +
        "</div>" +
        "</div>";

      return (
        "<article " +
        'class="exhibition-card" ' +
        'data-exhibition-id="' +
        escapeHTML((item && item.id) || "") +
        '">' +
        '<div class="row g-0">' +
        (index % 2 === 1
          ? copyColumn + imageColumn
          : imageColumn + copyColumn) +
        "</div>" +
        "</article>"
      );
    }

    /* =========================================================
     EXHIBITION ARCHIVE
     Preserves original inline caching behavior.
     ========================================================= */

    function getExhibitionArchive() {
      var now = Date.now();

      var cached = localStorage.getItem(exhibitionCacheKey);

      var cachedTime = Number(localStorage.getItem(exhibitionCacheTimeKey));

      if (cached && cachedTime && now - cachedTime < exhibitionCacheDuration) {
        try {
          return Promise.resolve(JSON.parse(cached));
        } catch (error) {
          localStorage.removeItem(exhibitionCacheKey);

          localStorage.removeItem(exhibitionCacheTimeKey);
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
            throw new Error(
              "The exhibition archive returned an invalid format.",
            );
          }

          localStorage.setItem(exhibitionCacheKey, JSON.stringify(archive));

          localStorage.setItem(exhibitionCacheTimeKey, String(now));

          /*
           * IMPORTANT:
           * Return the complete archive record.
           * Do not rebuild/map the objects here.
           */
          return archive;
        });
    }

    /* =========================================================
     LOAD FIVE MORE
     ========================================================= */

    function renderMoreExhibitions() {
      var exhibitionList = document.getElementById("exhibition-list");

      var loadMoreButton = document.getElementById("loadMoreExhibitions");

      if (!exhibitionList) {
        return;
      }

      var nextExhibitions = allExhibitions.slice(
        currentExhibitionIndex,
        currentExhibitionIndex + exhibitionsPerPage,
      );

      if (!nextExhibitions.length) {
        if (loadMoreButton) {
          loadMoreButton.style.display = "none";
        }

        return;
      }

      var html = nextExhibitions
        .map(function (item, localIndex) {
          var globalIndex = currentExhibitionIndex + localIndex;

          return renderExhibition(item, globalIndex);
        })
        .join("");

      exhibitionList.insertAdjacentHTML("beforeend", html);

      bindExhibitionImageErrors(exhibitionList);

      currentExhibitionIndex += nextExhibitions.length;

      if (loadMoreButton) {
        loadMoreButton.style.display =
          currentExhibitionIndex < allExhibitions.length
            ? "inline-block"
            : "none";
      }
    }

    /* =========================================================
     INITIALIZE EXHIBITIONS
     ========================================================= */

    function initiateExhibitions() {
      var exhibitionList = document.getElementById("exhibition-list");

      var loadMoreButton = document.getElementById("loadMoreExhibitions");

      if (!exhibitionList) {
        console.error("Missing #exhibition-list container.");

        return;
      }

      getExhibitionArchive()
        .then(function (archive) {
          allExhibitions = archive
            .filter(function (item) {
              return (
                normalizeText(item && item.type).toLowerCase() === "exhibit"
              );
            })
            .sort(function (a, b) {
              var idA = Number((a && a.id) || 0);

              var idB = Number((b && b.id) || 0);

              return idB - idA;
            });

          exhibitionList.innerHTML = "";

          currentExhibitionIndex = 0;

          if (!allExhibitions.length) {
            exhibitionList.innerHTML =
              '<div class="exhibition-empty">' +
              "No exhibition records are published yet." +
              "</div>";

            if (loadMoreButton) {
              loadMoreButton.style.display = "none";
            }

            return;
          }

          renderMoreExhibitions();
        })
        .catch(function (error) {
          console.error("Exhibition load error:", error);

          exhibitionList.innerHTML =
            '<div class="exhibition-error">' +
            "The exhibition archive could not be loaded. " +
            "Please return shortly." +
            "</div>";

          if (loadMoreButton) {
            loadMoreButton.style.display = "none";
          }
        });

      if (loadMoreButton) {
        loadMoreButton.addEventListener("click", renderMoreExhibitions);
      }
    }

    initiateExhibitions();
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
