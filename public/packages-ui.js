(() => {
 'use strict';const $=id=>document.getElementById(id),packages=window.BTT_PACKAGES;let active=null;
 function revealColumn(id){
  if(!id||$('comparison-panel').hidden)return;
  const region=$('comparison-scroll'),column=$('compare-'+id),label=$('comparison-label');
  if(region.scrollWidth<=region.clientWidth)return;
  const left=region.scrollLeft+column.getBoundingClientRect().left-region.getBoundingClientRect().left-label.getBoundingClientRect().width;
  region.scrollTo({left:Math.max(0,left),behavior:'auto'});
 }
 function highlight(id){active=id;packages.forEach(p=>$('card-'+p.id).classList.toggle('highlighted',p.id===id));document.querySelectorAll('[data-column]').forEach(cell=>cell.classList.toggle('highlighted-column',cell.dataset.column===id));const p=packages.find(p=>p.id===id);$('package-status').textContent=p?`${p.tier}: ${p.distinction}`:'';revealColumn(id);}
 function toggleHighlight(id){highlight(active===id?null:id);}
 document.querySelectorAll('[data-package-card],[data-column]').forEach(surface=>surface.addEventListener('click',event=>{
  if(event.target.closest('button,a,input,select,textarea,summary'))return;
  if(window.getSelection?.()?.toString())return;
  toggleHighlight(surface.dataset.packageCard||surface.dataset.column);
 }));
 document.querySelectorAll('[data-package-card],[data-column]').forEach(surface=>{
  if(surface.getAttribute('tabindex')!=='0')return;
  surface.addEventListener('keydown',event=>{
   if(event.target!==surface||!['Enter',' '].includes(event.key))return;
   event.preventDefault();toggleHighlight(surface.dataset.packageCard||surface.dataset.column);
  });
 });
 const cardsRegion=$('package-cards'),browse=$('package-browse');let browseIndex=0;
 const compactCards=()=>window.innerWidth<=540&&!cardsRegion.hidden;
 function updateBrowse(){
  browse.hidden=!compactCards();if(browse.hidden)return;
  $('package-position').textContent=`${browseIndex+1} of ${packages.length}`;
  $('package-prev').disabled=browseIndex===0;$('package-next').disabled=browseIndex===packages.length-1;
 }
 function revealCard(index){
  if(!compactCards())return;
  browseIndex=Math.max(0,Math.min(packages.length-1,index));
  const card=$('card-'+packages[browseIndex].id);
  const left=cardsRegion.scrollLeft+card.getBoundingClientRect().left-cardsRegion.getBoundingClientRect().left;
  cardsRegion.scrollTo({left:Math.max(0,left),behavior:'auto'});updateBrowse();
 }
 cardsRegion.addEventListener('scroll',()=>{
  if(!compactCards())return;
  const origin=cardsRegion.getBoundingClientRect().left;
  const distances=packages.map(p=>Math.abs($('card-'+p.id).getBoundingClientRect().left-origin));
  browseIndex=distances.indexOf(Math.min(...distances));updateBrowse();
 });
 $('package-prev').addEventListener('click',()=>revealCard(browseIndex-1));
 $('package-next').addEventListener('click',()=>revealCard(browseIndex+1));
 function showView(table){cardsRegion.hidden=table;$('comparison-panel').hidden=!table;$('cards-view').setAttribute('aria-pressed',String(!table));$('table-view').setAttribute('aria-pressed',String(table));if(table)revealColumn(active);else revealCard(active?packages.findIndex(p=>p.id===active):browseIndex);updateBrowse();}
 updateBrowse();
 $('cards-view').addEventListener('click',()=>showView(false));$('table-view').addEventListener('click',()=>showView(true));
 document.querySelectorAll('[data-inquire]').forEach(button=>button.addEventListener('click',()=>{
  const p=packages.find(p=>p.id===button.dataset.inquire);highlight(p.id);$('inquiry-package').textContent=p.tier;$('inquiry-description').textContent=p.name;
  const href=p.inquiryEmail;$('inquiry-email').setAttribute('href',href);window.BTT_UI.openDialog('inquiry-dialog',button);
 }));
 $('print-packages').addEventListener('click',()=>window.print());
 window.addEventListener('pageshow',()=>{highlight(null);if($('inquiry-dialog').open)$('inquiry-dialog').close();});
 window.addEventListener('resize',()=>{revealColumn(active);updateBrowse();revealCard(browseIndex);});
})();
