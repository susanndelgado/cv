(function(){
  'use strict';

  var STYLE_ID='sd-build-interactions';
  var normalizedNodes=new WeakSet();
  var portfolioObserverInstalled=false;
  var correctionsPromise=null;
  var currentLightboxTrigger=null;
  var unsupportedAngularPosts=new Set(['14','16','18','39','44']);

  function ensureStylesheets(){
    var head=document.head;
    if(!head)return;
    if(!document.getElementById('sd-cormorant-font')){
      var font=document.createElement('link');
      font.id='sd-cormorant-font';
      font.rel='stylesheet';
      font.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap';
      head.appendChild(font);
    }
    if(!document.getElementById('sd-unified-nav')){
      var nav=document.createElement('link');
      nav.id='sd-unified-nav';
      nav.rel='stylesheet';
      nav.href='/css/build-navigation-unified.css';
      head.appendChild(nav);
    }
    if(!document.getElementById('sd-serif-test')){
      var serif=document.createElement('link');
      serif.id='sd-serif-test';
      serif.rel='stylesheet';
      serif.href='/css/build-serif-test.css';
      head.appendChild(serif);
    }
  }

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
/* Technical build corrections + performance layer. */
.build-hero .build-kicker{font-weight:400!important}
#additional-professional-work{scroll-margin-top:96px}

/* Case-study metadata readability. */
.build-case-meta{
  color:#343a40!important;
  background:#fff!important;
  border-color:#ddd!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
.build-case-meta dt{color:#60adb8!important}
.build-case-meta dd{color:#343a40!important}
.build-case-meta div+div{border-top-color:#e2e2e2!important}
.build-case-hero .build-back{color:#6c757d!important}
.build-case-hero .build-back:hover,
.build-case-hero .build-back:focus-visible{color:#f70606!important}
.build-case-taxonomy-group .build-pill:not(a){cursor:default}

/* Resume header matches the original horizontal composition. */
.resume-build-page .resume-header{
  top:.34in!important;
  left:.24in!important;
  right:.64in!important;
  width:auto!important;
  display:flex!important;
  align-items:flex-start!important;
  justify-content:space-between!important;
  gap:.22in!important;
  text-align:left!important;
}
.resume-build-page .resume-name{
  flex:0 0 auto!important;
  margin:0!important;
  font-size:22.5pt!important;
  line-height:1!important;
  white-space:nowrap!important;
}
.resume-build-page .resume-contact{
  flex:0 0 auto!important;
  margin:0!important;
  text-align:right!important;
  font-size:9.5pt!important;
  line-height:1.22!important;
}
.resume-build-page .resume-grid{padding-top:1.12in!important}
.resume-build-page .resume-sidebar .resume-heading{line-height:1.06!important}

/* Performance: remove expensive blur/compositing and scroll transforms from
   image-heavy technical sections. */
body.build-page:not(.resume-build-page) .build-main-nav,
body.build-page:not(.resume-build-page) .build-brief,
body.build-page:not(.resume-build-page) .build-project-card,
body.build-page:not(.resume-build-page) .build-archive-card,
body.build-page:not(.resume-build-page) .build-process-step,
body.build-page:not(.resume-build-page) .build-cap-card,
body.build-page:not(.resume-build-page) .build-panel,
body.build-page:not(.resume-build-page) .build-case-meta,
body.build-page:not(.resume-build-page) .build-case-visual,
body.build-page:not(.resume-build-page) .build-architecture .node,
body.build-page:not(.resume-build-page) .build-contact-card{
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
body.build-page:not(.resume-build-page) .build-reveal,
body.build-page:not(.resume-build-page) .build-reveal.is-visible{
  opacity:1!important;
  transform:none!important;
  transition:none!important;
  will-change:auto!important;
}
body.build-page:not(.resume-build-page) .build-project-card,
body.build-page:not(.resume-build-page) .build-archive-card,
body.build-page:not(.resume-build-page) .build-project-image img,
body.build-page:not(.resume-build-page) .build-case-visual img,
body.build-page:not(.resume-build-page) .build-panel,
body.build-page:not(.resume-build-page) .build-process-step,
body.build-page:not(.resume-build-page) .build-cap-card{
  transform:none!important;
  transition:none!important;
}
body.build-page:not(.resume-build-page) .build-project-card:hover,
body.build-page:not(.resume-build-page) .build-archive-card:hover,
body.build-page:not(.resume-build-page) .build-project-card:hover .build-project-image img,
body.build-page:not(.resume-build-page) .build-project-image:hover img{
  transform:none!important;
}
body.build-page:not(.resume-build-page) .build-project-card:hover{box-shadow:0 10px 28px rgba(0,0,0,.045)!important}
body.build-page:not(.resume-build-page) .build-archive-card{
  content-visibility:auto;
  contain-intrinsic-size:360px 430px;
}

/* Case-study images now have a real interaction to match the image cursor. */
[data-sd-lightbox]{
  cursor:zoom-in;
}
[data-sd-lightbox]:focus-visible{
  outline:3px solid rgba(96,173,184,.55);
  outline-offset:4px;
}
.sd-lightbox[hidden]{display:none!important}
.sd-lightbox{
  position:fixed;
  z-index:2147483645;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:48px 54px 38px;
  background:rgba(0,0,0,.9);
}
.sd-lightbox-inner{
  position:relative;
  width:min(96vw,1500px);
  height:min(90vh,1000px);
  display:flex;
  align-items:center;
  justify-content:center;
}
.sd-lightbox img{
  display:block;
  max-width:100%;
  max-height:100%;
  width:auto;
  height:auto;
  object-fit:contain;
  box-shadow:0 18px 60px rgba(0,0,0,.28);
}
.sd-lightbox-close{
  position:absolute;
  z-index:2;
  top:-38px;
  right:0;
  border:0;
  padding:4px 8px;
  color:#fff;
  background:transparent;
  font:400 34px/1 Arial,sans-serif;
  cursor:pointer;
}
.sd-lightbox-caption{
  position:absolute;
  left:0;
  right:0;
  bottom:-28px;
  margin:0;
  color:#eee;
  font-size:.85rem;
  text-align:center;
}
html.sd-lightbox-open,
html.sd-lightbox-open body{overflow:hidden!important}

/* Lightweight cursor: one compositor-moved element, no trailing loop. */
@media (pointer:fine) and (hover:hover){
  html.sd-cursor-enabled,
  html.sd-cursor-enabled body,
  html.sd-cursor-enabled a,
  html.sd-cursor-enabled button,
  html.sd-cursor-enabled [role="button"]{cursor:none!important}
  .sd-cursor{
    position:fixed;
    z-index:2147483646;
    left:0;
    top:0;
    width:28px;
    height:28px;
    border:1px solid rgba(17,17,17,.48);
    border-radius:50%;
    pointer-events:none;
    opacity:0;
    transform:translate3d(-100px,-100px,0) translate(-50%,-50%);
    will-change:transform;
    transition:border-color .12s ease,background .12s ease,opacity .08s ease;
  }
  .sd-cursor::after{
    content:"";
    position:absolute;
    left:50%;
    top:50%;
    width:4px;
    height:4px;
    transform:translate(-50%,-50%);
    border-radius:50%;
    background:#111;
  }
  html.sd-cursor-live .sd-cursor{opacity:1}
  html.sd-cursor-link .sd-cursor{border-color:#f70606;background:rgba(247,6,6,.025)}
  html.sd-cursor-link .sd-cursor::after{background:#f70606}
  html.sd-cursor-image .sd-cursor{border-color:#60adb8;background:rgba(96,173,184,.025)}
  html.sd-cursor-image .sd-cursor::after{background:#60adb8}
}

@media (max-width:680px){
  .sd-lightbox{padding:44px 16px 34px}
  .sd-lightbox-inner{width:100%;height:86vh}
}
@media (prefers-reduced-motion:reduce){.sd-cursor{display:none!important}}

@media print{
  .resume-build-page .resume-header{
    top:.34in!important;
    left:.24in!important;
    right:.64in!important;
    width:auto!important;
    display:flex!important;
    align-items:flex-start!important;
    justify-content:space-between!important;
    gap:.22in!important;
    text-align:left!important;
    margin:0!important;
  }
  .resume-build-page .resume-name{font-size:22.5pt!important;line-height:1!important;white-space:nowrap!important}
  .resume-build-page .resume-contact{margin:0!important;text-align:right!important;font-size:9.5pt!important;line-height:1.22!important}
  .resume-build-page .resume-grid{padding-top:1.12in!important}
  .sd-cursor,.sd-lightbox{display:none!important}
}
`;
    document.head.appendChild(style);
  }

  function replaceCopy(value){
    var exact=[
      ['I’m a front-end developer and multidisciplinary designer with professional experience in responsive websites, email development, interface work, digital campaigns and production design. This version of the portfolio puts the project structure and my role ahead of a long technology list.',
       'Front-end development and multidisciplinary design experience includes responsive websites, email development, interface implementation, digital campaigns and production design. The portfolio emphasizes project structure, documented responsibilities and surviving evidence ahead of a long technology list.'],
      ['For current interface work, I think through the information and constraints first, establish reusable behavior, build responsively, and then review the result across devices and states.',
       'Current interface work begins with information and constraints, establishes reusable behavior, moves into responsive implementation, and finishes with review across devices and states.'],
      ['My background overlaps disciplines that are often separated between development and design teams.',
       'Experience spans disciplines often separated between development and design teams.'],
      ['My corporate development work centered on front-end and email production for conference and medical-education systems, including responsive websites, dynamic agenda/interface features and high-volume campaign email. Independent design work expanded that into branding, publications, events and production.',
       'Corporate development work centered on front-end and email production for conference and medical-education systems, including responsive websites, dynamic agenda/interface features and high-volume campaign email. Independent design work expanded that experience into branding, publications, events and production.'],
      ['I’m refreshing the workflow around the tooling expected in current web teams while keeping the practical production experience gained from client and corporate work.',
       'Current re-entry work refreshes the workflow around tooling expected in modern web teams while retaining practical production experience from client and corporate work.'],
      ['My strongest fit is work that benefits from both implementation awareness and visual judgment.',
       'Strongest-fit roles benefit from both implementation awareness and visual judgment.'],
      ['What I bring to a team','Professional strengths'],
      ['I consider responsive behavior, content changes, production constraints and maintainability instead of treating an interface as a static mockup.',
       'Responsive behavior, content changes, production constraints and maintainability are considered as part of implementation rather than treating an interface as a static mockup.'],
      ['My background spans development, email and visual design, so I’m comfortable translating between technical requirements and visual intent.',
       'Experience across development, email and visual design supports translation between technical requirements and visual intent.'],
      ['I’m actively modernizing my front-end workflow while bringing forward the practical production experience gained from client and corporate projects.',
       'Current practice modernizes the front-end workflow while carrying forward practical production experience gained from client and corporate projects.'],
      ['Older technologies are shown in the historical context of the projects that used them. Current development practice is identified separately rather than presenting every legacy tool as part of my present-day stack.',
       'Older technologies are shown in the historical context of the projects that used them. Current development practice is identified separately rather than presenting every legacy tool as part of the present-day stack.'],
      ['View my portfolio at www.sdelgado.com','Portfolio · www.sdelgado.com'],
      ['After several years focused on independent design, tutoring and studio practice, I am actively modernizing my development workflow around JavaScript/TypeScript, React, APIs, Docker and current database tooling while bringing forward production experience from corporate and client work.',
       'After several years focused on independent design, tutoring and studio practice, current re-entry work centers on JavaScript/TypeScript, React, APIs, Docker and current database tooling while carrying forward production experience from corporate and client work.']
    ];
    exact.forEach(function(pair){value=value.split(pair[0]).join(pair[1]);});

    var positioning=[
      ['Front-End Development · UI/UX · Digital Design','Front-End Development · Email · Digital Design'],
      ['UX / UI lens','Interface & implementation'],
      ['UI / interface work','Interface implementation'],
      ['UI / interface design','Web / interface design'],
      ['Web / UI development','Web development'],
      ['Web / UI','Web / Interface'],
      ['Responsive UI','Responsive interfaces'],
      ['responsive UI','responsive interfaces'],
      ['UI implementation','Interface implementation'],
      ['UI / UX','Web / interface design'],
      ['component-based UI','component-based front end'],
      ['Interactive UI states','Interactive interface states'],
      ['UX/UI evidence','interface evidence'],
      ['UI case study','front-end case study'],
      ['UX research','user research']
    ];
    positioning.forEach(function(pair){value=value.split(pair[0]).join(pair[1]);});

    value=value
      .replace(/\bI’m\b|\bI'm\b/g,'Susan Delgado is')
      .replace(/\bI am\b/g,'Susan Delgado is')
      .replace(/\bI’ve\b|\bI've\b/g,'Susan Delgado has')
      .replace(/\bI have\b/g,'Susan Delgado has')
      .replace(/\bmy\b/gi,"Susan Delgado's")
      .replace(/\bme\b/gi,'Susan Delgado')
      .replace(/\bI\b/g,'Susan Delgado');
    return value;
  }

  function normalizeCopy(root){
    root=root||document;
    var scope=root.body||root;
    var walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT,{
      acceptNode:function(node){
        var parent=node.parentElement;
        if(!parent||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(parent.tagName))return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      if(normalizedNodes.has(node))return;
      var next=replaceCopy(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
      normalizedNodes.add(node);
    });

    if(document.title.indexOf('UI/UX')!==-1){
      document.title=document.title.replace('Front-End Development, UI/UX & Design','Front-End Development, Web & Digital Design').replace(/UI\/UX/g,'Web');
    }
    var description=document.querySelector('meta[name="description"]');
    if(description){
      description.content=description.content.replace(/UI\/UX/g,'interface work').replace(/UI \/ interface design/g,'web and interface design');
    }

    document.querySelectorAll('.resume-cert-list li').forEach(function(item){
      if(item.textContent.indexOf('Foundations of User Experience (UX) Design')!==-1)item.remove();
    });
    document.querySelectorAll('.resume-entry-title').forEach(function(title){
      if(title.textContent.indexOf('CUNY Baccalaureate for Unique & Interdisciplinary Studies')!==-1){
        var entry=title.closest('.resume-entry');
        if(entry)entry.remove();
      }
    });
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
        var pills=group.querySelector('.build-pills');
        if(pills){
          var categoryOrder=['conf','web','email','dig','print','brand'];
          var categoryLinks=Array.prototype.slice.call(pills.querySelectorAll('a.build-pill'));
          categoryLinks.forEach(function(link){
            var href=link.getAttribute('href')||'';
            link.setAttribute('href',href.replace('#archive','#additional-professional-work'));
          });
          categoryLinks.sort(function(a,b){
            function token(link){
              try{return new URL(link.getAttribute('href'),location.href).searchParams.get('type')||'';}catch(e){return '';}
            }
            var ai=categoryOrder.indexOf(token(a));
            var bi=categoryOrder.indexOf(token(b));
            return (ai<0?999:ai)-(bi<0?999:bi);
          }).forEach(function(link){pills.appendChild(link);});
        }
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
    if(/\/work-build\.html$/.test(location.pathname)&&location.hash==='#additional-professional-work'&&archiveHeading){
      requestAnimationFrame(function(){archiveHeading.scrollIntoView({block:'start'});});
    }
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

  function sanitizeEvidenceHtml(html,id){
    if(!html)return html;
    if(unsupportedAngularPosts.has(String(id))){
      html=html
        .replace(/AngularJS-based\s+/gi,'')
        .replace(/\bAngularJS,\s*/gi,'')
        .replace(/,\s*AngularJS\b/gi,'')
        .replace(/\band AngularJS\b/gi,'')
        .replace(/\bAngularJS\b/gi,'');
    }
    if(String(id)==='16'){
      html=html.replace(/,\s*including an independently developed animation module using animate\.css to enrich the interface and transitions\./i,'.');
    }
    return html.replace(/\s{2,}/g,' ');
  }

  function removeUnsupportedAngular(root){
    root=root||document;
    if(/\/work-build\.html$/.test(location.pathname)){
      root.querySelectorAll('.build-project-card,.build-archive-card').forEach(function(card){
        var link=card.querySelector('a[href*="showcase-build.html?post="]');
        var id=postIdFromLink(link);
        if(id==='11'){
          card.remove();
          return;
        }
        if(unsupportedAngularPosts.has(id)){
          var skills=String(card.dataset.skills||'').split('||').filter(function(skill){return skill!=='angular'&&skill!=='angularjs';});
          card.dataset.skills=skills.join('||');
        }
      });
    }

    if(/\/showcase-build\.html$/.test(location.pathname)){
      var id=getPostId();
      root.querySelectorAll('.build-case-nav-link[href*="post=11"]').forEach(function(link){link.remove();});
      if(unsupportedAngularPosts.has(id)){
        root.querySelectorAll('.build-case-taxonomy-group').forEach(function(group){
          var label=group.querySelector('.build-case-taxonomy-label');
          if(!label||label.textContent.trim()!=='Skills')return;
          group.querySelectorAll('.build-pill').forEach(function(pill){
            if(/^Angular(?:JS)?$/i.test(pill.textContent.trim()))pill.remove();
          });
        });
        var narrative=document.getElementById('caseNarrative');
        if(narrative&&narrative.innerHTML){
          var clean=sanitizeEvidenceHtml(narrative.innerHTML,id);
          if(clean!==narrative.innerHTML)narrative.innerHTML=clean;
        }
        if(id==='16'){
          document.querySelectorAll('#systemGrid .node p').forEach(function(p){
            p.textContent=p.textContent.replace(/,\s*Bootstrap and Angular/,' and Bootstrap').replace(/Bootstrap and Angular/,'Bootstrap');
          });
        }
      }
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

  function restoreCaseNarrative(){
    if(!/\/showcase-build\.html$/.test(location.pathname))return;
    var id=getPostId();
    if(!id||id==='11')return;
    var narrative=document.getElementById('caseNarrative');
    if(!narrative)return;

    if(!correctionsPromise){
      correctionsPromise=fetch('/js/posts-corrections.json')
        .then(function(r){return r.ok?r.json():{};})
        .catch(function(){return {};});
    }
    correctionsPromise.then(function(data){
      var correction=data&&data.overrides&&data.overrides[String(id)];
      if(correction&&correction.content){
        var corrected=sanitizeEvidenceHtml(correction.content,id);
        if(narrative.dataset.sdCorrected!==id){
          narrative.innerHTML=corrected;
          narrative.dataset.sdCorrected=id;
        }
      }
      if((id==='17'||id==='21')&&!narrative.querySelector('.sd-fellows-component-note')){
        var note=document.createElement('p');
        note.className='sd-fellows-component-note';
        note.textContent='The site also included a selectable content component that updated both the featured image and the corresponding explanatory text in place as visitors moved between topics.';
        narrative.appendChild(note);
      }
      normalizeCopy(narrative);
      removeUnsupportedAngular(document);
    });
  }

  function addFellowsInteraction(){
    var id=getPostId();
    if(id!=='17'&&id!=='21')return;
    var section=document.getElementById('uxSection');
    var title=document.getElementById('uxTitle');
    var intro=document.getElementById('uxIntro');
    var panels=document.getElementById('uxPanels');
    if(!section||!title||!intro||!panels)return;
    if(section.dataset.sdFellows==='1')return;
    title.textContent='Selectable conference content component';
    intro.textContent='The Fellows interface let visitors move between conference topics without leaving the page.';
    panels.innerHTML=
      '<article class="build-panel"><h3>Coordinated content switching</h3><p>Selecting an item updated both the featured image and the corresponding explanatory text in place.</p></article>'+
      '<article class="build-panel"><h3>In-page topic navigation</h3><p>The interaction kept the visual reference and related information paired while visitors moved between topics.</p></article>';
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
      if(remaining.length===2){
        remaining.forEach(function(child){
          child.className='col-lg-6 col-md-6 col-sm-12';
        });
      }
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
      var image=box.querySelector('img');
      image.removeAttribute('src');
      if(currentLightboxTrigger&&document.contains(currentLightboxTrigger))currentLightboxTrigger.focus({preventScroll:true});
      currentLightboxTrigger=null;
    }

    box.addEventListener('click',function(event){
      if(event.target===box||event.target.closest('.sd-lightbox-close'))close();
    });
    document.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&!box.hidden)close();
    });
    box.sdClose=close;
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
      img.addEventListener('click',function(event){
        event.preventDefault();
        event.stopPropagation();
        openLightbox(img);
      });
      img.addEventListener('keydown',function(event){
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();
          openLightbox(img);
        }
      });
    });
  }

  function runPortfolioFixes(root){
    if(removePostEleven())return;
    normalizePortfolioNavigation(root||document);
    removeUnsupportedAngular(root||document);
    cleanWinterBallPreview();
    addFellowsInteraction();
    restoreCaseNarrative();
    bindLightboxImages(root||document);
  }

  function installPortfolioObserver(){
    if(portfolioObserverInstalled||!window.MutationObserver)return;
    var targets=[
      document.getElementById('caseHero'),
      document.getElementById('caseNavTop'),
      document.getElementById('caseNavBottom'),
      document.getElementById('caseNarrative'),
      document.getElementById('uxSection'),
      document.getElementById('projectPreview'),
      document.getElementById('projectArchive'),
      document.getElementById('archiveFilterStatus')
    ].filter(Boolean);
    if(!targets.length)return;
    portfolioObserverInstalled=true;
    var queued=false;
    var observer=new MutationObserver(function(){
      if(queued)return;
      queued=true;
      requestAnimationFrame(function(){
        queued=false;
        normalizeCopy(document);
        runPortfolioFixes(document);
      });
    });
    targets.forEach(function(target){observer.observe(target,{childList:true,subtree:true});});
  }

  function initBuildMotion(root){
    ensureStylesheets();
    installStyles();
    normalizeCopy(root||document);
    runPortfolioFixes(root||document);
    installPortfolioObserver();
  }

  function initCursor(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!window.matchMedia('(pointer:fine) and (hover:hover)').matches)return;
    if(document.querySelector('.sd-cursor'))return;

    installStyles();
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

    document.addEventListener('pointerleave',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-image');
      lastMode='';
    });
    window.addEventListener('blur',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-image');
      lastMode='';
    });
  }

  window.initBuildMotion=initBuildMotion;
  window.normalizeBuildCopy=normalizeCopy;

  function init(){
    ensureStylesheets();
    installStyles();
    normalizeCopy(document);
    runPortfolioFixes(document);
    installPortfolioObserver();
    initCursor();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();