/* Live portfolio navigation normalization.
 * Keeps the Fine Arts and Technical sections consistent even when older page
 * markup contains legacy menus. Loaded after page markup so it wins over the
 * older Modernizr-era menu normalizer without changing page content.
 */
(function () {
  'use strict';

  function item(href, label, active) {
    return '<li class="item' + (active ? ' active' : '') + '">' +
      '<a class="nav-link link' + (active ? ' active' : '') + '"' +
      (active ? ' aria-current="page"' : '') +
      ' href="' + href + '">' + label + '</a></li>';
  }

  function normalizeLiveNavigation() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var header = document.querySelector('header#top');
    if (!header) return;

    var pageNav = header.querySelector('.page-nav');
    if (!pageNav) return;

    var list = pageNav.querySelector('.navbar-nav');
    if (!list) return;

    var artPages = [
      '/finearts.html',
      '/about.html',
      '/exhibits.html',
      '/progress-chronicles.html',
      '/narrative-gallery.html',
      '/wildlife-gallery.html',
      '/decorative-gallery.html',
      '/studies-gallery.html'
    ];

    var techPages = [
      '/work.html',
      '/showcase.html'
    ];

    if (artPages.indexOf(path) !== -1) {
      list.innerHTML =
        item('/finearts.html', 'FINE ARTS', path === '/finearts.html') +
        item('/about.html', 'ABOUT', path === '/about.html') +
        item('/exhibits.html', 'EXHIBITIONS', path === '/exhibits.html') +
        item('/progress-chronicles.html', 'PROGRESS CHRONICLES', path === '/progress-chronicles.html') +
        item('/contact.html', 'CONTACT', false);
      return;
    }

    if (techPages.indexOf(path) !== -1) {
      list.innerHTML =
        item('/work.html', 'TECHNICAL WORK', path === '/work.html') +
        item('/showcase.html', 'SHOWCASE', path === '/showcase.html') +
        item('/contact.html', 'CONTACT / RESUME', false);
      return;
    }

    if (path === '/contact.html') {
      var wrapper = pageNav.parentNode;
      if (wrapper && wrapper.classList && wrapper.classList.contains('container-fluid')) {
        wrapper.parentNode.removeChild(wrapper);
      } else if (pageNav.parentNode) {
        pageNav.parentNode.removeChild(pageNav);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeLiveNavigation);
  } else {
    normalizeLiveNavigation();
  }
})();
