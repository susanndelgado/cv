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

      /* Preserve the live Fine Arts hero exactly. The only hero typography
         color change in build previews is the subtitle (h2) to gold. */
      .process-hero h2{color:#d4af37!important}
    `;
    doc.head.appendChild(style);

    resizeFrame(doc);
    if(window.ResizeObserver&&doc.body){
      var observer=new ResizeObserver(function(){resizeFrame(doc);});
      observer.observe(doc.body);
    }
    setTimeout(function(){resizeFrame(doc);},500);
    setTimeout(function(){resizeFrame(doc);},1800);
  });
})();