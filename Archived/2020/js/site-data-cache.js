/* Shared site data cache for the Google Apps Script archive.
 *
 * The site uses one Google Apps Script endpoint for galleries, exhibitions,
 * chronicles and other archive-driven sections. This module warms the full
 * JSON archive once, stores it in localStorage for a short TTL, and intercepts
 * later fetches to the same endpoint so individual pages reuse the stored data
 * instead of starting another network request.
 */
(function () {
  'use strict';

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec';
  var CACHE_KEY = 'site_archive_cache_v1';
  var CACHE_TIME_KEY = 'site_archive_cache_time_v1';
  var CACHE_DURATION = 1000 * 60 * 10; // 10 minutes; one refresh serves the whole site.

  // Existing gallery pages already check these keys directly before fetch().
  // Mirror the shared archive into them so those pages can render immediately.
  var GALLERY_CACHE_KEY = 'gallery_cache_v1';
  var GALLERY_CACHE_TIME_KEY = 'gallery_cache_time';

  var originalFetch = window.fetch.bind(window);
  var inFlight = null;

  function parseStored(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function readSharedCache(allowStale) {
    try {
      var data = parseStored(CACHE_KEY);
      var stamp = Number(localStorage.getItem(CACHE_TIME_KEY));
      if (!data || !stamp) return null;

      var fresh = (Date.now() - stamp) < CACHE_DURATION;
      if (!fresh && !allowStale) return null;

      return { data: data, stamp: stamp, fresh: fresh };
    } catch (error) {
      return null;
    }
  }

  function saveSharedCache(data, stamp) {
    if (!Array.isArray(data)) return data;

    try {
      var serialized = JSON.stringify(data);
      var time = String(stamp || Date.now());

      localStorage.setItem(CACHE_KEY, serialized);
      localStorage.setItem(CACHE_TIME_KEY, time);

      // Compatibility with the four existing gallery pages.
      localStorage.setItem(GALLERY_CACHE_KEY, serialized);
      localStorage.setItem(GALLERY_CACHE_TIME_KEY, time);
    } catch (error) {
      // If storage is unavailable, the current page still receives the data.
    }

    return data;
  }

  function requestFreshData() {
    if (inFlight) return inFlight;

    var now = Date.now();
    inFlight = originalFetch(ENDPOINT + '?t=' + now, { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Archive request failed: ' + response.status);
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('Archive response was not an array');
        return saveSharedCache(data, now);
      })
      .catch(function (error) {
        // A stale archive is preferable to making archive-driven pages fail.
        var stale = readSharedCache(true);
        if (stale) return stale.data;
        throw error;
      })
      .then(function (data) {
        inFlight = null;
        return data;
      }, function (error) {
        inFlight = null;
        throw error;
      });

    return inFlight;
  }

  function getData(options) {
    options = options || {};

    if (!options.forceRefresh) {
      var cached = readSharedCache(false);
      if (cached) return Promise.resolve(cached.data);
    }

    return requestFreshData();
  }

  function matchesArchiveRequest(input) {
    var url = '';

    if (typeof input === 'string') {
      url = input;
    } else if (input && typeof input.url === 'string') {
      url = input.url;
    }

    return url.indexOf(ENDPOINT) === 0;
  }

  function jsonResponse(data) {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Susan-Archive-Cache': 'browser'
      }
    });
  }

  // Any existing page code that still calls fetch(ENDPOINT) transparently uses
  // the shared cache. If a refresh is already underway, it waits for that same
  // promise rather than creating a duplicate request.
  window.fetch = function (input, init) {
    if (!matchesArchiveRequest(input)) {
      return originalFetch(input, init);
    }

    return getData().then(jsonResponse);
  };

  window.SiteArchiveData = {
    get: function () { return getData(); },
    refresh: function () { return getData({ forceRefresh: true }); },
    peek: function () {
      var cached = readSharedCache(true);
      return cached ? cached.data : null;
    },
    cacheDuration: CACHE_DURATION
  };

  // Start immediately when the script is encountered in <head>. On the splash
  // page this begins while the rest of the page is still parsing; on a direct
  // deep link it also ensures the page's own archive request joins the same
  // in-flight request rather than duplicating it.
  getData().catch(function () {
    // Existing page code retains its own UI/error behavior if no cache exists.
  });
})();
