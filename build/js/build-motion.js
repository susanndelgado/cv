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
    script.src='/build/js/build-header.js';
    document.head.appendChild(script);
  }

  function ensureInteractionStylesheet(){
    if(document.getElementById('sd-build-interactions-css'))return;
    var link=document.createElement('link');
    link.id='sd-build-interactions-css';
    link.rel='stylesheet';
    link.href='/build/css/build-interactions.css';
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