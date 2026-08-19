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