(() => {
 'use strict';const $=id=>document.getElementById(id),packages=window.BTT_PACKAGES;let active=null;
 function revealColumn(id){
  if(!id)return;
  const region=$('comparison-scroll'),column=$('compare-'+id),label=$('comparison-label');
  if(region.scrollWidth<=region.clientWidth)return;
  const left=region.scrollLeft+column.getBoundingClientRect().left-region.getBoundingClientRect().left-label.getBoundingClientRect().width;
  region.scrollTo({left:Math.max(0,left),behavior:'auto'});
 }
 function highlight(id){active=id;packages.forEach(p=>{const card=$('summary-'+p.id);if(card)card.classList.toggle('highlighted',p.id===id);});document.querySelectorAll('[data-column]').forEach(cell=>cell.classList.toggle('highlighted-column',cell.dataset.column===id));const p=packages.find(p=>p.id===id);$('package-status').textContent=p?`${p.tier}: ${p.distinction}`:'';revealColumn(id);}
 function toggleHighlight(id){highlight(active===id?null:id);}
 function showPackage(id){highlight(id);const panel=$('comparison-panel');if(panel.scrollIntoView)panel.scrollIntoView({block:'start',behavior:'smooth'});}
 document.querySelectorAll('[data-column]').forEach(surface=>surface.addEventListener('click',event=>{
  if(event.target.closest('button,a,input,select,textarea,summary'))return;
  if(window.getSelection?.()?.toString())return;
  toggleHighlight(surface.dataset.column);
 }));
 document.querySelectorAll('[data-column]').forEach(surface=>{
  if(surface.getAttribute('tabindex')!=='0')return;
  surface.addEventListener('keydown',event=>{
   if(event.target!==surface||!['Enter',' '].includes(event.key))return;
   event.preventDefault();toggleHighlight(surface.dataset.column);
  });
 });
 document.querySelectorAll('[data-show]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();showPackage(link.dataset.show);
  if(window.history?.replaceState)window.history.replaceState(null,'','#compare-'+link.dataset.show);
 }));
 document.querySelectorAll('[data-inquire]').forEach(button=>button.addEventListener('click',()=>{
  const p=packages.find(p=>p.id===button.dataset.inquire);highlight(p.id);$('inquiry-package').textContent=p.tier;$('inquiry-description').textContent=p.name;
  $('inquiry-email').setAttribute('href',p.inquiryEmail);window.BTT_UI.openDialog('inquiry-dialog',button);
 }));
 $('print-packages').addEventListener('click',()=>window.print());
 function applyHash(){const m=((window.location&&window.location.hash)||'').match(/^#compare(?:-(classic|signature|premier|custom))?$/);if(m)showPackage(m[1]||null);}
 window.addEventListener('pageshow',()=>{highlight(null);if($('inquiry-dialog').open)$('inquiry-dialog').close();applyHash();});
 window.addEventListener('hashchange',applyHash);
 window.addEventListener('resize',()=>revealColumn(active));
})();
