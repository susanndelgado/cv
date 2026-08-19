/* =========================================================
   BUILD PROJECT DATA LOADER
   =========================================================
   /build/js/post.json is the one file to edit when adding a project.

   Existing portfolio JSON files remain the read-only legacy baseline so the
   richer descriptions already established are preserved. post.json is merged
   LAST and can add a new project or override an existing one.

   A post can also contain:
   - caseStudy: enhanced case-study content
   - structure: site-structure content
   - preview.sections: showcase gallery content

   New projects using preview.sections do not need a separate HTML fragment.
   ========================================================= */
(function () {
  "use strict";

  var nativeFetch = window.fetch.bind(window);
  var POST_URL = "/build/js/post.json";
  var PREVIEW_PREFIX = "/build/post-preview/";

  function getJSON(url, fallback) {
    return nativeFetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error(url + " unavailable");
        return response.json();
      })
      .catch(function () {
        return fallback;
      });
  }

  function mergeProjectData(base, layers) {
    var result = (base || []).map(function (project) {
      return Object.assign({}, project, { id: String(project.id) });
    });

    (layers || []).forEach(function (layer) {
      var overrides = (layer && layer.overrides) || {};

      result = result.map(function (project) {
        var override = overrides[String(project.id)] || {};
        return Object.assign({}, project, override, { id: String(project.id) });
      });

      ((layer && layer.posts) || []).forEach(function (project) {
        var id = String(project.id);
        var index = result.findIndex(function (item) {
          return String(item.id) === id;
        });
        var next = Object.assign({}, project, { id: id });

        if (index >= 0) result[index] = Object.assign({}, result[index], next);
        else result.push(next);
      });
    });

    return result;
  }

  var dataPromise = Promise.all([
    getJSON("/js/posts.json", { posts: [] }),
    getJSON("/js/posts-extra.json", {}),
    getJSON("/js/posts-corrections.json", {}),
    getJSON("/js/posts-project-copy.json", {}),
    getJSON("/js/posts-new.json", {}),
    getJSON(POST_URL, { posts: [] }),
    getJSON("/build/js/case-study-build.json", {}),
    getJSON("/build/js/site-structure-build.json", {}),
  ]).then(function (data) {
    var postFile = data[5] || {};
    var posts = mergeProjectData((data[0] && data[0].posts) || [], [
      data[1] || {},
      data[2] || {},
      data[3] || {},
      data[4] || {},
      { posts: postFile.posts || [] },
    ]);

    var caseStudies = Object.assign({}, data[6] || {});
    var structures = Object.assign({}, data[7] || {});

    posts.forEach(function (project) {
      if (project.caseStudy) caseStudies[String(project.id)] = project.caseStudy;
      if (project.structure) structures[String(project.id)] = project.structure;
    });

    return {
      posts: posts,
      caseStudies: caseStudies,
      structures: structures,
      source: postFile,
    };
  });

  function urlFor(input) {
    try {
      if (typeof input === "string") return new URL(input, window.location.href);
      if (input && input.url) return new URL(input.url, window.location.href);
    } catch (error) {}
    return null;
  }

  function jsonResponse(value) {
    return new Response(JSON.stringify(value), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  function htmlResponse(value) {
    return new Response(value, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function previewColumnClass(columns) {
    var count = Number(columns) || 1;
    if (count >= 4) return "col-lg-3 col-md-6 col-sm-12";
    if (count === 3) return "col-lg-4 col-md-4 col-sm-12";
    if (count === 2) return "col-lg-6 col-md-6 col-sm-12";
    return "col-lg-12 col-md-12 col-sm-12";
  }

  function renderPreview(project) {
    var preview = project && project.preview;
    if (!preview) return "";

    if (preview.html) return String(preview.html);

    var sections = Array.isArray(preview.sections) ? preview.sections : [];
    return sections
      .map(function (section) {
        var columnClass = previewColumnClass(section.columns);
        var images = Array.isArray(section.images) ? section.images : [];
        var imageMarkup = images
          .map(function (image) {
            var size = image.size
              ? ' data-preview-size="' + escapeHTML(image.size) + '"'
              : "";
            return (
              '<div class="' +
              columnClass +
              '"><img class="responsive"' +
              size +
              ' src="' +
              escapeHTML(image.src || "") +
              '" alt="' +
              escapeHTML(image.alt || "") +
              '"></div>'
            );
          })
          .join("");

        return (
          '<div class="container">' +
          (section.title ? "<h2>" + escapeHTML(section.title) + "</h2>" : "") +
          '<div class="row">' +
          imageMarkup +
          "</div></div>"
        );
      })
      .join("");
  }

  function postsForRenderer(data) {
    return (data.posts || []).map(function (project) {
      var item = Object.assign({}, project);
      var preview = item.preview || {};

      if (preview.html || (Array.isArray(preview.sections) && preview.sections.length)) {
        item.link = "build/post-preview/" + encodeURIComponent(item.id) + ".html";
      }

      return item;
    });
  }

  function previewIdFromPath(pathname) {
    if (pathname.indexOf(PREVIEW_PREFIX) !== 0 || !/\.html$/.test(pathname)) return "";
    return decodeURIComponent(
      pathname.slice(PREVIEW_PREFIX.length).replace(/\.html$/, "")
    );
  }

  window.fetch = function (input, init) {
    var url = urlFor(input);
    if (!url) return nativeFetch(input, init);

    var path = url.pathname;

    /* The existing build renderer asks for five legacy post files.
       Give it the already-merged records once, then neutralize later layers. */
    if (path === "/js/posts.json") {
      return dataPromise.then(function (data) {
        return jsonResponse({ posts: postsForRenderer(data) });
      });
    }

    if (
      path === "/js/posts-extra.json" ||
      path === "/js/posts-corrections.json" ||
      path === "/js/posts-project-copy.json" ||
      path === "/js/posts-new.json"
    ) {
      return dataPromise.then(function () {
        return jsonResponse({});
      });
    }

    if (
      path === "/build/case-study-build.json" ||
      path === "/build/js/case-study-build.json"
    ) {
      return dataPromise.then(function (data) {
        return jsonResponse(data.caseStudies || {});
      });
    }

    if (
      path === "/build/site-structure-build.json" ||
      path === "/build/js/site-structure-build.json"
    ) {
      return dataPromise.then(function (data) {
        return jsonResponse(data.structures || {});
      });
    }

    var previewId = previewIdFromPath(path);
    if (previewId) {
      return dataPromise.then(function (data) {
        var project = (data.posts || []).find(function (item) {
          return String(item.id) === String(previewId);
        });
        return htmlResponse(project ? renderPreview(project) : "");
      });
    }

    return nativeFetch(input, init);
  };

  window.BuildPostData = {
    ready: dataPromise,
    source: POST_URL,
  };
})();
