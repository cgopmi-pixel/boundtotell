(() => {
 'use strict';
 const $=id=>document.getElementById(id),openers=new Map(),opened=new Set();
 const nav=$('site-navigation'),toggle=$('nav-toggle'),compact=window.matchMedia('(max-width: 900px)');
 function syncNavigation(){nav.hidden=compact.matches;toggle.hidden=!compact.matches;toggle.setAttribute('aria-expanded',String(!nav.hidden));toggle.setAttribute('aria-label',nav.hidden?'Open menu':'Close menu');}
 syncNavigation();compact.addEventListener('change',syncNavigation);
 toggle.addEventListener('click',()=>{nav.hidden=!nav.hidden;toggle.setAttribute('aria-expanded',String(!nav.hidden));toggle.setAttribute('aria-label',nav.hidden?'Open menu':'Close menu');});
 function closeNavigation(restoreFocus=false){
  if(!compact.matches||nav.hidden)return;
  nav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');
  if(restoreFocus)toggle.focus({preventScroll:true});
 }
 function navigationKeydown(event){if(event.key==='Escape'&&compact.matches&&!nav.hidden){event.preventDefault();closeNavigation(true);}}
 nav.addEventListener('keydown',navigationKeydown);toggle.addEventListener('keydown',navigationKeydown);
 nav.addEventListener('click',event=>{if(event.target.closest('a'))closeNavigation();});
 let scrollPosition={left:0,top:0};
 function lockPage(){
  scrollPosition={left:window.scrollX,top:window.scrollY};
  document.body.style.top=-scrollPosition.top+'px';
  document.documentElement.classList.toggle('dialog-open',true);
  document.body.classList.toggle('dialog-open',true);
 }
 function unlockPage(){
  document.body.classList.toggle('dialog-open',false);
  document.body.style.top='';
  window.scrollTo({...scrollPosition,behavior:'auto'});
  document.documentElement.classList.toggle('dialog-open',false);
 }
 function openDialog(id,trigger){
  const dialog=$(id);if(dialog.open)return;
  openers.set(id,trigger);if(!opened.size)lockPage();
  opened.add(id);dialog.showModal();$(id+'-close').focus();
 }
 for(const id of ['sample-dialog','inquiry-dialog']){
  const dialog=$(id);if(!dialog)continue;
  $(id+'-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{opened.delete(id);if(!opened.size)unlockPage();openers.get(id)?.focus({preventScroll:true});});
 }
 window.BTT_UI={openDialog};
 if(!$('sample-dialog'))return;
 const pages=[38,39,40],viewport=document.querySelector('.sample-page');let index=0,zoomed=false;
 function resetPan(){viewport.scrollTop=0;viewport.scrollLeft=0;}
 function setZoom(on){
  zoomed=on;viewport.classList.toggle('is-zoomed',on);
  $('sample-zoom').setAttribute('aria-pressed',String(on));
  const label=on?'Fit sample page':'Enlarge sample page';
  $('sample-zoom').setAttribute('aria-label',label);$('sample-zoom').setAttribute('title',label);resetPan();
 }
 function showPage(next){index=Math.max(0,Math.min(pages.length-1,next));$('sample-image').setAttribute('src',`./assets/book/sample-pdf-${pages[index]}.webp`);$('sample-image').setAttribute('alt',`Sample memoir, PDF page ${pages[index]}`);$('sample-caption').textContent=`Page ${index+1} of ${pages.length}`;$('sample-prev').disabled=index===0;$('sample-next').disabled=index===pages.length-1;resetPan();}
 document.querySelectorAll('[data-open-sample]').forEach(button=>button.addEventListener('click',event=>{setZoom(false);showPage(0);openDialog('sample-dialog',event.currentTarget);}));
 $('sample-prev').addEventListener('click',()=>showPage(index-1));$('sample-next').addEventListener('click',()=>showPage(index+1));
 $('sample-zoom').addEventListener('click',()=>setZoom(!zoomed));
 $('sample-dialog').addEventListener('keydown',event=>{if(zoomed)return;if(event.key==='ArrowLeft'){event.preventDefault();showPage(index-1);}if(event.key==='ArrowRight'){event.preventDefault();showPage(index+1);}});
})();
