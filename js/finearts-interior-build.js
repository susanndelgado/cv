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
      body{margin:0!important;background:#fff!important;font-family:proxima-nova,"Open Sans",Arial,sans-serif!important}
      .process-hero{
        width:100%!important;
        margin:0!important;
        padding:68px max(4vw,calc((100vw - 1220px)/2)) 52px!important;
        background:#111!important;
        color:#fff!important;
        border:0!important;
        text-align:center!important;
      }
      .process-hero .container{
        width:100%!important;
        max-width:1220px!important;
        margin:0 auto!important;
        padding:0!important;
        text-align:center!important;
      }
      .process-hero .seal-contained{display:none!important}
      .process-hero .master-title,
      .process-hero h1{
        max-width:1000px!important;
        margin:0 auto 16px!important;
        color:#fff!important;
        font-family:"Playfair",Georgia,serif!important;
        font-size:3rem!important;
        font-weight:300!important;
        line-height:1.2!important;
        letter-spacing:8px!important;
        text-align:center!important;
        text-transform:uppercase!important;
      }
      .process-hero h2{
        max-width:760px!important;
        margin:0 auto 14px!important;
        color:#d4af37!important;
        font-family:proxima-nova,"Open Sans",Arial,sans-serif!important;
        font-size:.86rem!important;
        font-weight:500!important;
        line-height:1.5!important;
        letter-spacing:.1em!important;
        text-transform:uppercase!important;
        text-align:center!important;
      }
      .process-hero .hero-intro,
      .process-hero p{
        max-width:760px!important;
        margin:0 auto!important;
        color:#fff!important;
        font-family:proxima-nova,"Open Sans",Arial,sans-serif!important;
        font-size:1.02rem!important;
        font-weight:400!important;
        line-height:1.72!important;
        text-align:center!important;
      }
      .process-hero .hero-divider{display:none!important}
      @media(max-width:760px){
        .process-hero{padding:52px 22px 42px!important}
        .process-hero .master-title,.process-hero h1{
          font-size:2.2rem!important;
          letter-spacing:5px!important;
        }
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