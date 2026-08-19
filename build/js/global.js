/* =========================================================
   BUILD HEADER
   ========================================================= */
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
    var nav=document.createElement('div');
    nav.className='build-main-nav';
    nav.innerHTML='<div class="build-main-nav-inner"><a class="build-site-brand" href="/index.html">SUSAN DELGADO</a><nav class="build-site-links" aria-label="Technical portfolio navigation"><a href="work-build.html">TECHNICAL WORK</a><a href="showcase-build.html?post=23">SHOWCASE</a><a href="contact-build.html" aria-current="page">CONTACT</a></nav></div>';
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

/* =========================================================
   BUILD MOTION / TECHNICAL PORTFOLIO
   ========================================================= */
(function(){
  'use strict';

  var portfolioObserverInstalled=false;
  var currentLightboxTrigger=null;

  /* Evidence status from the surviving source archive.
     CHIP, SCAI and TRAC have inspectable Angular application source.
     Dallas Leipzig has inspectable surviving source without Angular.
     TVT remains unverified in the current archive. */
  var confirmedAngularPosts=new Set(['14','18','44','45']);
  var unverifiedAngularPosts=new Set(['16','39']);

  function ensureBuildHeader(){
    if(window.initBuildHeader){window.initBuildHeader(document);return;}
    if(document.getElementById('sd-build-header-js'))return;
    var script=document.createElement('script');
    script.id='sd-build-header-js';
    script.src='/js/build-header.js';
    document.head.appendChild(script);
  }

  function ensureInteractionStylesheet(){
    if(document.getElementById('sd-build-interactions-css'))return;
    var link=document.createElement('link');
    link.id='sd-build-interactions-css';
    link.rel='stylesheet';
    link.href='/css/build-interactions.css';
    document.head.appendChild(link);
  }

  function getPostId(){
    if(!/\/showcase-build\.html$/.test(location.pathname))return '';
    return new URLSearchParams(location.search).get('post')||'23';
  }

  function postIdFromLink(link){
    if(!link)return '';
    try{
      var url=new URL(link.getAttribute('href')||'',location.href);
      return url.pathname.endsWith('/showcase-build.html')?(url.searchParams.get('post')||''):'';
    }catch(e){return '';}
  }

  function normalizePortfolioNavigation(root){
    root=root||document;
    var archiveHeading=document.querySelector('#archive .build-section-head h2');
    if(archiveHeading&&archiveHeading.textContent.trim()==='Additional professional work'){
      archiveHeading.id='additional-professional-work';
    }

    root.querySelectorAll('.build-case-taxonomy-group').forEach(function(group){
      var label=group.querySelector('.build-case-taxonomy-label');
      if(!label)return;
      var labelText=label.textContent.trim();
      if(labelText==='Project type'||labelText==='Category'){
        label.textContent='Category';
        group.querySelectorAll('a.build-pill').forEach(function(link){
          var href=link.getAttribute('href')||'';
          if(href.indexOf('#archive')!==-1)link.setAttribute('href',href.replace('#archive','#additional-professional-work'));
        });
      }else if(labelText==='Skills'){
        group.querySelectorAll('a.build-pill').forEach(function(link){
          var span=document.createElement('span');
          span.className='build-pill';
          span.textContent=link.textContent;
          link.replaceWith(span);
        });
      }
    });

    root.querySelectorAll('a.build-case-nav-all').forEach(function(link){
      link.setAttribute('href','work-build.html#additional-professional-work');
    });
    root.querySelectorAll('a[href*="work-build.html?type="]').forEach(function(link){
      var href=link.getAttribute('href')||'';
      if(href.indexOf('#archive')!==-1)link.setAttribute('href',href.replace('#archive','#additional-professional-work'));
    });
    root.querySelectorAll('a[href="work-build.html#archive"]').forEach(function(link){
      link.setAttribute('href','work-build.html#additional-professional-work');
    });

    var filterStatus=document.getElementById('archiveFilterStatus');
    if(filterStatus){
      Array.prototype.slice.call(filterStatus.childNodes).forEach(function(node){
        if(node.nodeType===Node.TEXT_NODE&&node.nodeValue.indexOf('Project type:')!==-1){
          node.nodeValue=node.nodeValue.replace('Project type:','Category:');
        }
      });
      filterStatus.querySelectorAll('a[href="work-build.html#archive"]').forEach(function(link){
        link.setAttribute('href','work-build.html#additional-professional-work');
      });
    }

    if(/\/work-build\.html$/.test(location.pathname)&&location.hash==='#archive'){
      history.replaceState(null,'',location.pathname+location.search+'#additional-professional-work');
    }
  }

  function normalizeAngularLabel(text){
    return /^AngularJS$/i.test(String(text||'').trim())?'Angular':String(text||'').trim();
  }

  function applyVerifiedTechnologyEvidence(root){
    root=root||document;

    if(/\/work-build\.html$/.test(location.pathname)){
      root.querySelectorAll('.build-project-card,.build-archive-card').forEach(function(card){
        var id=postIdFromLink(card.querySelector('a[href*="showcase-build.html?post="]'));
        if(!id)return;
        var skills=String(card.dataset.skills||'').split('||').map(normalizeAngularLabel).filter(Boolean);
        skills=skills.filter(function(skill){return skill.toLowerCase()!=='angularjs';});
        var hasAngular=skills.some(function(skill){return skill.toLowerCase()==='angular';});
        if(confirmedAngularPosts.has(id)&&!hasAngular)skills.push('angular');
        if(unverifiedAngularPosts.has(id))skills=skills.filter(function(skill){return skill.toLowerCase()!=='angular';});
        card.dataset.skills=Array.from(new Set(skills)).join('||');
      });
    }

    if(/\/showcase-build\.html$/.test(location.pathname)){
      var id=getPostId();
      root.querySelectorAll('.build-case-taxonomy-group').forEach(function(group){
        var label=group.querySelector('.build-case-taxonomy-label');
        if(!label||label.textContent.trim()!=='Skills')return;
        var pills=Array.prototype.slice.call(group.querySelectorAll('.build-pill'));
        pills.forEach(function(pill){
          if(/^AngularJS$/i.test(pill.textContent.trim()))pill.textContent='Angular';
        });
        pills=Array.prototype.slice.call(group.querySelectorAll('.build-pill'));
        var angularPill=pills.find(function(pill){return /^Angular$/i.test(pill.textContent.trim());});
        var holder=group.querySelector('.build-pills');
        if(confirmedAngularPosts.has(id)&&holder&&!angularPill){
          var span=document.createElement('span');
          span.className='build-pill';
          span.textContent='Angular';
          holder.appendChild(span);
        }
        if(unverifiedAngularPosts.has(id)){
          group.querySelectorAll('.build-pill').forEach(function(pill){
            if(/^Angular(?:JS)?$/i.test(pill.textContent.trim()))pill.remove();
          });
        }
      });
    }
  }

  function removePostEleven(){
    if(/\/showcase-build\.html$/.test(location.pathname)&&getPostId()==='11'){
      location.replace('work-build.html#additional-professional-work');
      return true;
    }
    if(/\/work-build\.html$/.test(location.pathname)){
      document.querySelectorAll('a[href*="showcase-build.html?post=11"]').forEach(function(link){
        var card=link.closest('.build-project-card,.build-archive-card');
        if(card)card.remove();
      });
    }
    return false;
  }

  function addFellowsInteraction(){
    var id=getPostId();
    if(id!=='17'&&id!=='21')return;
    var section=document.getElementById('uxSection');
    var title=document.getElementById('uxTitle');
    var intro=document.getElementById('uxIntro');
    var panels=document.getElementById('uxPanels');
    if(!section||!title||!intro||!panels||section.dataset.sdFellows==='1')return;
    title.textContent='Selectable conference content component';
    intro.textContent='The Fellows interface let visitors move between conference topics without leaving the page.';
    panels.innerHTML='<article class="build-panel"><h3>Coordinated content switching</h3><p>Selecting an item updated both the featured image and the corresponding explanatory text in place.</p></article><article class="build-panel"><h3>In-page topic navigation</h3><p>The interaction kept the visual reference and related information paired while visitors moved between topics.</p></article>';
    section.hidden=false;
    section.dataset.sdFellows='1';
  }

  function cleanWinterBallPreview(){
    if(getPostId()!=='10')return;
    var preview=document.getElementById('projectPreview');
    if(!preview)return;
    var image=Array.prototype.find.call(preview.querySelectorAll('img'),function(img){
      return (img.getAttribute('src')||'').indexOf('pcwp-winterball-photo-2018.jpg')!==-1;
    });
    if(!image)return;
    var row=image.closest('.row');
    var column=image.closest('[class*="col-"]');
    if(column)column.remove();
    else image.remove();
    if(row){
      var remaining=Array.prototype.slice.call(row.children).filter(function(child){return child.querySelector&&child.querySelector('img');});
      if(remaining.length===2)remaining.forEach(function(child){child.className='col-lg-6 col-md-6 col-sm-12';});
    }
  }

  function ensureLightbox(){
    var box=document.querySelector('.sd-lightbox');
    if(box)return box;
    box=document.createElement('div');
    box.className='sd-lightbox';
    box.hidden=true;
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    box.setAttribute('aria-label','Expanded project image');
    box.innerHTML='<div class="sd-lightbox-inner"><button class="sd-lightbox-close" type="button" aria-label="Close expanded image">×</button><img alt=""><p class="sd-lightbox-caption"></p></div>';
    document.body.appendChild(box);

    function close(){
      if(box.hidden)return;
      box.hidden=true;
      document.documentElement.classList.remove('sd-lightbox-open');
      box.querySelector('img').removeAttribute('src');
      if(currentLightboxTrigger&&document.contains(currentLightboxTrigger))currentLightboxTrigger.focus({preventScroll:true});
      currentLightboxTrigger=null;
    }

    box.addEventListener('click',function(event){if(event.target===box||event.target.closest('.sd-lightbox-close'))close();});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!box.hidden)close();});
    return box;
  }

  function openLightbox(trigger){
    var box=ensureLightbox();
    var image=box.querySelector('img');
    var caption=box.querySelector('.sd-lightbox-caption');
    currentLightboxTrigger=trigger;
    image.src=trigger.currentSrc||trigger.src;
    image.alt=trigger.alt||'Expanded project image';
    caption.textContent=trigger.alt||'';
    caption.hidden=!caption.textContent;
    box.hidden=false;
    document.documentElement.classList.add('sd-lightbox-open');
    box.querySelector('.sd-lightbox-close').focus({preventScroll:true});
  }

  function bindLightboxImages(root){
    if(!/\/showcase-build\.html$/.test(location.pathname))return;
    root=root||document;
    root.querySelectorAll('.build-case-visual img,#projectPreview img').forEach(function(img){
      if(img.dataset.sdLightbox==='1')return;
      img.dataset.sdLightbox='1';
      img.setAttribute('role','button');
      img.setAttribute('tabindex','0');
      img.setAttribute('aria-label',(img.alt||'Project image')+' — open larger');
      img.addEventListener('click',function(event){event.preventDefault();event.stopPropagation();openLightbox(img);});
      img.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();openLightbox(img);}});
    });
  }

  function runPortfolioFixes(root){
    if(removePostEleven())return;
    normalizePortfolioNavigation(root||document);
    applyVerifiedTechnologyEvidence(root||document);
    cleanWinterBallPreview();
    addFellowsInteraction();
    bindLightboxImages(root||document);
  }

  function installPortfolioObserver(){
    if(portfolioObserverInstalled||!window.MutationObserver)return;
    var targets=[
      document.getElementById('caseHero'),document.getElementById('caseNavTop'),document.getElementById('caseNavBottom'),
      document.getElementById('caseNarrative'),document.getElementById('uxSection'),document.getElementById('projectPreview'),
      document.getElementById('projectArchive'),document.getElementById('archiveFilterStatus')
    ].filter(Boolean);
    if(!targets.length)return;
    portfolioObserverInstalled=true;
    var queued=false;
    var observer=new MutationObserver(function(){
      if(queued)return;
      queued=true;
      requestAnimationFrame(function(){queued=false;runPortfolioFixes(document);});
    });
    targets.forEach(function(target){observer.observe(target,{childList:true,subtree:true});});
  }

  function initCursor(){
    if(!window.matchMedia||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!window.matchMedia('(pointer:fine) and (hover:hover)').matches||document.querySelector('.sd-cursor'))return;
    var cursor=document.createElement('div');
    cursor.className='sd-cursor';
    document.body.appendChild(cursor);
    document.documentElement.classList.add('sd-cursor-enabled');
    var lastMode='';

    function setMode(target){
      var image=target&&target.closest&&target.closest('[data-sd-lightbox],.build-project-image,.build-case-visual,.build-preview-stack a');
      var link=target&&target.closest&&target.closest('a,button,[role="button"]');
      var mode=image?'image':(link?'link':'');
      if(mode===lastMode)return;
      lastMode=mode;
      document.documentElement.classList.toggle('sd-cursor-image',mode==='image');
      document.documentElement.classList.toggle('sd-cursor-link',mode==='link');
    }

    document.addEventListener('pointermove',function(event){
      cursor.style.transform='translate3d('+event.clientX+'px,'+event.clientY+'px,0) translate(-50%,-50%)';
      document.documentElement.classList.add('sd-cursor-live');
      setMode(event.target);
    },{passive:true});
    document.addEventListener('pointerleave',function(){document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-image');lastMode='';});
    window.addEventListener('blur',function(){document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-image');lastMode='';});
  }

  function initBuildMotion(root){
    ensureBuildHeader();
    ensureInteractionStylesheet();
    runPortfolioFixes(root||document);
    installPortfolioObserver();
  }

  window.initBuildMotion=initBuildMotion;

  function init(){
    ensureBuildHeader();
    ensureInteractionStylesheet();
    runPortfolioFixes(document);
    installPortfolioObserver();
    initCursor();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();

/* =========================================================
   FINE ARTS INTERIOR
   ========================================================= */
(function(){
  'use strict';

  function ensureBuildHeader(){
    if(window.initBuildHeader){window.initBuildHeader(document);return;}
    if(document.getElementById('sd-build-header-js'))return;
    var script=document.createElement('script');
    script.id='sd-build-header-js';
    script.src='/js/build-header.js';
    document.head.appendChild(script);
  }

  ensureBuildHeader();

  var frame=document.querySelector('.finearts-preview-frame');
  if(!frame)return;

  function resizeFrame(doc){
    if(!doc||!doc.documentElement)return;
    var height=Math.max(doc.documentElement.scrollHeight||0,doc.body?doc.body.scrollHeight:0,900);
    frame.style.height=height+'px';
  }

  frame.addEventListener('load',function(){
    var doc=frame.contentDocument;
    if(!doc)return;

    var hideChrome=doc.createElement('style');
    hideChrome.textContent='#top{display:none!important} footer{display:none!important}';
    doc.head.appendChild(hideChrome);

    var theme=doc.createElement('link');
    theme.rel='stylesheet';
    theme.href='/css/finearts-build.css';
    doc.head.appendChild(theme);

    doc.querySelectorAll('.process-hero,.boutique-hero').forEach(function(hero){
      hero.classList.add('finearts-hero');
    });

    resizeFrame(doc);
    if(window.ResizeObserver&&doc.body){
      var observer=new ResizeObserver(function(){resizeFrame(doc);});
      observer.observe(doc.body);
    }
    setTimeout(function(){resizeFrame(doc);},500);
    setTimeout(function(){resizeFrame(doc);},1800);
  });
})();

/* =========================================================
   FINE ARTS GALLERY
   ========================================================= */
/* Review-only Fine Arts gallery renderer.
 * Uses the same archive JSON as the live site but presents works as an
 * editorial exhibition rather than a card grid.
 */
(function(){
  'use strict';

  var ENDPOINT='https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec';
  var GALLERIES=[
    {type:'gstory',label:'Narrative',href:'narrative-gallery-build.html'},
    {type:'gnature',label:'Wildlife',href:'wildlife-gallery-build.html'},
    {type:'gdecor',label:'Decorative',href:'decorative-gallery-build.html'},
    {type:'gstudy',label:'Academic Studies',href:'studies-gallery-build.html'}
  ];

  function ensureBuildHeader(){
    if(window.initBuildHeader){window.initBuildHeader(document);return;}
    if(document.getElementById('sd-build-header-js'))return;
    var script=document.createElement('script');
    script.id='sd-build-header-js';
    script.src='/js/build-header.js';
    document.head.appendChild(script);
  }

  function text(value){
    if(Array.isArray(value)) return value.filter(Boolean).join(' ').trim();
    return value===null||value===undefined?'':String(value).trim();
  }

  function normalizeKey(value){return String(value||'').replace(/[\s_-]/g,'').toLowerCase();}

  function field(item){
    var names=[].slice.call(arguments,1).map(normalizeKey);
    var sources=[item||{},(item&&item.misc)||{}];
    for(var s=0;s<sources.length;s++){
      var source=sources[s];
      for(var key in source){
        if(!Object.prototype.hasOwnProperty.call(source,key)) continue;
        if(names.indexOf(normalizeKey(key))!==-1){
          var value=text(source[key]);
          if(value) return value;
        }
      }
    }
    return '';
  }

  function escapeHTML(value){
    return String(value||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function imageURL(item){
    var files=Array.isArray(item&&item.files)?item.files:(item&&item.files?[item.files]:[]);
    for(var f=0;f<files.length;f++){
      var entry=files[f];
      if(typeof entry!=='string') continue;
      var parts=entry.split(/\r?\n/).map(function(x){return x.trim();});
      if(parts.length>=3 && /^https?:\/\//i.test(parts[2])) return parts[2];
      for(var i=parts.length-1;i>=0;i--){if(/^https?:\/\//i.test(parts[i])) return parts[i];}
    }
    return '';
  }

  function getArchive(){
    if(window.SiteArchiveData&&typeof window.SiteArchiveData.get==='function') return window.SiteArchiveData.get();
    return fetch(ENDPOINT).then(function(r){if(!r.ok)throw new Error('Archive unavailable');return r.json();});
  }

  function insertGalleryNavigation(type){
    var hero=document.querySelector('.art-gallery-hero');
    if(!hero||hero.querySelector('.art-gallery-categories')) return;
    var target=hero.querySelector('.container')||hero;
    var nav=document.createElement('nav');
    nav.className='art-gallery-categories';
    nav.setAttribute('aria-label','Fine Arts galleries');
    nav.innerHTML=GALLERIES.map(function(gallery){
      return '<a href="'+gallery.href+'"'+(gallery.type===type?' class="active" aria-current="page"':'')+'>'+gallery.label+'</a>';
    }).join('');
    target.appendChild(nav);
  }

  function makeCard(item,index){
    var src=imageURL(item);
    var title=field(item,'title')||'Untitled';
    var media=field(item,'media','medium')||'Masterwork';
    var dimensions=field(item,'dimensions','size');
    var year=field(item,'year','date');
    var status=field(item,'status','availability');
    var description=text(item.description);
    var meta=[media,dimensions,year,status].filter(Boolean).join(' · ');

    var figure=document.createElement('figure');
    figure.className='art-gallery-card';
    figure.innerHTML=
      '<button type="button" class="art-gallery-open" data-index="'+index+'" aria-label="View '+escapeHTML(title)+' larger">'+
        '<span class="art-gallery-media-stage">'+
          (src?'<img src="'+escapeHTML(src)+'" alt="'+escapeHTML(title)+'" loading="lazy">':'<span class="art-gallery-image-missing">Image forthcoming</span>')+
        '</span>'+
      '</button>'+
      '<figcaption class="art-gallery-caption">'+
        '<h2>'+escapeHTML(title)+'</h2>'+
        (meta?'<p class="art-gallery-meta">'+escapeHTML(meta)+'</p>':'')+
        (description?'<p class="art-gallery-description">'+escapeHTML(description)+'</p>':'')+
      '</figcaption>';
    return {node:figure,src:src,title:title,meta:meta,description:description};
  }

  function init(){
    ensureBuildHeader();
    var body=document.body;
    var type=(body.getAttribute('data-gallery-type')||'').toLowerCase();
    var grid=document.getElementById('artGalleryGrid');
    var status=document.getElementById('artGalleryStatus');
    var lightbox=document.getElementById('artGalleryLightbox');
    var lightboxImage=document.getElementById('artGalleryLightboxImage');
    var lightboxTitle=document.getElementById('artGalleryLightboxTitle');
    var lightboxMeta=document.getElementById('artGalleryLightboxMeta');
    var lightboxDescription=document.getElementById('artGalleryLightboxDescription');
    var close=document.getElementById('artGalleryClose');
    var records=[];

    if(!type||!grid||!lightbox||!lightboxImage||!lightboxTitle||!lightboxMeta||!lightboxDescription||!close)return;

    insertGalleryNavigation(type);

    function closeLightbox(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden','true');
      lightboxImage.removeAttribute('src');
    }

    getArchive().then(function(data){
      if(!Array.isArray(data)) throw new Error('Invalid archive data');
      var items=data.filter(function(item){return String(item.type||'').trim().toLowerCase()===type;})
        .sort(function(a,b){return Number(a.id||0)-Number(b.id||0);});

      if(status) status.remove();
      if(!items.length){
        grid.innerHTML='<p class="art-gallery-empty">No works are currently assigned to this gallery.</p>';
        return;
      }

      items.forEach(function(item,index){
        var record=makeCard(item,index);
        records.push(record);
        grid.appendChild(record.node);
      });

      grid.addEventListener('click',function(event){
        var button=event.target.closest('.art-gallery-open');
        if(!button) return;
        var record=records[Number(button.getAttribute('data-index'))];
        if(!record||!record.src) return;
        lightboxImage.src=record.src;
        lightboxImage.alt=record.title;
        lightboxTitle.textContent=record.title;
        lightboxMeta.textContent=record.meta;
        lightboxDescription.textContent=record.description;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden','false');
        close.focus();
      });
    }).catch(function(){
      if(status) status.textContent='The gallery archive could not be loaded.';
    });

    close.addEventListener('click',closeLightbox);
    lightbox.addEventListener('click',function(event){if(event.target===lightbox) closeLightbox();});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'&&lightbox.classList.contains('open')) closeLightbox();});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
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
(function(){
  'use strict';

  var pages=window.BuildInlinePages=window.BuildInlinePages||{};
  var SCRIPT_URL='https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec';

  function inlineContains(marker){
    if(!marker)return false;
    return Array.prototype.some.call(document.scripts,function(script){
      return !script.src&&(script.textContent||'').indexOf(marker)!==-1;
    });
  }

  function runWhenReady(fn){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  function initProcessVideos(){
    var connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    document.querySelectorAll('.process-video').forEach(function(video){
      video.muted=true;
      if(!connection)return;
      if(connection.saveData||['slow-2g','2g','3g'].includes(connection.effectiveType)){
        console.log('The winds are weak. Staying the process-video motion.');
        video.pause();
        video.autoplay=false;
      }else{
        video.play().catch(function(){console.log('Motion paused by browser policy.');});
      }
    });
  }

  pages.index=function(){
    var video=document.querySelector('.splash-video');
    var source=video&&video.querySelector('source');
    function useBlackFallback(){if(video)video.style.display='none';}
    if(video)video.addEventListener('error',useBlackFallback);
    if(source)source.addEventListener('error',useBlackFallback);
  };

  pages.finearts=function(){initProcessVideos();};

  pages.about=function(){
    if(window.IntersectionObserver){
      var observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){if(entry.isIntersecting)entry.target.classList.add('active-node');});
      },{threshold:.15});
      document.querySelectorAll('.process-node,.mastery-parallax-window,.mastery-content-box').forEach(function(node){observer.observe(node);});
    }
    initProcessVideos();
  };

  pages.resume=function(){
    var button=document.getElementById('saveResumePdf');
    if(button)button.addEventListener('click',function(){window.print();});
  };

  /* ---------------------------------------------------------
     Shared project-data helpers used by Work and Showcase.
     --------------------------------------------------------- */
  function projectHelpers(){
    function strip(value){
      var div=document.createElement('div');
      div.innerHTML=String(value||'');
      return (div.textContent||'').trim();
    }
    function lines(value){return String(value||'').split(/<br\s*\/?\s*>/i).map(strip).filter(Boolean);}
    function key(value){return strip(value).toLowerCase().replace(/\s+/g,' ').trim();}
    function yearNum(value){var match=String(value||'').match(/\d{4}/);return match?parseInt(match[0],10):0;}
    function contains(project,token){return (' '+String(project.filters||'')+' ').indexOf(' '+token+' ')!==-1;}
    function isCrfRelated(project){return /Cardiovascular Research Foundation|\bCRF\b/i.test([project.client,project.role,strip(project.content),project.summary].join(' '));}
    function normalizeProject(project){
      var next=Object.assign({},project);
      var skills=lines(next.skills).map(function(skill){return skill==='AngularJS'?'Angular':skill;});
      skills=skills.filter(function(skill){return !/^(Rapha[eë]l(?:\.js)?|TweenLite|Animate\.css)$/i.test(skill);});
      var emailRelated=contains(next,'email')||skills.some(function(skill){return /^Email Development$/i.test(skill);});
      if(emailRelated&&isCrfRelated(next)&&!skills.some(function(skill){return /^Salesforce Pardot$/i.test(skill);}))skills.push('Salesforce Pardot');
      next.skills=skills.join('<br>');
      return next;
    }
    function merge(base,extras){
      var result=(base||[]).map(function(project){return Object.assign({},project,{legacyId:String(project.id)});});
      (extras||[]).forEach(function(extra){
        var overrides=(extra&&extra.overrides)||{};
        result=result.map(function(project){
          var override=overrides[String(project.legacyId)]||overrides[String(project.id)]||{};
          return Object.assign({},project,override,{legacyId:String(project.legacyId)});
        });
        ((extra&&extra.posts)||[]).forEach(function(project){
          var id=String(project.id);
          var index=result.findIndex(function(item){return String(item.legacyId)===id;});
          var next=Object.assign({},project,{legacyId:id});
          if(index>=0)result[index]=Object.assign({},result[index],next);
          else result.push(next);
        });
      });
      return result.filter(function(project){return !project.hidden;}).map(normalizeProject).sort(function(a,b){return yearNum(b.year)-yearNum(a.year)||strip(a.title).localeCompare(strip(b.title));});
    }
    function optionalJson(url){
      return fetch(url).then(function(response){return response.ok?response.json():{};}).catch(function(){return {};});
    }
    function loadProjects(){
      return Promise.all([
        fetch('/js/posts.json').then(function(response){return response.json();}),
        optionalJson('/js/posts-extra.json'),
        optionalJson('/js/posts-corrections.json'),
        optionalJson('/js/posts-project-copy.json'),
        optionalJson('/js/posts-new.json')
      ]).then(function(data){
        return {posts:merge((data[0]&&data[0].posts)||[],[data[1]||{},data[2]||{},data[3]||{},data[4]||{}]),raw:data};
      });
    }
    return {strip:strip,lines:lines,key:key,yearNum:yearNum,contains:contains,normalizeProject:normalizeProject,merge:merge,optionalJson:optionalJson,loadProjects:loadProjects};
  }

  var project=projectHelpers();

  pages.work=function(){
    var featuredIds=['23','22','16','1'];
    var featured=document.getElementById('featuredProjects');
    var archive=document.getElementById('projectArchive');
    var filterStatus=document.getElementById('archiveFilterStatus');
    var buttons=document.querySelectorAll('.build-filter');
    var posts=[];
    var filterRun=0;
    var typeLabels={conf:'Campaigns',web:'Websites',email:'Emails',dig:'Digital',print:'Print Collateral',brand:'Branding'};
    if(!featured||!archive||!filterStatus)return;

    function url(item){return 'showcase-build.html?post='+encodeURIComponent(item.legacyId);}
    function image(item){return '/'+(item.thumb||item.image||'');}
    function card(item,small){
      var article=document.createElement('article');
      article.className=small?'build-archive-card':'build-project-card';
      article.dataset.filters=item.filters||'';
      article.dataset.skills=project.lines(item.skills).map(project.key).join('||');
      var meta=[item.year,project.strip(item.client)].filter(Boolean).join(' · ');
      article.innerHTML='<a class="build-project-image" href="'+url(item)+'"><img src="'+image(item)+'" alt="'+project.strip(item.title)+'" loading="lazy"></a><div class="build-project-copy"><p class="build-project-meta">'+meta+'</p><h3><a href="'+url(item)+'">'+item.title+'</a></h3><p>'+(item.summary||'Professional project.')+'</p><div class="build-project-role">'+project.strip(item.role).replace(/\s+/g,' · ')+'</div></div>';
      return article;
    }
    function renderFeatured(){
      featured.innerHTML='';
      featuredIds.forEach(function(id){var item=posts.find(function(candidate){return String(candidate.legacyId)===id;});if(item)featured.appendChild(card(item,false));});
    }
    function defaultArchivePosts(){return posts.filter(function(item){return featuredIds.indexOf(String(item.legacyId))===-1;});}
    function renderArchive(source){
      archive.innerHTML='';
      (source||[]).forEach(function(item){archive.appendChild(card(item,true));});
      if(window.initBuildMotion)window.initBuildMotion(document);
    }
    function cardMatches(node,type,skill){
      if(type&&type!=='all'&&(' '+node.dataset.filters+' ').indexOf(' '+type+' ')===-1)return false;
      if(skill&&String(node.dataset.skills||'').split('||').indexOf(project.key(skill))===-1)return false;
      return true;
    }
    function setButtonState(type){
      buttons.forEach(function(button){button.classList.toggle('active',type?button.dataset.filter===type:button.dataset.filter==='all');});
      if(!type)buttons.forEach(function(button){button.classList.toggle('active',button.dataset.filter==='all');});
    }
    function setStatus(type,skill){
      if(!type&&!skill){filterStatus.hidden=true;filterStatus.innerHTML='';return;}
      var label=skill?'Skill: <strong>'+project.strip(skill)+'</strong>':'Project type: <strong>'+(typeLabels[type]||project.strip(type))+'</strong>';
      filterStatus.innerHTML='Showing '+label+' <a href="work-build.html#archive">Clear filter</a>';
      filterStatus.hidden=false;
    }
    function filter(type,skill,instant){
      var run=++filterRun;
      var cards=Array.prototype.slice.call(archive.querySelectorAll('.build-archive-card'));
      var reduce=instant||(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)||!Element.prototype.animate;
      setStatus(type,skill);
      setButtonState(skill?null:type||null);
      if(reduce){cards.forEach(function(node){node.hidden=!cardMatches(node,type,skill);});return;}
      cards.forEach(function(node){node.getAnimations().forEach(function(animation){animation.cancel();});});
      var first=new Map();
      cards.filter(function(node){return !node.hidden;}).forEach(function(node){first.set(node,node.getBoundingClientRect());});
      var hiding=cards.filter(function(node){return !node.hidden&&!cardMatches(node,type,skill);});
      var showing=cards.filter(function(node){return node.hidden&&cardMatches(node,type,skill);});
      var exits=hiding.map(function(node){return node.animate([{opacity:1},{opacity:0}],{duration:150,easing:'ease-out',fill:'forwards'}).finished.catch(function(){});});
      Promise.all(exits).then(function(){
        if(run!==filterRun)return;
        hiding.forEach(function(node){node.hidden=true;node.style.opacity='';});
        showing.forEach(function(node){node.hidden=false;node.style.opacity='0';});
        var last=new Map();
        cards.filter(function(node){return !node.hidden;}).forEach(function(node){last.set(node,node.getBoundingClientRect());});
        cards.filter(function(node){return !node.hidden&&!showing.includes(node);}).forEach(function(node){
          var a=first.get(node),b=last.get(node);if(!a||!b)return;
          var dx=a.left-b.left,dy=a.top-b.top;if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
          node.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:380,easing:'cubic-bezier(.2,.65,.25,1)'});
        });
        showing.forEach(function(node,index){node.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,delay:index*28,easing:'ease-out',fill:'both'}).finished.then(function(){node.style.opacity='';}).catch(function(){});});
      });
    }

    buttons.forEach(function(button){
      button.addEventListener('click',function(){
        var value=button.dataset.filter;
        if(value==='all'){
          renderArchive(defaultArchivePosts());setStatus(null,null);setButtonState(null);history.replaceState(null,'','work-build.html#archive');return;
        }
        renderArchive(posts);filter(value,null,false);history.replaceState(null,'','work-build.html?type='+encodeURIComponent(value)+'#archive');
      });
    });

    project.loadProjects().then(function(result){
      posts=result.posts;
      renderFeatured();
      var params=new URLSearchParams(location.search);
      var type=params.get('type'),skill=params.get('skill');
      if(type||skill){renderArchive(posts);filter(type,skill,true);}
      else{renderArchive(defaultArchivePosts());setButtonState(null);}
    }).catch(function(){featured.innerHTML='<p>Project data is unavailable.</p>';archive.innerHTML='';});
  };

  pages.showcase=function(){
    var hero=document.getElementById('caseHero');
    var context=document.getElementById('caseContext');
    var uxSection=document.getElementById('uxSection');
    var workflowSection=document.getElementById('workflowSection');
    var systemSection=document.getElementById('systemSection');
    var structureSection=document.getElementById('structureSection');
    var deliverableSection=document.getElementById('deliverableSection');
    var visualSection=document.getElementById('visualSection');
    var typeMap=[{token:'conf',label:'Campaigns'},{token:'web',label:'Websites'},{token:'email',label:'Emails'},{token:'print',label:'Print collateral'},{token:'dig',label:'Digital'},{token:'brand',label:'Branding'}];
    if(!hero||!context)return;

    function projectUrl(item){return 'showcase-build.html?post='+encodeURIComponent(item.legacyId);}
    function filterUrl(kind,value){return 'work-build.html?'+kind+'='+encodeURIComponent(value)+'#archive';}
    function heroImage(item){return '/'+(item.image||item.thumb||'');}
    function skillPills(item){return project.lines(item.skills).map(function(skill){return '<a class="build-pill build-pill-link" href="'+filterUrl('skill',skill)+'">'+skill+'</a>';}).join('');}
    function typePills(item){return typeMap.filter(function(type){return project.contains(item,type.token);}).map(function(type){return '<a class="build-pill build-pill-link" href="'+filterUrl('type',type.token)+'">'+type.label+'</a>';}).join('');}
    function navMarkup(previous,next){return '<a class="build-case-nav-link previous" href="'+projectUrl(previous)+'"><span class="direction">← Previous</span><span class="project">'+project.strip(previous.title)+'</span></a><a class="build-case-nav-all" href="work-build.html#archive">All work</a><a class="build-case-nav-link next" href="'+projectUrl(next)+'"><span class="direction">Next →</span><span class="project">'+project.strip(next.title)+'</span></a>';}
    function renderCaseNav(item,posts){
      var index=posts.findIndex(function(candidate){return String(candidate.legacyId)===String(item.legacyId);});
      if(index<0||!posts.length)return;
      var html=navMarkup(posts[(index-1+posts.length)%posts.length],posts[(index+1)%posts.length]);
      document.getElementById('caseNavTop').innerHTML=html;
      document.getElementById('caseNavBottom').innerHTML=html;
    }
    function renderHero(item){
      var role=project.lines(item.role).join(' · '),types=typePills(item),skills=skillPills(item);
      document.title=project.strip(item.title)+' | Susan Delgado';
      hero.className='';
      hero.innerHTML='<div class="build-case-grid"><div><p class="build-kicker">'+(item.year||'Professional project')+' · '+project.strip(item.client)+'</p><h1 class="build-case-title">'+item.title+'</h1><p class="build-case-summary">'+(item.summary||'Professional project.')+'</p><div class="build-case-taxonomy">'+(types?'<div class="build-case-taxonomy-group"><span class="build-case-taxonomy-label">Project type</span><div class="build-pills">'+types+'</div></div>':'')+(skills?'<div class="build-case-taxonomy-group"><span class="build-case-taxonomy-label">Skills</span><div class="build-pills">'+skills+'</div></div>':'')+'</div></div><dl class="build-case-meta"><div><dt>Client / company</dt><dd>'+project.strip(item.client)+'</dd></div><div><dt>Role</dt><dd>'+role+'</dd></div><div><dt>Year</dt><dd>'+(item.year||'Not recorded')+'</dd></div></dl></div><div class="build-case-visual"><img src="'+heroImage(item)+'" alt="'+project.strip(item.title)+' project preview"></div>';
    }
    function renderContext(item){document.getElementById('caseNarrative').innerHTML=item.content||'<p>'+(item.summary||'Professional project.')+'</p>';context.hidden=false;}
    function renderUX(data){if(!data||!data.ux||!uxSection)return;document.getElementById('uxTitle').textContent=data.ux.title||'';document.getElementById('uxIntro').textContent=data.ux.intro||'';document.getElementById('uxPanels').innerHTML=(data.ux.panels||[]).map(function(panel){return '<article class="build-panel"><h3>'+panel.title+'</h3><p>'+panel.copy+'</p></article>';}).join('');uxSection.hidden=false;}
    function renderWorkflow(data){if(!data||!data.workflow||!data.workflow.length||!workflowSection)return;document.getElementById('workflowGrid').innerHTML=data.workflow.map(function(step){return '<article class="build-process-step"><span class="step">'+step.label+'</span><h3>'+step.title+'</h3><p>'+step.copy+'</p></article>';}).join('');workflowSection.hidden=false;}
    function renderSystem(data){if(!data||!data.system||!systemSection)return;document.getElementById('systemTitle').textContent=data.system.title||'Technical structure';document.getElementById('systemIntro').textContent=data.system.intro||'';document.getElementById('systemGrid').innerHTML=(data.system.nodes||[]).map(function(node){return '<article class="node"><h3>'+node.title+'</h3><p>'+node.copy+'</p></article>';}).join('');systemSection.hidden=false;}
    function renderStructure(data){if(!data||!data.items||!data.items.length||!structureSection)return;document.getElementById('structureTitle').textContent=data.title||'Website structure';document.getElementById('structureIntro').textContent=data.intro||'';document.getElementById('structureGrid').innerHTML=data.items.map(function(item){var children=(item.children||[]).map(function(child){return '<li>'+child+'</li>';}).join('');return '<article class="structure-node"><h3>'+item.label+'</h3>'+(children?'<ul>'+children+'</ul>':'')+'</article>';}).join('');structureSection.hidden=false;}
    function fallbackDeliverables(item){
      var items=[];
      if(project.contains(item,'web'))items.push({title:'Web / interface work',copy:'Website, microsite or responsive interface implementation.'});
      if(project.contains(item,'email'))items.push({title:'Email',copy:'Email development and campaign communication.'});
      if(project.contains(item,'dig'))items.push({title:'Digital assets',copy:'Digital and web campaign materials.'});
      if(project.contains(item,'print'))items.push({title:'Print',copy:'Printed production and collateral.'});
      if(project.contains(item,'brand'))items.push({title:'Branding',copy:'Identity and branding work.'});
      return items;
    }
    function renderDeliverables(item,data){
      if(!deliverableSection)return;
      var items=data&&data.deliverables&&data.deliverables.length?data.deliverables:fallbackDeliverables(item);
      if(!items.length)return;
      document.getElementById('deliverableGrid').innerHTML=items.map(function(deliverable){return '<div class="build-deliverable"><strong>'+deliverable.title+'</strong><span>'+deliverable.copy+'</span></div>';}).join('');
      deliverableSection.hidden=false;
    }
    function renderPreview(item){
      if(!visualSection)return;
      var preview=document.getElementById('projectPreview');
      fetch('/'+item.link).then(function(response){if(!response.ok)throw new Error();return response.text();}).then(function(html){
        preview.innerHTML=html;
        preview.querySelectorAll('script,style,link,nav,footer').forEach(function(element){element.remove();});
        preview.querySelectorAll('img').forEach(function(image){var src=image.getAttribute('src');if(src&&src.indexOf('/')!==0&&!src.startsWith('http'))image.src='/showcase/'+src.replace(/^\.\//,'');});
        visualSection.hidden=false;
        if(window.initBuildMotion)window.initBuildMotion(document);
      }).catch(function(){preview.innerHTML='<p class="build-status">Project preview unavailable.</p>';visualSection.hidden=false;if(window.initBuildMotion)window.initBuildMotion(document);});
    }

    Promise.all([
      project.loadProjects(),
      project.optionalJson('/build/case-study-build.json'),
      project.optionalJson('/build/site-structure-build.json')
    ]).then(function(data){
      var posts=data[0].posts,enhancedMap=data[1]||{},structureMap=data[2]||{};
      var requested=new URLSearchParams(location.search).get('post')||'23';
      var item=posts.find(function(candidate){return String(candidate.legacyId)===String(requested);})||posts[0];
      if(!item)throw new Error('No project data');
      var enhanced=enhancedMap[String(item.legacyId)]||null;
      var structure=structureMap[String(item.legacyId)]||null;
      renderCaseNav(item,posts);renderHero(item);renderContext(item);renderUX(enhanced);renderWorkflow(enhanced);renderSystem(enhanced);renderStructure(structure);renderDeliverables(item,enhanced);
      if(window.initBuildMotion)window.initBuildMotion(document);
      renderPreview(item);
    }).catch(function(){hero.className='build-status';hero.textContent='Project data could not be loaded.';});
  };

  pages.exhibits=function(){
    var allExhibitions=[];
    var currentExhibitionIndex=0;
    var perPage=5;
    var cacheKey='exhibitions_cache_v2';
    var cacheTimeKey='exhibitions_cache_time_v2';
    var cacheDuration=1000*60*10;

    function normalizeText(value){if(Array.isArray(value))return value.filter(function(item){return item!==null&&item!==undefined;}).join(' ').trim();return value===null||value===undefined?'':String(value).trim();}
    function normalizeKey(value){return String(value||'').replace(/[\s_-]/g,'').toLowerCase();}
    function escapeHTML(value){return String(value===null||value===undefined?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
    function isValidWebsiteURL(value){if(!value)return false;try{var url=new URL(String(value).trim());return url.protocol==='http:'||url.protocol==='https:';}catch(error){return false;}}
    function getField(item){
      var wanted=Array.prototype.slice.call(arguments,1).map(normalizeKey);
      var sources=[item||{},item&&item.misc||{}];
      for(var s=0;s<sources.length;s++)for(var key in sources[s])if(Object.prototype.hasOwnProperty.call(sources[s],key)){var value=normalizeText(sources[s][key]);if(wanted.indexOf(normalizeKey(key))!==-1&&value)return value;}
      return '';
    }
    function extractImages(item){
      var files=Array.isArray(item&&item.files)?item.files:(item&&item.files?[item.files]:[]),urls=[];
      files.forEach(function(fileEntry){if(!fileEntry)return;var text=typeof fileEntry==='string'?fileEntry:JSON.stringify(fileEntry);text.split(/\r?\n/).map(function(line){return line.trim();}).filter(function(line){return line.startsWith('http://')||line.startsWith('https://');}).forEach(function(url){urls.push(url);});});
      return Array.from(new Set(urls));
    }
    function extractImageCaptions(item){var captions=getField(item,'imagecaptions','image captions','captions');return captions?captions.split('|').map(function(caption){return caption.trim();}).filter(Boolean):[];}
    function formatPipeSeparatedValue(value){return value?value.split('|').map(function(part){return part.trim();}).filter(Boolean).map(function(part){return '<span class="exhibition-work-item">'+escapeHTML(part)+'</span>';}).join(''):'';}
    function createDetailRow(label,value,options){if(!value)return '';var displayed=options&&options.pipeSeparated?'<div class="exhibition-work-list">'+formatPipeSeparatedValue(value)+'</div>':'<span>'+escapeHTML(value)+'</span>';return '<li><strong>'+escapeHTML(label)+'</strong>'+displayed+'</li>';}
    function makeDetailRows(item){
      var rows=[
        createDetailRow('Venue',getField(item,'venue','gallery','institution')),
        createDetailRow('Location',getField(item,'location','city','address')),
        createDetailRow('Dates',getField(item,'dates','exhibitiondates')),
        createDetailRow('Reception',getField(item,'reception','receptiondate','opening','openingreception')),
        createDetailRow('Organizer',getField(item,'organizer','organization','presentedby')),
        createDetailRow('Works',getField(item,'works','artworks','pieces','worksshown'),{pipeSeparated:true}),
        createDetailRow('Award',getField(item,'award','recognition'))
      ].filter(Boolean);
      return rows.length?'<ul class="exhibition-details">'+rows.join('')+'</ul>':'';
    }
    function makeCarousel(item,index){
      var images=extractImages(item),captions=extractImageCaptions(item),title=getField(item,'title')||'Exhibition',carouselId='exhibition-carousel-'+index;
      if(!images.length)return '<div class="exhibition-placeholder">Images forthcoming</div>';
      var indicators=images.length>1?'<div class="carousel-indicators">'+images.map(function(image,i){return '<button type="button" data-bs-target="#'+carouselId+'" data-bs-slide-to="'+i+'" class="'+(i===0?'active':'')+'" aria-current="'+(i===0?'true':'false')+'" aria-label="Image '+(i+1)+'"></button>';}).join('')+'</div>':'';
      var slides=images.map(function(src,i){var caption=captions[i]||'';return '<div class="carousel-item '+(i===0?'active':'')+'"><img src="'+escapeHTML(src)+'" class="d-block w-100" loading="lazy" alt="'+escapeHTML(title)+' image '+(i+1)+'" onerror="handleExhibitionImageError(this)">'+(caption?'<div class="carousel-caption d-none d-md-block"><p>'+escapeHTML(caption)+'</p></div>':'')+'</div>';}).join('');
      var controls=images.length>1?'<button class="carousel-control-prev" type="button" data-bs-target="#'+carouselId+'" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#'+carouselId+'" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>':'';
      return '<div id="'+carouselId+'" class="carousel slide exhibition-carousel" data-bs-ride="false">'+indicators+'<div class="carousel-inner">'+slides+'</div>'+controls+'</div>';
    }
    function handleExhibitionImageError(imageElement){var slide=imageElement.closest('.carousel-item');if(!slide){imageElement.style.display='none';return;}slide.innerHTML='<div class="exhibition-placeholder">Image unavailable</div>';}
    window.handleExhibitionImageError=handleExhibitionImageError;
    function renderExhibition(item,index){
      var title=getField(item,'title')||'Untitled Exhibition';
      var description=getField(item,'description','exhibitdescription','summary');
      var media=getField(item,'media','medium','category');
      var status=getField(item,'status','exhibitstatus')||'Exhibition';
      var officialLink=getField(item,'link','url','website','officiallink');
      var imageColumn='<div class="col-lg-6 p-0">'+makeCarousel(item,index)+'</div>';
      var copyColumn='<div class="col-lg-6 d-flex align-items-center"><div class="exhibition-copy"><span class="exhibition-status">'+escapeHTML(status)+'</span><h2 class="exhibition-title">'+escapeHTML(title)+'</h2>'+(media?'<div class="exhibition-media">'+escapeHTML(media)+'</div>':'')+(description?'<div class="exhibition-description">'+escapeHTML(description)+'</div>':'')+makeDetailRows(item)+(isValidWebsiteURL(officialLink)?'<a class="exhibition-link" href="'+escapeHTML(officialLink)+'" target="_blank" rel="noopener noreferrer">Exhibition Details</a>':'')+'</div></div>';
      return '<article class="exhibition-card" data-exhibition-id="'+escapeHTML(item&&item.id||'')+'"><div class="row g-0">'+(index%2===1?copyColumn+imageColumn:imageColumn+copyColumn)+'</div></article>';
    }
    function getArchive(){
      var now=Date.now(),cached=localStorage.getItem(cacheKey),cachedTime=Number(localStorage.getItem(cacheTimeKey));
      if(cached&&cachedTime&&now-cachedTime<cacheDuration){try{return Promise.resolve(JSON.parse(cached));}catch(error){localStorage.removeItem(cacheKey);localStorage.removeItem(cacheTimeKey);}}
      return fetch(SCRIPT_URL+'?t='+now).then(function(response){if(!response.ok)throw new Error('Archive request failed with status '+response.status+'.');return response.json();}).then(function(archive){if(!Array.isArray(archive))throw new Error('The exhibition archive returned an invalid format.');localStorage.setItem(cacheKey,JSON.stringify(archive));localStorage.setItem(cacheTimeKey,String(now));return archive;});
    }
    function renderMore(){
      var list=document.getElementById('exhibition-list'),button=document.getElementById('loadMoreExhibitions');if(!list)return;
      var next=allExhibitions.slice(currentExhibitionIndex,currentExhibitionIndex+perPage);
      if(!next.length){if(button)button.style.display='none';return;}
      list.insertAdjacentHTML('beforeend',next.map(function(item,localIndex){return renderExhibition(item,currentExhibitionIndex+localIndex);}).join(''));
      currentExhibitionIndex+=next.length;
      if(button)button.style.display=currentExhibitionIndex<allExhibitions.length?'inline-block':'none';
    }
    function initiate(){
      var list=document.getElementById('exhibition-list'),button=document.getElementById('loadMoreExhibitions');if(!list)return;
      getArchive().then(function(archive){
        allExhibitions=archive.filter(function(item){return normalizeText(item&&item.type).toLowerCase()==='exhibit';}).sort(function(a,b){return Number(b&&b.id||0)-Number(a&&a.id||0);});
        list.innerHTML='';currentExhibitionIndex=0;
        if(!allExhibitions.length){list.innerHTML='<div class="exhibition-empty">No exhibition records are published yet.</div>';if(button)button.style.display='none';return;}
        renderMore();
      }).catch(function(error){console.error('Exhibition load error:',error);list.innerHTML='<div class="exhibition-error">The exhibition archive could not be loaded. Please return shortly.</div>';if(button)button.style.display='none';});
      if(button)button.addEventListener('click',renderMore);
    }
    initiate();
  };

  pages.progress=function(){
    var allChronicles=[];
    var currentIndex=0;
    var pageSize=4;
    function extractFileUrl(fileEntry){
      if(!fileEntry||typeof fileEntry!=='string')return null;
      var parts=fileEntry.split('\n');
      if(parts.length>=3&&parts[2]&&parts[2].startsWith('http'))return parts[2].trim();
      for(var i=parts.length-1;i>=0;i--)if(parts[i].startsWith('http'))return parts[i].trim();
      return null;
    }
    function renderImage(file){var url=extractFileUrl(file)||'https://via.placeholder.com/600';return '<img src="'+url+'" style="width:100%; height:100%; object-fit:cover;" loading="lazy">';}
    function renderChronicles(){
      var container=document.getElementById('chronicle-container');if(!container)return;
      var nextItems=allChronicles.slice(currentIndex,currentIndex+pageSize),html='';
      nextItems.forEach(function(item,i){
        var globalIndex=currentIndex+i,isEven=globalIndex%2===0;
        var description=item.misc&&item.misc.Description||(Array.isArray(item.description)?item.description.join('<br>'):item.description||'');
        var categories=item.misc&&item.misc.categories;
        var categoryDisplay=Array.isArray(categories)?categories.join(' '):categories||'';
        var mediaHTML=renderImage(item.files&&item.files[0]);
        var text='<div class="col-md-6 '+(isEven?'pr-md-5':'pl-md-5')+'"><span class="node-step">'+(categoryDisplay||'Study')+'</span><h3 class="node-title chronicle-title">'+(item.title||'')+'</h3><div class="node-text chronicle-desc">'+description+'</div><div class="chronicle-meta mt-3"><span>'+(item.author||'')+'</span><span>'+((item.misc&&item.misc.postdate)||item.date||'')+'</span></div></div>';
        var media='<div class="col-md-6 '+(isEven?'pl-md-5':'pr-md-5')+'"><div class="node-image-frame">'+mediaHTML+'</div></div>';
        html+='<div class="process-chronicals-node chronicle-node" data-index="'+globalIndex+'"><div class="row align-items-center">'+(isEven?text+media:media+text)+'</div></div>';
      });
      container.insertAdjacentHTML('beforeend',html);currentIndex+=pageSize;
      var button=document.getElementById('loadMoreBtn');if(button&&currentIndex>=allChronicles.length)button.style.display='none';
    }
    function initiate(){
      var container=document.getElementById('chronicle-container'),dump=document.getElementById('raw-data-log'),loading=document.getElementById('loadingMessage');
      fetch(SCRIPT_URL+'?t='+Date.now()).then(function(response){return response.json();}).then(function(satchel){
        if(!Array.isArray(satchel))throw new Error('Invalid response format');
        if(dump){dump.style.display='block';dump.textContent=JSON.stringify(satchel,null,2);}
        console.log(satchel);
        allChronicles=satchel.filter(function(item){return String(item.type).trim().toLowerCase()==='progress';}).sort(function(a,b){return Number(a.id)-Number(b.id);});
        container.innerHTML='';currentIndex=0;renderChronicles();if(loading)loading.style.display='none';
      }).catch(function(error){console.error('Chronicle load error:',error);if(container)container.innerHTML='<p style="color:red;">'+error.message+'</p>';if(loading){loading.innerText='Archive failed to load.';loading.style.color='red';}});
      var button=document.getElementById('loadMoreBtn');if(button)button.addEventListener('click',renderChronicles);
    }
    initiate();
  };

  var definitions=[
    {name:'index',marker:'useBlackFallback',test:function(){return document.body&&document.body.id==='index';}},
    {name:'finearts',marker:'The winds are weak. Staying the process-video motion.',test:function(){return document.body&&document.body.id==='arts';}},
    {name:'about',marker:'active-node',test:function(){return document.body&&document.body.id==='arts about';}},
    {name:'exhibits',marker:'EXHIBITION_SCRIPT_URL',test:function(){return document.body&&document.body.id==='arts exhibit';}},
    {name:'progress',marker:'CHRONICLE SCRIBE v7.1',test:function(){return document.body&&document.body.id==='arts chronicals';}},
    {name:'resume',marker:'saveResumePdf',test:function(){return document.body&&document.body.id==='work resume';}},
    {name:'work',marker:'featuredIds',test:function(){return document.body&&document.body.id==='work'&&document.getElementById('featuredProjects');}},
    {name:'showcase',marker:'case-study-build.json',test:function(){return document.body&&document.body.id==='work showcase';}}
  ];

  function currentDefinition(){return definitions.find(function(definition){return definition.test();})||null;}
  function initCurrent(options){
    var definition=currentDefinition();
    if(!definition||typeof pages[definition.name]!=='function')return;
    var force=!!(options&&options.force);
    if(!force&&inlineContains(definition.marker))return;
    var key='sdInlinePage'+definition.name;
    if(!force&&document.documentElement.dataset[key]==='1')return;
    document.documentElement.dataset[key]='1';
    pages[definition.name]();
  }

  window.initBuildInlinePage=initCurrent;
  runWhenReady(function(){initCurrent();});
})();
