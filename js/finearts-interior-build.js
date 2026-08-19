(function(){
  'use strict';
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