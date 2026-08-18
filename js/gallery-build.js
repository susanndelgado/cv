/* Review-only Fine Arts gallery renderer.
 * Uses the same archive JSON as the live site but presents works as an
 * editorial exhibition rather than a card grid.
 */
(function(){
  'use strict';

  var ENDPOINT='https://script.google.com/macros/s/AKfycbzrX85zJViyZP6gIiB0NUvXbaq-t6cR3Xa_7ckub9Jgqv_gnivZjHTWpASywZMN_l0U/exec';
  var GALLERIES=[
    {type:'gstory',label:'Narrative',href:'narrative-gallery-build.html'},
    {type:'gnature',label:'Wildlife',href:'wildlife-gallery-build.html'},
    {type:'gdecor',label:'Decorative',href:'decorative-gallery-build.html'},
    {type:'gstudy',label:'Academic Studies',href:'studies-gallery-build.html'}
  ];

  function text(value){
    if(Array.isArray(value)) return value.filter(Boolean).join(' ').trim();
    return value===null||value===undefined?'':String(value).trim();
  }

  function normalizeKey(value){return String(value||'').replace(/[\s_-]/g,'').toLowerCase();}

  function field(item){
    var names=[].slice.call(arguments,1).map(normalizeKey);
    var sources=[item||{},(item&&item.misc)||{}];
    for(var s=0;s<sources.length;s++){
      var source=sources[s];
      for(var key in source){
        if(!Object.prototype.hasOwnProperty.call(source,key)) continue;
        if(names.indexOf(normalizeKey(key))!==-1){
          var value=text(source[key]);
          if(value) return value;
        }
      }
    }
    return '';
  }

  function escapeHTML(value){
    return String(value||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function imageURL(item){
    var files=Array.isArray(item&&item.files)?item.files:(item&&item.files?[item.files]:[]);
    for(var f=0;f<files.length;f++){
      var entry=files[f];
      if(typeof entry!=='string') continue;
      var parts=entry.split(/\r?\n/).map(function(x){return x.trim();});
      if(parts.length>=3 && /^https?:\/\//i.test(parts[2])) return parts[2];
      for(var i=parts.length-1;i>=0;i--){if(/^https?:\/\//i.test(parts[i])) return parts[i];}
    }
    return '';
  }

  function getArchive(){
    if(window.SiteArchiveData&&typeof window.SiteArchiveData.get==='function') return window.SiteArchiveData.get();
    return fetch(ENDPOINT).then(function(r){if(!r.ok)throw new Error('Archive unavailable');return r.json();});
  }

  function insertGalleryNavigation(type){
    var hero=document.querySelector('.art-gallery-hero');
    if(!hero||hero.nextElementSibling&&hero.nextElementSibling.classList.contains('art-gallery-categories')) return;
    var nav=document.createElement('nav');
    nav.className='art-gallery-categories';
    nav.setAttribute('aria-label','Fine Arts galleries');
    nav.innerHTML=GALLERIES.map(function(gallery){
      return '<a href="'+gallery.href+'"'+(gallery.type===type?' class="active" aria-current="page"':'')+'>'+gallery.label+'</a>';
    }).join('');
    hero.parentNode.insertBefore(nav,hero.nextSibling);
  }

  function makeCard(item,index){
    var src=imageURL(item);
    var title=field(item,'title')||'Untitled';
    var media=field(item,'media','medium')||'Masterwork';
    var dimensions=field(item,'dimensions','size');
    var year=field(item,'year','date');
    var status=field(item,'status','availability');
    var description=text(item.description);
    var meta=[media,dimensions,year,status].filter(Boolean).join(' · ');

    var figure=document.createElement('figure');
    figure.className='art-gallery-card';
    figure.innerHTML=
      '<button type="button" class="art-gallery-open" data-index="'+index+'" aria-label="View '+escapeHTML(title)+' larger">'+
        '<span class="art-gallery-media-stage">'+
          (src?'<img src="'+escapeHTML(src)+'" alt="'+escapeHTML(title)+'" loading="lazy">':'<span class="art-gallery-image-missing">Image forthcoming</span>')+
        '</span>'+
      '</button>'+
      '<figcaption class="art-gallery-caption">'+
        '<h2>'+escapeHTML(title)+'</h2>'+
        (meta?'<p class="art-gallery-meta">'+escapeHTML(meta)+'</p>':'')+
        (description?'<p class="art-gallery-description">'+escapeHTML(description)+'</p>':'')+
      '</figcaption>';
    return {node:figure,src:src,title:title,meta:meta,description:description};
  }

  function init(){
    var body=document.body;
    var type=(body.getAttribute('data-gallery-type')||'').toLowerCase();
    var grid=document.getElementById('artGalleryGrid');
    var status=document.getElementById('artGalleryStatus');
    var lightbox=document.getElementById('artGalleryLightbox');
    var lightboxImage=document.getElementById('artGalleryLightboxImage');
    var lightboxTitle=document.getElementById('artGalleryLightboxTitle');
    var lightboxMeta=document.getElementById('artGalleryLightboxMeta');
    var lightboxDescription=document.getElementById('artGalleryLightboxDescription');
    var close=document.getElementById('artGalleryClose');
    var records=[];

    insertGalleryNavigation(type);

    function closeLightbox(){
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden','true');
      lightboxImage.removeAttribute('src');
    }

    getArchive().then(function(data){
      if(!Array.isArray(data)) throw new Error('Invalid archive data');
      var items=data.filter(function(item){return String(item.type||'').trim().toLowerCase()===type;})
        .sort(function(a,b){return Number(a.id||0)-Number(b.id||0);});

      if(status) status.remove();
      if(!items.length){
        grid.innerHTML='<p class="art-gallery-empty">No works are currently assigned to this gallery.</p>';
        return;
      }

      items.forEach(function(item,index){
        var record=makeCard(item,index);
        records.push(record);
        grid.appendChild(record.node);
      });

      grid.addEventListener('click',function(event){
        var button=event.target.closest('.art-gallery-open');
        if(!button) return;
        var record=records[Number(button.getAttribute('data-index'))];
        if(!record||!record.src) return;
        lightboxImage.src=record.src;
        lightboxImage.alt=record.title;
        lightboxTitle.textContent=record.title;
        lightboxMeta.textContent=record.meta;
        lightboxDescription.textContent=record.description;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden','false');
        close.focus();
      });
    }).catch(function(){
      if(status) status.textContent='The gallery archive could not be loaded.';
    });

    close.addEventListener('click',closeLightbox);
    lightbox.addEventListener('click',function(event){if(event.target===lightbox) closeLightbox();});
    document.addEventListener('keydown',function(event){if(event.key==='Escape'&&lightbox.classList.contains('open')) closeLightbox();});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
