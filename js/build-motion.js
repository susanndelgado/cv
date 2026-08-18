(function(){
  'use strict';

  var STYLE_ID='sd-build-interactions';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
/* Build corrections + lightweight motion. */
.build-hero .build-kicker{
  font-weight:400!important;
}

/* The case-study hero is light in the review build, so its metadata must use
   dark readable values rather than the white values from the original dark hero. */
.build-case-meta{
  color:#343a40!important;
  background:rgba(255,255,255,.94)!important;
  border-color:#dddddd!important;
}
.build-case-meta dt{
  color:#60adb8!important;
}
.build-case-meta dd{
  color:#343a40!important;
}
.build-case-meta div+div{
  border-top-color:#e2e2e2!important;
}
.build-case-hero .build-back{
  color:#6c757d!important;
}
.build-case-hero .build-back:hover,
.build-case-hero .build-back:focus-visible{
  color:#f70606!important;
}

/* Resume header: mirror the original horizontal treatment — name on the left,
   contact information on the right, with enough space before the first section. */
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
.resume-build-page .resume-grid{
  padding-top:1.12in!important;
}
.resume-build-page .resume-sidebar .resume-heading{
  line-height:1.06!important;
}

@media (prefers-reduced-motion:no-preference){
  .build-page:not(.resume-build-page) .build-reveal{
    opacity:0;
    transition:opacity .28s ease-out,transform .36s cubic-bezier(.2,.72,.24,1);
    transition-delay:var(--reveal-delay,0ms);
  }
  .build-page:not(.resume-build-page) .build-reveal.build-motion-up{transform:translate3d(0,12px,0)}
  .build-page:not(.resume-build-page) .build-reveal.build-motion-left{transform:translate3d(-16px,5px,0)}
  .build-page:not(.resume-build-page) .build-reveal.build-motion-right{transform:translate3d(16px,5px,0)}
  .build-page:not(.resume-build-page) .build-reveal.build-motion-soft{transform:translate3d(0,8px,0)}
  .build-page:not(.resume-build-page) .build-reveal.is-visible{
    opacity:1;
    transform:none;
  }
  .build-project-image img,
  .build-case-visual img{
    transition:transform .2s ease-out,opacity .18s ease;
  }
  .build-project-image:hover img{transform:scale(1.01)}
  .build-project-card,
  .build-archive-card{
    transition:transform .18s ease-out,box-shadow .18s ease;
  }
  .build-project-card:hover,
  .build-archive-card:hover{transform:translateY(-2px)}
}

@media (prefers-reduced-motion:reduce){
  .build-page .build-reveal{
    opacity:1!important;
    transform:none!important;
    transition:none!important;
  }
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
  .resume-build-page .resume-name{
    font-size:22.5pt!important;
    line-height:1!important;
    white-space:nowrap!important;
  }
  .resume-build-page .resume-contact{
    margin:0!important;
    text-align:right!important;
    font-size:9.5pt!important;
    line-height:1.22!important;
  }
  .resume-build-page .resume-grid{
    padding-top:1.12in!important;
  }
}
`;
    document.head.appendChild(style);
  }

  function normalizePositioning(root){
    root=root||document;

    if(document.title.indexOf('UI/UX')!==-1){
      document.title=document.title.replace('Front-End Development, UI/UX & Design','Front-End Development, Web & Digital Design').replace(/UI\/UX/g,'Web');
    }

    var description=document.querySelector('meta[name="description"]');
    if(description){
      description.content=description.content
        .replace(/UI\/UX/g,'interface work')
        .replace(/UI \/ interface design/g,'web and interface design');
    }

    var replacements=[
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
      var value=node.nodeValue;
      replacements.forEach(function(pair){value=value.split(pair[0]).join(pair[1]);});
      if(value!==node.nodeValue)node.nodeValue=value;
    });

    document.querySelectorAll('.resume-cert-list li').forEach(function(item){
      if(item.textContent.indexOf('Foundations of User Experience (UX) Design')!==-1)item.remove();
    });

    /* CUNY Baccalaureate was attended for two semesters but the degree was not
       completed. Omit it rather than presenting an unfinished program as a degree. */
    document.querySelectorAll('.resume-entry').forEach(function(entry){
      if(entry.textContent.indexOf('CUNY Baccalaureate for Unique & Interdisciplinary Studies')!==-1){
        entry.remove();
      }
    });
  }

  function motionVariant(el,index){
    if(el.matches('.build-project-card,.build-archive-card,.build-case-visual')){
      return index%2===0?'build-motion-left':'build-motion-right';
    }
    if(el.matches('.build-panel,.build-process-step,.build-cap-card,.build-architecture .node,.build-deliverable,.build-contact-card')){
      return 'build-motion-soft';
    }
    return 'build-motion-up';
  }

  function initBuildMotion(root){
    root=root||document;
    installStyles();
    normalizePositioning(root===document?document:root);

    if(document.body&&document.body.classList.contains('resume-build-page'))return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

    var selectors=[
      '.build-hero .build-kicker',
      '.build-hero .build-display',
      '.build-hero .build-lede',
      '.build-hero .build-actions',
      '.build-case-title',
      '.build-case-summary',
      '.build-case-meta',
      '.build-case-visual',
      '.build-section-head > div',
      '.build-project-card',
      '.build-archive-card',
      '.build-panel',
      '.build-process-step',
      '.build-cap-card'
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
    },{threshold:.03,rootMargin:'0px 0px 2% 0px'});

    items.forEach(function(el,index){
      el.dataset.motionReady='1';
      el.classList.add('build-reveal',motionVariant(el,index));
      el.style.setProperty('--reveal-delay',Math.min((index%2)*24,24)+'ms');
      observer.observe(el);
    });
  }

  window.initBuildMotion=initBuildMotion;

  function init(){
    installStyles();
    normalizePositioning(document);
    initBuildMotion(document);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();