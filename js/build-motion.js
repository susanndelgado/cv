(function(){
  'use strict';

  var STYLE_ID='sd-build-interactions';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
/* Technical build interaction layer: motion and cursor only. */
@media (prefers-reduced-motion:no-preference){
  .build-page .build-reveal{
    opacity:0;
    transition:
      opacity .78s cubic-bezier(.2,.68,.2,1),
      transform .92s cubic-bezier(.16,.8,.22,1);
    transition-delay:var(--reveal-delay,0ms);
    will-change:opacity,transform;
  }
  .build-page .build-reveal.build-motion-up{transform:translate3d(0,34px,0)}
  .build-page .build-reveal.build-motion-left{transform:translate3d(-42px,18px,0)}
  .build-page .build-reveal.build-motion-right{transform:translate3d(42px,18px,0)}
  .build-page .build-reveal.build-motion-soft{transform:translate3d(0,22px,0) scale(.985)}
  .build-page .build-reveal.is-visible{
    opacity:1;
    transform:translate3d(0,0,0) scale(1);
  }

  .build-project-image img,
  .build-case-visual img,
  .build-preview-stack img{
    transition:transform .85s cubic-bezier(.16,.8,.22,1),opacity .35s ease;
  }
  .build-project-image:hover img{transform:scale(1.025)}
  .build-project-card,
  .build-archive-card,
  .build-panel,
  .build-process-step,
  .build-cap-card{
    transition:transform .45s cubic-bezier(.16,.8,.22,1),box-shadow .45s ease,border-color .35s ease;
  }
  .build-project-card:hover,
  .build-archive-card:hover{
    transform:translateY(-5px);
  }
  .build-link-list a span:last-child{
    transition:transform .35s cubic-bezier(.16,.8,.22,1);
  }
  .build-link-list a:hover span:last-child{transform:translateX(6px)}

  .build-kicker.build-reveal{letter-spacing:.12em}
  .build-display.build-reveal,
  .build-case-title.build-reveal{
    transition-duration:1.02s;
  }
}

@media (pointer:fine) and (hover:hover){
  html.sd-cursor-enabled,
  html.sd-cursor-enabled body,
  html.sd-cursor-enabled a,
  html.sd-cursor-enabled button,
  html.sd-cursor-enabled [role="button"]{
    cursor:none!important;
  }
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
    transition:opacity .18s ease,background .2s ease,transform .08s linear;
  }
  .sd-cursor-ring{
    width:34px;
    height:34px;
    margin:-17px 0 0 -17px;
    border:1px solid rgba(17,17,17,.48);
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#111;
    background:rgba(255,255,255,0);
    font-family:proxima-nova,"Open Sans",sans-serif;
    font-size:8px;
    font-weight:700;
    letter-spacing:.08em;
    text-transform:uppercase;
    transition:
      width .28s cubic-bezier(.16,.8,.22,1),
      height .28s cubic-bezier(.16,.8,.22,1),
      margin .28s cubic-bezier(.16,.8,.22,1),
      border-color .25s ease,
      background .25s ease,
      color .25s ease,
      opacity .18s ease;
  }
  html.sd-cursor-live .sd-cursor-dot,
  html.sd-cursor-live .sd-cursor-ring{opacity:1}
  html.sd-cursor-link .sd-cursor-dot{background:#f70606}
  html.sd-cursor-link .sd-cursor-ring{
    width:48px;
    height:48px;
    margin:-24px 0 0 -24px;
    border-color:#f70606;
    background:rgba(247,6,6,.055);
  }
  html.sd-cursor-view .sd-cursor-dot{opacity:0}
  html.sd-cursor-view .sd-cursor-ring{
    width:64px;
    height:64px;
    margin:-32px 0 0 -32px;
    border-color:#60adb8;
    background:rgba(255,255,255,.92);
    color:#111;
    box-shadow:0 6px 24px rgba(0,0,0,.08);
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

  function motionVariant(el,index){
    if(el.matches('.build-project-card,.build-archive-card,.build-case-visual')){
      return index%2===0?'build-motion-left':'build-motion-right';
    }
    if(el.matches('.build-panel,.build-process-step,.build-cap-card,.build-architecture .node,.build-deliverable')){
      return 'build-motion-soft';
    }
    return 'build-motion-up';
  }

  function initBuildMotion(root){
    root=root||document;
    installStyles();

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
      '.build-contact-note',
      '.build-link-list a',
      '.build-preview-stack > *'
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
    },{threshold:.1,rootMargin:'0px 0px -8% 0px'});

    items.forEach(function(el,index){
      el.dataset.motionReady='1';
      el.classList.add('build-reveal',motionVariant(el,index));
      el.style.setProperty('--reveal-delay',Math.min((index%5)*65,260)+'ms');
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

    var mouseX=-100,mouseY=-100,ringX=-100,ringY=-100;
    var raf=0;

    function draw(){
      ringX+=(mouseX-ringX)*.18;
      ringY+=(mouseY-ringY)*.18;
      dot.style.transform='translate3d('+mouseX+'px,'+mouseY+'px,0)';
      ring.style.transform='translate3d('+ringX+'px,'+ringY+'px,0)';
      raf=requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove',function(event){
      mouseX=event.clientX;
      mouseY=event.clientY;
      document.documentElement.classList.add('sd-cursor-live');
    },{passive:true});

    document.addEventListener('mouseover',function(event){
      var target=event.target.closest('a,button,[role="button"]');
      var view=event.target.closest('.build-project-image,.build-case-visual,.build-preview-stack a');
      document.documentElement.classList.toggle('sd-cursor-link',!!target);
      document.documentElement.classList.toggle('sd-cursor-view',!!view);
      ring.textContent=view?'View':'';
    });

    document.addEventListener('mouseout',function(event){
      if(!event.relatedTarget){
        document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-view');
        ring.textContent='';
      }
    });

    window.addEventListener('blur',function(){
      document.documentElement.classList.remove('sd-cursor-live','sd-cursor-link','sd-cursor-view');
    });

    if(!raf)draw();
  }

  window.initBuildMotion=initBuildMotion;

  function init(){
    initBuildMotion(document);
    initCursor();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
