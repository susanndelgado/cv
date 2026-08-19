(function(){
  'use strict';

  var target=document.getElementById('projectContent');
  if(!target)return;

  var template=target.getAttribute('data-template');
  if(!template)return;

  fetch(template)
    .then(function(response){
      if(!response.ok)throw new Error('Project template unavailable');
      return response.text();
    })
    .then(function(html){
      target.innerHTML=html;
      if(window.initBuildInlinePage)window.initBuildInlinePage({force:true});
    })
    .catch(function(){
      target.innerHTML='<p class="status">Project content could not be loaded.</p>';
    });
})();
