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

      /* Preserve each live page's hero copy and layout. Hero subtitles use the
         live Fine Arts subtitle typography with gold as the only color change. */
      .process-hero .seal-contained{display:none!important}
      .process-hero h2{
        color:#d4af37!important;
        font-family:"Playfair",Georgia,serif!important;
        font-size:1.2rem!important;
        font-weight:300!important;
        letter-spacing:4px!important;
        line-height:1.5!important;
        margin-bottom:30px!important;
        text-align:center!important;
      }
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