(function(){
  'use strict';
  var frame=document.querySelector('.finearts-preview-frame');
  if(!frame)return;

  function resizeFrame(doc){
    if(!doc||!doc.documentElement)return;
    var height=Math.max(
      doc.documentElement.scrollHeight||0,
      doc.body?doc.body.scrollHeight:0,
      900
    );
    frame.style.height=height+'px';
  }

  frame.addEventListener('load',function(){
    var doc=frame.contentDocument;
    if(!doc)return;

    var style=doc.createElement('style');
    style.textContent=`
      #top{display:none!important}
      footer{display:none!important}

      /* Keep the live site's process-hero layout, typography, spacing and gray
         intro treatment. Only the small subtitle receives the Fine Arts gold. */
      .process-hero .seal-contained{display:none!important}
      .process-hero h2{
        color:#d4af37!important;
      }
    `;
    doc.head.appendChild(style);

    var hero=doc.querySelector('.process-hero');
    var title=hero&&hero.querySelector('.master-title,h1');
    if(title&&title.textContent.trim()==='Progress Chronicals') title.textContent='Progress Chronicles';

    resizeFrame(doc);
    if(window.ResizeObserver&&doc.body){
      var observer=new ResizeObserver(function(){resizeFrame(doc);});
      observer.observe(doc.body);
    }
    setTimeout(function(){resizeFrame(doc);},500);
    setTimeout(function(){resizeFrame(doc);},1800);
  });
})();