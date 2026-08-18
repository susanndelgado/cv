/* Warm the Fine Arts gallery cache as soon as a visitor enters the site.
 * Gallery pages already read these same localStorage keys, so they can render
 * from cached data instead of waiting on Google Apps Script when the cache is warm.
 */
(function () {
  'use strict';

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec';
  var CACHE_KEY = 'gallery_cache_v1';
  var CACHE_TIME_KEY = 'gallery_cache_time';
  var CACHE_DURATION = 1000 * 60 * 10; // Keep current 10-minute gallery policy.

  function hasFreshCache(now) {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      var stamp = Number(localStorage.getItem(CACHE_TIME_KEY));
      if (!raw || !stamp || (now - stamp) >= CACHE_DURATION) return false;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed);
    } catch (error) {
      return false;
    }
  }

  function saveArchive(data, now) {
    if (!Array.isArray(data)) return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, String(now));
    } catch (error) {
      // Storage can be unavailable in private/restricted browser contexts.
    }
  }

  var now = Date.now();
  if (hasFreshCache(now)) return;

  fetch(SCRIPT_URL + '?t=' + now, { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Gallery archive request failed');
      return response.json();
    })
    .then(function (data) {
      saveArchive(data, now);
    })
    .catch(function () {
      // Gallery pages keep their existing direct-fetch fallback, so a failed
      // background warm-up must never block normal navigation.
    });
})();
