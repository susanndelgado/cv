(function(){
  'use strict';

  var STYLE_ID='sd-build-interactions';
  var normalizedNodes=new WeakSet();

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
/* Technical build corrections + restrained motion. */
.build-hero .build-kicker{font-weight:400!important}

.build-case-meta{
  color:#343a40!important;
  background:rgba(255,255,255,.94)!important;
  border-color:#ddd!important;
}
.build-case-meta dt{color:#60adb8!important}
.build-case-meta dd{color:#343a40!important}
.build-case-meta div+div{border-top-color:#e2e2e2!important}
.build-case-hero .build-back{color:#6c757d!important}
.build-case-hero .build-back:hover,
.build-case-hero .build-back:focus-visible{color:#f70606!important}

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

/* Only major structural text reveals. Image grids, project cards, panels,
   workflow blocks and case-study evidence remain static while scrolling. */
@media (prefers-reduced-motion:no-preference){
  .build-page:not(.resume-build-page) .build-reveal{
    opacity:0;
    transform:translate3d(0,10px,0);
    transition:opacity .26s ease-out,transform .32s cubic-bezier(.2,.72,.24,1);
    transition-delay:var(--reveal-delay,0ms);
  }
  .build-page:not(.resume-build-page) .build-reveal.is-visible{
    opacity:1;
    transform:none;
  }
  .build-project-image img,
  .build-case-visual img{transition:opacity .16s ease}
  .build-project-image:hover img{opacity:.96}
}

/* Lightweight direct-tracking cursor: one element, no RAF loop and no lagging trail. */
@media (pointer:fine) and (hover:hover){
  html.sd-cursor-enabled,
  html.sd-cursor-enabled body,
  html.sd-cursor-enabled a,
  html.sd-cursor-enabled button,
  html.sd-cursor-enabled [role="button"]{cursor:none!important}
  .sd-cursor{
    position:fixed;
    z-index:2147483646;
    left:-100px;
    top:-100px;
    width:26px;
    height:26px;
    transform:translate(-50%,-50%);
    border:1px solid rgba(17,17,17,.48);
    border-radius:50%;
    pointer-events:none;
    opacity:0;
    transition:width .14s ease,height .14s ease,border-color .14s ease,background .14s ease,opacity .1s ease;
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
  html.sd-cursor-link .sd-cursor{
    width:34px;
    height:34px;
    border-color:#f70606;
    background:rgba(247,6,6,.025);
  }
  html.sd-cursor-link .sd-cursor::after{background:#f70606}
  html.sd-cursor-image .sd-cursor{
    width:38px;
    height:38px;
    border-color:#60adb8;
    background:rgba(96,173,184,.025);
  }
  html.sd-cursor-image .sd-cursor::after{background:#60adb8}
}

@media (prefers-reduced-motion:reduce){
  .build-page .build-reveal{opacity:1!important;transform:none!important;transition:none!important}
  .sd-cursor{display:none!important}
}

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
      ['I bring professional front-end and email development experience together with graphic design, interface work and production experience. I’m interested in remote development and design roles where that combination is useful.',
       'Professional front-end and email development experience is combined with graphic design, interface implementation and production work, with a focus on remote development and design roles where that range is useful.'],
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

    /* Fallback for legacy project fragments that still contain first-person copy. */
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

  function initBuildMotion(root){
    root=root||document;
    installStyles();
    normalizeCopy(root);

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(document.body.classList.contains('resume-build-page'))return;

    var selectors=[
      '.build-hero .build-kicker',
      '.build-hero .build-display',
      '.build-hero .build-lede',
      '.build-hero .build-actions',
      '.build-case-hero .build-back',
      '.build-case-title',
      '.build-section-head > div'
    ];
    var items=[];
    selectors.forEach(function(selector){
      root.querySelectorAll(selector).forEach(function(el){
        if(items.indexOf(el)===-1&&!el.dataset.motionReady&&!el.hidden)items.push(el);
      });
    });

    if(!('IntersectionObserver' in window)){
      items.forEach(function(el){el.classList.add('is-visible');});
      return;
    }

    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.04,rootMargin:'0px 0px -2% 0px'});

    items.forEach(function(el,index){
      el.dataset.motionReady='1';
      el.classList.add('build-reveal');
      el.style.setProperty('--reveal-delay',Math.min((index%2)*30,30)+'ms');
      observer.observe(el);
    });
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

    function setMode(target){
      var image=target&&target.closest&&target.closest('.build-project-image,.build-case-visual,.build-preview-stack a');
      var link=target&&target.closest&&target.closest('a,button,[role="button"]');
      document.documentElement.classList.toggle('sd-cursor-image',!!image);
      document.documentElement.classList.toggle('sd-cursor-link',!!link&&!image);
    }

    document.addEventListener('pointermove',function(event){
      cursor.style.left=event.clientX+'px';
      cursor.style.top=event.clientY+'px';
      document.documentElement.classList.add('sd-cursor-live');
      setMode(event.target);
    },{passive:true});

    document.addEventListener('pointerleave',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-image');
    });
    window.addEventListener('blur',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-image');
    });
  }

  window.initBuildMotion=initBuildMotion;
  window.normalizeBuildCopy=normalizeCopy;

  function init(){
    installStyles();
    normalizeCopy(document);
    initBuildMotion(document);
    initCursor();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
