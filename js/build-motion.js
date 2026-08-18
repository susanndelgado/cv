(function(){
  'use strict';

  var STYLE_ID='sd-build-interactions';
  var normalizedNodes=new WeakSet();
  var portfolioObserverInstalled=false;

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
   image-heavy technical sections. The cursor remains as the interaction accent. */
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
  .sd-cursor{display:none!important}
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
       'Current practice modernizes the front-end workflow while carrying forward practical production experience from client and corporate projects.'],
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

  function installPortfolioObserver(){
    if(portfolioObserverInstalled||!window.MutationObserver)return;
    var targets=[
      document.getElementById('caseHero'),
      document.getElementById('caseNavTop'),
      document.getElementById('caseNavBottom'),
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
        normalizePortfolioNavigation(document);
      });
    });
    targets.forEach(function(target){observer.observe(target,{childList:true,subtree:true});});
  }

  function initBuildMotion(root){
    ensureStylesheets();
    installStyles();
    normalizeCopy(root||document);
    normalizePortfolioNavigation(root||document);
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
      var image=target&&target.closest&&target.closest('.build-project-image,.build-case-visual,.build-preview-stack a');
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
    normalizePortfolioNavigation(document);
    installPortfolioObserver();
    initCursor();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();