(function(){
  'use strict';

  var STYLE_ID='sd-build-interactions';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
/* Technical build interaction layer: deliberately lightweight. */
@media (prefers-reduced-motion:no-preference){
  .build-page .build-reveal{
    opacity:0;
    transition:
      opacity .38s ease-out,
      transform .5s cubic-bezier(.2,.72,.24,1);
    transition-delay:var(--reveal-delay,0ms);
    will-change:opacity,transform;
  }
  .build-page .build-reveal.build-motion-up{transform:translate3d(0,18px,0)}
  .build-page .build-reveal.build-motion-left{transform:translate3d(-24px,8px,0)}
  .build-page .build-reveal.build-motion-right{transform:translate3d(24px,8px,0)}
  .build-page .build-reveal.build-motion-soft{transform:translate3d(0,12px,0) scale(.992)}
  .build-page .build-reveal.is-visible{
    opacity:1;
    transform:translate3d(0,0,0) scale(1);
  }
  .build-display.build-reveal,
  .build-case-title.build-reveal{transition-duration:.58s}

  .build-project-image img,
  .build-case-visual img{
    transition:transform .32s cubic-bezier(.2,.72,.24,1),opacity .22s ease;
  }
  .build-project-image:hover img{transform:scale(1.015)}
  .build-project-card,
  .build-archive-card,
  .build-panel,
  .build-process-step,
  .build-cap-card{
    transition:transform .24s ease-out,box-shadow .24s ease,border-color .2s ease;
  }
  .build-project-card:hover,
  .build-archive-card:hover{transform:translateY(-3px)}
  .build-link-list a span:last-child{transition:transform .22s ease-out}
  .build-link-list a:hover span:last-child{transform:translateX(4px)}
}

@media (pointer:fine) and (hover:hover){
  html.sd-cursor-enabled,
  html.sd-cursor-enabled body,
  html.sd-cursor-enabled a,
  html.sd-cursor-enabled button,
  html.sd-cursor-enabled [role="button"]{cursor:none!important}

  .sd-cursor-dot,
  .sd-cursor-ring{
    position:fixed;
    z-index:2147483646;
    top:0;
    left:0;
    pointer-events:none;
    opacity:0;
    transform:translate3d(-100px,-100px,0);
  }
  .sd-cursor-dot{
    width:6px;
    height:6px;
    margin:-3px 0 0 -3px;
    border-radius:50%;
    background:#111;
    transition:opacity .12s ease,background .16s ease;
  }
  .sd-cursor-ring{
    width:32px;
    height:32px;
    margin:-16px 0 0 -16px;
    border:1px solid rgba(17,17,17,.42);
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#111;
    background:transparent;
    font-family:proxima-nova,"Open Sans",sans-serif;
    font-size:8px;
    font-weight:700;
    letter-spacing:.08em;
    text-transform:uppercase;
    transition:
      transform .09s ease-out,
      width .2s ease-out,
      height .2s ease-out,
      margin .2s ease-out,
      border-color .18s ease,
      background .18s ease,
      color .18s ease,
      opacity .12s ease;
  }
  html.sd-cursor-live .sd-cursor-dot,
  html.sd-cursor-live .sd-cursor-ring{opacity:1}
  html.sd-cursor-link .sd-cursor-dot{background:#f70606}
  html.sd-cursor-link .sd-cursor-ring{
    width:44px;
    height:44px;
    margin:-22px 0 0 -22px;
    border-color:#f70606;
    background:rgba(247,6,6,.04);
  }
  html.sd-cursor-view .sd-cursor-dot{opacity:0}
  html.sd-cursor-view .sd-cursor-ring{
    width:58px;
    height:58px;
    margin:-29px 0 0 -29px;
    border-color:#60adb8;
    background:rgba(255,255,255,.94);
    color:#111;
    box-shadow:0 4px 18px rgba(0,0,0,.07);
  }
}

@media (prefers-reduced-motion:reduce){
  .build-page .build-reveal{
    opacity:1!important;
    transform:none!important;
    transition:none!important;
  }
  .sd-cursor-dot,.sd-cursor-ring{display:none!important}
}
`;
    document.head.appendChild(style);
  }

  function normalizePositioning(root){
    if(document.documentElement.dataset.positioningNormalized==='1')return;
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

    var walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT,{
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
    document.documentElement.dataset.positioningNormalized='1';
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
    normalizePositioning(document);

    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

    var selectors=[
      '.build-hero .build-kicker',
      '.build-hero .build-display',
      '.build-hero .build-lede',
      '.build-hero .build-actions',
      '.build-case-hero .build-back',
      '.build-case-title',
      '.build-case-summary',
      '.build-case-meta',
      '.build-case-visual',
      '.build-section-head > div',
      '.build-project-card',
      '.build-archive-card',
      '.build-process-step',
      '.build-cap-card',
      '.build-panel',
      '.build-architecture .node',
      '.build-deliverable',
      '.build-contact-card',
      '.build-contact-note'
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
          window.setTimeout(function(){entry.target.style.willChange='auto';},560);
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.06,rootMargin:'0px 0px -3% 0px'});

    items.forEach(function(el,index){
      el.dataset.motionReady='1';
      el.classList.add('build-reveal',motionVariant(el,index));
      el.style.setProperty('--reveal-delay',Math.min((index%3)*40,80)+'ms');
      observer.observe(el);
    });
  }

  function initCursor(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(!window.matchMedia('(pointer:fine) and (hover:hover)').matches)return;
    if(document.querySelector('.sd-cursor-ring'))return;

    installStyles();

    var dot=document.createElement('div');
    var ring=document.createElement('div');
    dot.className='sd-cursor-dot';
    ring.className='sd-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('sd-cursor-enabled');

    var nextX=-100,nextY=-100,raf=0,lastMode='';

    function paint(){
      dot.style.transform='translate3d('+nextX+'px,'+nextY+'px,0)';
      ring.style.transform='translate3d('+nextX+'px,'+nextY+'px,0)';
      raf=0;
    }

    function setMode(target){
      var view=target&&target.closest&&target.closest('.build-project-image,.build-case-visual,.build-preview-stack a');
      var link=target&&target.closest&&target.closest('a,button,[role="button"]');
      var mode=view?'view':(link?'link':'');
      if(mode===lastMode)return;
      lastMode=mode;
      document.documentElement.classList.toggle('sd-cursor-view',mode==='view');
      document.documentElement.classList.toggle('sd-cursor-link',mode==='link');
      ring.textContent=mode==='view'?'View':'';
    }

    document.addEventListener('pointermove',function(event){
      nextX=event.clientX;
      nextY=event.clientY;
      document.documentElement.classList.add('sd-cursor-live');
      setMode(event.target);
      if(!raf)raf=requestAnimationFrame(paint);
    },{passive:true});

    document.addEventListener('pointerleave',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-view');
      lastMode='';
      ring.textContent='';
    });
    window.addEventListener('blur',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-view');
      lastMode='';
      ring.textContent='';
    });
  }

  window.initBuildMotion=initBuildMotion;

  function init(){
    normalizePositioning(document);
    initBuildMotion(document);
    initCursor();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
