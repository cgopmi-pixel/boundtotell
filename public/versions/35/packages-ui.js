(() => {
 'use strict';const $=id=>document.getElementById(id),packages=window.BTT_PACKAGES;let active=null;
 function revealColumn(id){
  if(!id||$('comparison-panel').hidden)return;
  const region=$('comparison-scroll'),column=$('compare-'+id),label=$('comparison-label');
  if(region.scrollWidth<=region.clientWidth)return;
  const left=region.scrollLeft+column.getBoundingClientRect().left-region.getBoundingClientRect().left-label.getBoundingClientRect().width;
  region.scrollTo({left:Math.max(0,left),behavior:'auto'});
 }
 function highlight(id){active=id;document.querySelectorAll('[data-highlight]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.highlight===id)));packages.forEach(p=>$('card-'+p.id).classList.toggle('highlighted',p.id===id));document.querySelectorAll('[data-column]').forEach(cell=>cell.classList.toggle('highlighted-column',cell.dataset.column===id));const p=packages.find(p=>p.id===id);$('package-status').textContent=p?`${p.tier}: ${p.distinction}`:'';revealColumn(id);}
 function toggleHighlight(id){highlight(active===id?null:id);}
 document.querySelectorAll('[data-highlight]').forEach(button=>button.addEventListener('click',()=>toggleHighlight(button.dataset.highlight)));
 document.querySelectorAll('[data-package-card],[data-column]').forEach(surface=>surface.addEventListener('click',event=>{
  if(event.target.closest('button,a,input,select,textarea,summary'))return;
  if(window.getSelection?.()?.toString())return;
  toggleHighlight(surface.dataset.packageCard||surface.dataset.column);
 }));
 function showView(table){$('package-cards').hidden=table;$('comparison-panel').hidden=!table;$('cards-view').setAttribute('aria-pressed',String(!table));$('table-view').setAttribute('aria-pressed',String(table));if(table)revealColumn(active);}
 $('cards-view').addEventListener('click',()=>showView(false));$('table-view').addEventListener('click',()=>showView(true));
 document.querySelectorAll('[data-inquire]').forEach(button=>button.addEventListener('click',()=>{
  const p=packages.find(p=>p.id===button.dataset.inquire);highlight(p.id);$('inquiry-package').textContent=p.tier;$('inquiry-description').textContent=p.name+(Number.isFinite(p.price)?' · $'+p.price.toLocaleString('en-US'):'');
  const href=p.inquiryEmail;$('inquiry-email').setAttribute('href',href);window.BTT_UI.openDialog('inquiry-dialog',button);
 }));
 $('print-packages').addEventListener('click',()=>window.print());
 window.addEventListener('pageshow',()=>{highlight(null);if($('inquiry-dialog').open)$('inquiry-dialog').close();});
 window.addEventListener('resize',()=>revealColumn(active));
})();
