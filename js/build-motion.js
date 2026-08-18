(function(){
  if(!('IntersectionObserver' in window))return;

  var selectors=[
    '.build-section',
    '.build-project-card',
    '.build-archive-card',
    '.build-process-step',
    '.build-cap-card',
    '.build-panel',
    '.build-architecture .node',
    '.build-deliverable',
    '.art-build-preview main > section',
    '.art-build-preview .matte-item',
    '.art-build-preview .info-floating-box',
    '.art-build-preview .info-floating-box-dark',
    '.art-build-preview .white-resource-box'
  ];

  var items=[];
  selectors.forEach(function(selector){
    document.querySelectorAll(selector).forEach(function(el){
      if(items.indexOf(el)===-1)items.push(el);
    });
  });

  items.forEach(function(el,index){
    el.classList.add('build-reveal');
    el.style.setProperty('--reveal-delay',Math.min((index%4)*70,210)+'ms');
  });

  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -7% 0px'});

  items.forEach(function(el){observer.observe(el);});
})();
