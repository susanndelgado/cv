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

    var font=doc.createElement('link');
    font.rel='stylesheet';
    font.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap';
    doc.head.appendChild(font);

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
        text-align:left!important;
      }
      .process-hero .container{
        width:100%!important;
        max-width:1220px!important;
        margin:0 auto!important;
        padding:0!important;
        text-align:left!important;
      }
      .process-hero .seal-contained{display:none!important}
      .finearts-interior-kicker{
        display:inline-block;
        margin:0 0 18px!important;
        padding-left:16px;
        border-left:4px solid #d4af37;
        color:#d4af37!important;
        font-family:proxima-nova,"Open Sans",Arial,sans-serif!important;
        font-size:.78rem!important;
        font-weight:600!important;
        line-height:1.4!important;
        letter-spacing:.16em!important;
        text-transform:uppercase!important;
      }
      .process-hero .master-title,
      .process-hero h1{
        max-width:850px!important;
        margin:0 0 16px!important;
        color:#fff!important;
        font-family:"Cormorant Garamond",Georgia,"Times New Roman",serif!important;
        font-size:clamp(2.2rem,4vw,3.75rem)!important;
        font-weight:500!important;
        line-height:1.05!important;
        letter-spacing:.005em!important;
        text-align:left!important;
        text-transform:none!important;
      }
      .process-hero h2{
        max-width:760px!important;
        margin:0 0 14px!important;
        color:#d4af37!important;
        font-family:proxima-nova,"Open Sans",Arial,sans-serif!important;
        font-size:.86rem!important;
        font-weight:500!important;
        line-height:1.5!important;
        letter-spacing:.1em!important;
        text-transform:uppercase!important;
        text-align:left!important;
      }
      .process-hero .hero-intro,
      .process-hero p{
        max-width:760px!important;
        margin:0!important;
        color:#fff!important;
        font-family:proxima-nova,"Open Sans",Arial,sans-serif!important;
        font-size:1.02rem!important;
        font-weight:400!important;
        line-height:1.72!important;
        text-align:left!important;
      }
      .process-hero .hero-divider{
        width:64px!important;
        height:3px!important;
        margin:25px 0 0!important;
        background:#d4af37!important;
        border:0!important;
      }
      @media(max-width:760px){
        .process-hero{padding:54px 24px 42px!important}
      }
    `;
    doc.head.appendChild(style);

    var hero=doc.querySelector('.process-hero');
    var container=hero&&hero.querySelector('.container');
    if(container&&!container.querySelector('.finearts-interior-kicker')){
      var kicker=doc.createElement('div');
      kicker.className='finearts-interior-kicker';
      kicker.textContent=frame.getAttribute('data-kicker')||'FINE ART';
      container.insertBefore(kicker,container.firstChild);
    }

    resizeFrame(doc);
    if(window.ResizeObserver&&doc.body){
      var observer=new ResizeObserver(function(){resizeFrame(doc);});
      observer.observe(doc.body);
    }
    setTimeout(function(){resizeFrame(doc);},500);
    setTimeout(function(){resizeFrame(doc);},1800);
  });
})();
