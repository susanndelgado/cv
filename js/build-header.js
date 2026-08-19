/* Shared build-only header normalizer.
 * Keeps Fine Arts as the global header treatment and adds Bootstrap-compatible
 * structural classes without loading Bootstrap's global stylesheet.
 */
(function(){
  'use strict';

  function addClasses(element,names){
    if(!element)return;
    names.split(/\s+/).filter(Boolean).forEach(function(name){element.classList.add(name);});
  }

  function isWorkSide(header){
    if(document.body.classList.contains('work-build-page'))return true;
    if(/\/(?:work|showcase|contact|resume)-build\.html$/.test(location.pathname))return true;
    return !!header.querySelector('.build-tabs .active a[href*="work-build.html"],.build-tabs a[aria-current="page"][href*="work-build.html"]');
  }

  function createWorkMainNav(header){
    var nav=document.createElement('nav');
    nav.className='build-main-nav';
    nav.setAttribute('aria-label','Technical portfolio navigation');
    nav.innerHTML='<div class="build-main-nav-inner"><a class="build-site-brand" href="/index.html">SUSAN DELGADO</a><div class="build-site-links"><a href="work-build.html">TECHNICAL WORK</a><a href="showcase-build.html?post=23">SHOWCASE</a><a href="contact-build.html" aria-current="page">CONTACT</a></div></div>';
    header.appendChild(nav);
    return nav;
  }

  function normalizeHeader(root){
    root=root||document;
    var header=root.querySelector('.build-site-header');
    if(!header)return;

    var workSide=isWorkSide(header);
    addClasses(header,'site-header w-100');

    var topTabs=header.querySelector('.build-top-tabs');
    addClasses(topTabs,'w-100');

    var tabs=header.querySelector('.build-tabs');
    if(tabs){
      addClasses(tabs,'nav nav-tabs');
      tabs.querySelectorAll(':scope > li').forEach(function(item){
        addClasses(item,'nav-item');
        var link=item.querySelector(':scope > a');
        addClasses(link,'nav-link');
        if(item.classList.contains('active')||link&&link.getAttribute('aria-current')==='page')link.classList.add('active');
      });
    }

    var mainNav=header.querySelector('.build-main-nav');
    if(!mainNav&&workSide)mainNav=createWorkMainNav(header);
    if(!mainNav)return;

    addClasses(mainNav,'navbar navbar-expand-lg');
    mainNav.classList.toggle('build-nav-work',workSide);

    var inner=mainNav.querySelector('.build-main-nav-inner');
    addClasses(inner,'container-fluid');

    var brand=mainNav.querySelector('.build-site-brand');
    addClasses(brand,'navbar-brand');

    var links=mainNav.querySelector('.build-site-links');
    addClasses(links,'navbar-nav ms-auto');
    if(links){
      links.querySelectorAll(':scope > a').forEach(function(link){addClasses(link,'nav-link');});
    }
  }

  window.initBuildHeader=normalizeHeader;

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){normalizeHeader(document);});
  else normalizeHeader(document);
})();
