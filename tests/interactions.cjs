const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function attrs(raw){const a={};for(const m of raw.matchAll(/([\w-]+)(?:="([^"]*)")?/g))a[m[1]]=decode(m[2]??'');return a;}
function environment(file,width=1280){
 const html=fs.readFileSync(path.join(dist,file),'utf8'),nodes=[],byId=new Map(),windowEvents={},captured={focus:null,focusOptions:null,pageScrolls:[],tableScrolls:[],cardScrolls:[],selection:"",prints:0};
 // Controlled geometry exercises scroll calculations; this is not a CSS renderer.
 const regionWidth=Math.min(width-40,1200),labelWidth=100;
 const tableWidth=width<=650?4*regionWidth-3*labelWidth:Math.max(950,regionWidth);
 const columnWidth=(tableWidth-labelWidth)/4,cardStride=regionWidth-8;
 class El{
  constructor(tag,a){this.tag=tag;this.attrs=a;this.id=a.id;this.dataset={};for(const [k,v]of Object.entries(a))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.classes=new Set((a.class||'').split(/\s+/));this.classList={contains:c=>this.classes.has(c),toggle:(c,on)=>{on?this.classes.add(c):this.classes.delete(c);}};this.hidden=Object.hasOwn(a,'hidden');this.disabled=Object.hasOwn(a,'disabled');this.open=false;this.style={};this.handlers={};this.textContent='';this.scrollTop=0;this.scrollLeft=0;this.clientWidth=regionWidth;this.scrollWidth=tableWidth;}
  addEventListener(k,fn){this.handlers[k]=fn;}
  setAttribute(k,v){this.attrs[k]=v;}
  getAttribute(k){return this.attrs[k]??null;}
  focus(options){captured.focus=this;captured.focusOptions=options;}
  showModal(){this.open=true;}
  close(){this.open=false;this.handlers.close?.();}
  closest(selector){for(let n=this;n;n=n.parentElement)if(matches(n,selector))return n;return null;}
  click(){if(this.disabled)return;const event={target:this,currentTarget:null,preventDefault(){}};for(let n=this;n;n=n.parentElement){event.currentTarget=n;n.handlers.click?.(event);}}
  scrollTo(options){
   if(this.id==='package-cards'){captured.cardScrolls.push(options);this.scrollLeft=Math.min(3*cardStride-20,Math.max(0,options.left));}
   else {captured.tableScrolls.push(options);this.scrollLeft=Math.min(this.scrollWidth-this.clientWidth,Math.max(0,options.left));}
  }
  getBoundingClientRect(){
   const cardIndex=['classic','signature','premier','custom'].indexOf((this.id||'').replace('card-',''));
   if(cardIndex>=0)return {left:20+cardIndex*cardStride-byId.get('package-cards').scrollLeft,width:regionWidth-20};
   const index=['classic','signature','premier','custom'].indexOf((this.id||'').replace('compare-',''));
   if(index>=0)return {left:20+labelWidth+index*columnWidth-byId.get('comparison-scroll').scrollLeft,width:columnWidth};
   return {left:20,width:this.id==='comparison-label'?labelWidth:regionWidth};
  }
 }
 function matches(node,selector){return selector.split(',').some(part=>{const value=part.trim();return value.startsWith('.')?node.classes.has(value.slice(1)):value.startsWith('[')?Object.hasOwn(node.attrs,value.slice(1,-1)):node.tag===value;});}
 const stack=[],voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 for(const m of html.matchAll(/<\/?([a-z][\w-]*)\b([^>]*)>/g)){
  if(m[0].startsWith('</')){const index=stack.findLastIndex(n=>n.tag===m[1]);if(index>=0)stack.length=index;continue;}
  const el=new El(m[1],attrs(m[2]));el.parentElement=stack.at(-1)||null;nodes.push(el);if(el.id)byId.set(el.id,el);
  if(!voidTags.has(el.tag)&&!m[0].endsWith('/>'))stack.push(el);
 }
 const select=selector=>nodes.filter(n=>matches(n,selector));
 const document={body:nodes.find(n=>n.tag==='body'),documentElement:new El('html',{}),getElementById:id=>byId.get(id)||null,querySelectorAll:select,querySelector:s=>select(s)[0]||null};
 const media={matches:false,addEventListener:(key,fn)=>media.change=fn};
 const window={matchMedia:query=>{const match=/max-width:\s*(\d+)px/.exec(query);assert(match,'Expected a width media query');media.matches=width<=Number(match[1]);return media;},print:()=>captured.prints++,innerWidth:width,scrollX:0,scrollY:480,getSelection:()=>({toString:()=>captured.selection}),addEventListener:(k,fn)=>windowEvents[k]=fn,scrollTo:options=>{captured.pageScrolls.push(options);window.scrollX=options.left;window.scrollY=options.top;}};
 const context=vm.createContext({window,document});
 vm.runInContext(fs.readFileSync(path.join(dist,'common.js'),'utf8'),context);
 if(file==='packages.html'){vm.runInContext(fs.readFileSync(path.join(dist,'package-data.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(dist,'packages-ui.js'),'utf8'),context);}
 return {html,nodes,byId,document,window,media,windowEvents,captured,columnWidth,cardStride,regionWidth,tableWidth,e:id=>byId.get(id),click:id=>byId.get(id).click(),select};
}
const copy=JSON.parse(fs.readFileSync(path.join(root,'content/site-copy.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'content/packages.json'),'utf8'));
for(const file of ['index.html','packages.html','about.html','samples.html','faqs.html','contact.html']){
 const html=fs.readFileSync(path.join(dist,file),'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'duplicate IDs in '+file);
 assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
 for(const route of ['index.html','packages.html','about.html','samples.html','faqs.html','contact.html'])assert(html.includes('href="./'+route+'"'));
 assert(/<footer[\s\S]*class="footer-logo"[\s\S]*© 2026 Bound to Tell/.test(html));
 for(const m of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert(fs.existsSync(path.resolve(dist,m[1])),file+' missing '+m[1]);
 assert(html.includes('width=device-width, initial-scale=1, viewport-fit=cover'));assert(!html.includes('user-scalable=no'));assert(!html.includes('maximum-scale='));
 assert(html.includes('href="./small-screens.css" media="screen"'));assert(html.indexOf('./small-screens.css')>html.indexOf('./site-refresh.css'));assert(html.includes('href="./responsive.css"'));assert(html.includes('href="./device-layout.css"'));assert(html.includes('href="./site-refresh.css"'));
 assert(!html.includes('noindex, nofollow'),'Primary pages must not retain draft indexing metadata');
}
const home=environment('index.html');
const faqPage=environment('faqs.html'),samplesPage=environment('samples.html');
for(const faq of copy.faqs){assert(decode(faqPage.html).includes(faq.question));for(const text of faq.answer)assert(decode(faqPage.html).includes(text));}
assert.equal(copy.faqs.length,8);assert(!faqPage.html.includes('What photographs or documents should we gather?'));
assert(faqPage.html.includes('What if I don’t have a real story to tell?'));assert(faqPage.html.includes('Do I need to prepare anything before the interviews?'));
assert(!/\bconsult\b/.test(faqPage.html));assert(faqPage.html.includes('estimated costs and expected timeline.'));
assert(copy.about.at(-1).startsWith('Our mission is to give families a lasting legacy:'));
assert(!home.html.includes('Turn memories into a beautiful book for the family to cherish.'));assert(!home.html.includes('For the memories you treasure.'));
assert(samplesPage.html.includes('Chana G.'));assert(samplesPage.html.includes('Chavi S.'));assert(!home.html.includes('faq-1'));
for(const t of copy.testimonials)assert(decode(samplesPage.html).includes(t.quote));
for(const opener of samplesPage.select('[data-open-sample]')){opener.click();assert(samplesPage.e('sample-dialog').open);samplesPage.click('sample-dialog-close');assert.equal(samplesPage.captured.focus,opener);}
for(const width of [320,360,390,540,600,650,760,768,820,900,901,912,1024,1200,1440]){
 const t=environment('index.html',width);assert.equal(t.e('site-navigation').hidden,width<=900);assert.equal(t.e('nav-toggle').hidden,width>900);
 if(width<=900){t.click('nav-toggle');assert(!t.e('site-navigation').hidden);assert.equal(t.e('nav-toggle').getAttribute('aria-expanded'),'true');t.click('nav-toggle');assert(t.e('site-navigation').hidden);}
 if(width<=900){
  t.click('nav-toggle');let prevented=false;
  t.e('site-navigation').handlers.keydown({key:'Escape',preventDefault(){prevented=true;}});
  assert(prevented);assert(t.e('site-navigation').hidden);assert.equal(t.captured.focus,t.e('nav-toggle'));
  assert.equal(t.e('nav-toggle').getAttribute('aria-expanded'),'false');
  t.click('nav-toggle');t.e('nav-toggle').handlers.keydown({key:'Escape',preventDefault(){}});assert(t.e('site-navigation').hidden);
  t.click('nav-toggle');t.nodes.find(n=>n.tag==='a'&&n.parentElement===t.e('site-navigation')).click();
  assert(t.e('site-navigation').hidden,'Close a compact menu after following a route');
 }
 t.media.matches=false;t.media.change();assert(!t.e('site-navigation').hidden);assert(t.e('nav-toggle').hidden);
 t.media.matches=true;t.media.change();assert(t.e('site-navigation').hidden);assert(!t.e('nav-toggle').hidden);
}
assert(home.e('sample-dialog'));assert(home.html.includes('data-open-sample'));{const prod=home.html.slice(home.html.indexOf('class="hp-product"'),home.html.indexOf('class="hp-packages"'));assert(!prod.includes('samples.html'));assert(prod.includes('data-open-sample'));}
assert.equal(samplesPage.select('[data-open-sample]').length,1);assert(samplesPage.e('sample-open').classList.contains('sample-preview'));assert(!samplesPage.html.includes('sample-button'));assert(samplesPage.html.includes('>From our Satisfied Clients</h1>'));assert(samplesPage.html.includes('class="sample-preview-label">Sample Memoir</span>'));assert(samplesPage.html.includes('id="sample-title">Sample Memoir</h2>'));assert.equal(samplesPage.select('.quote-mark').length,4);assert.equal(samplesPage.select('.closing-quote').length,2);
const viewer=samplesPage;
viewer.click('sample-open');assert(viewer.e('sample-dialog').open);assert.equal(viewer.captured.focus.id,'sample-dialog-close');assert.equal(viewer.e('sample-image').getAttribute('src'),'./assets/book/sample-pdf-38.webp');assert(viewer.e('sample-prev').disabled);
assert(viewer.document.body.classList.contains('dialog-open'));assert(viewer.document.documentElement.classList.contains('dialog-open'));assert.equal(viewer.document.body.style.top,'-480px');
viewer.select('.sample-page')[0].scrollTop=150;viewer.click('sample-next');assert.equal(viewer.e('sample-image').getAttribute('src'),'./assets/book/sample-pdf-39.webp');assert.equal(viewer.select('.sample-page')[0].scrollTop,0);
viewer.click('sample-next');assert.equal(viewer.e('sample-image').getAttribute('src'),'./assets/book/sample-pdf-40.webp');assert(viewer.e('sample-next').disabled);viewer.click('sample-next');assert.equal(viewer.e('sample-caption').textContent,'Page 3 of 3');
viewer.e('sample-dialog').handlers.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(viewer.e('sample-image').getAttribute('src'),'./assets/book/sample-pdf-39.webp');
const sampleViewport=viewer.select('.sample-page')[0];sampleViewport.scrollTop=160;sampleViewport.scrollLeft=120;viewer.click('sample-zoom');assert(sampleViewport.classList.contains('is-zoomed'));assert.equal(viewer.e('sample-zoom').getAttribute('aria-pressed'),'true');assert.equal(viewer.e('sample-zoom').getAttribute('aria-label'),'Fit sample page');assert.equal(sampleViewport.scrollTop,0);assert.equal(sampleViewport.scrollLeft,0);
viewer.e('sample-dialog').handlers.keydown({key:'ArrowRight',preventDefault(){assert.fail('Zoomed arrow keys should pan normally');}});assert.equal(viewer.e('sample-image').getAttribute('src'),'./assets/book/sample-pdf-39.webp');
sampleViewport.scrollLeft=80;viewer.click('sample-next');assert(sampleViewport.classList.contains('is-zoomed'));assert.equal(sampleViewport.scrollLeft,0);
viewer.click('sample-dialog-close');assert(!viewer.e('sample-dialog').open);assert.equal(viewer.captured.focus.id,'sample-open');assert.equal(viewer.captured.focusOptions.preventScroll,true);assert(!viewer.document.body.classList.contains('dialog-open'));assert(!viewer.document.documentElement.classList.contains('dialog-open'));assert.equal(viewer.document.body.style.top,'');assert.equal(viewer.captured.pageScrolls.at(-1).top,480);
viewer.click('sample-open');assert.equal(viewer.e('sample-image').getAttribute('src'),'./assets/book/sample-pdf-38.webp');assert.equal(viewer.e('sample-zoom').getAttribute('aria-pressed'),'false');assert(!sampleViewport.classList.contains('is-zoomed'));viewer.click('sample-zoom');viewer.click('sample-zoom');assert.equal(viewer.e('sample-zoom').getAttribute('aria-label'),'Enlarge sample page');
// Native Escape also fires close; it must restore scrolling and focus.
viewer.e('sample-dialog').close();assert(!viewer.document.body.classList.contains('dialog-open'));assert.equal(viewer.window.scrollY,480);assert.equal(viewer.captured.focus.id,'sample-open');
function expectedSubject(link,subject){const uri=new URL(link);assert.equal(uri.protocol,'mailto:');assert.equal(uri.pathname,'info@boundtotell.com');assert.equal(uri.searchParams.get('subject'),subject);assert(uri.searchParams.get('body').includes('free initial consultation'));if(subject.startsWith('Interested in the '))assert(uri.searchParams.get('body').includes(subject.slice('Interested in the '.length)));}
function checkHighlight(t,id){
 for(const p of data.packages)assert.equal(t.e('summary-'+p.id).classList.contains('highlighted'),p.id===id);
 for(const c of t.select('[data-column]'))assert.equal(c.classList.contains('highlighted-column'),c.dataset.column===id);
 const p=data.packages.find(p=>p.id===id);assert.equal(t.e('package-status').textContent,p?p.tier+': '+p.distinction:'');
}
for(const width of [320,360,375,390,430,540,541,600,700,768,820,900,901,1024,1200,1201,1280,1440,1920]){
 const t=environment('packages.html',width);assert(!t.e('comparison-panel').hidden);assert(!t.e('inquiry-dialog').open);
 assert.equal(t.select('[data-inquire]').length,4);assert.equal(t.select('[data-show]').length,4);
 assert(t.e('package-status').classList.contains('sr-only'));checkHighlight(t,null);
 // Summary card links highlight the matching column in the always-visible comparison chart.
 for(const [index,p]of data.packages.entries()){
  const before=t.captured.tableScrolls.length;
  t.select('[data-show]').find(l=>l.dataset.show===p.id).click();checkHighlight(t,p.id);
  if(t.tableWidth>t.regionWidth){assert(t.captured.tableScrolls.length>before);assert.equal(t.captured.tableScrolls.at(-1).left,index*t.columnWidth);}
 }
 // Every header, detail and action-area cell is a highlight surface.
 for(const cell of t.select('[data-column]')){cell.click();checkHighlight(t,cell.dataset.column);cell.click();checkHighlight(t,null);}
 const comparisonHeader=t.e('compare-premier');
 assert.equal(comparisonHeader.getAttribute('tabindex'),'0');
 comparisonHeader.handlers.keydown({target:comparisonHeader,key:'Enter',preventDefault(){}});checkHighlight(t,'premier');
 comparisonHeader.handlers.keydown({target:comparisonHeader,key:' ',preventDefault(){}});checkHighlight(t,null);
 t.captured.selection='a copied comparison detail';t.e('compare-classic').click();checkHighlight(t,null);t.captured.selection='';
 t.click('print-packages');assert.equal(t.captured.prints,1);
 for(const button of t.select('[data-inquire]')){
  const p=data.packages.find(p=>p.id===button.dataset.inquire);button.click();checkHighlight(t,p.id);assert(t.e('inquiry-dialog').open);assert(t.document.body.classList.contains('dialog-open'));assert.equal(t.e('inquiry-package').textContent,p.tier);assert.equal(t.e('inquiry-description').textContent,p.name);expectedSubject(t.e('inquiry-email').getAttribute('href'),'Interested in the '+p.tier+' — '+p.name);
  t.click('inquiry-dialog-close');assert(!t.e('inquiry-dialog').open);assert.equal(t.captured.focus,button);
 }
 t.select('[data-inquire]')[0].click();t.windowEvents.pageshow();assert(!t.e('inquiry-dialog').open);checkHighlight(t,null);
}
const packagesHTML=fs.readFileSync(path.join(dist,'packages.html'),'utf8');
for(const p of data.packages){
 const summary=packagesHTML.match(new RegExp('<article[^>]*id="summary-'+p.id+'"[\\s\\S]*?</article>'))[0];
 if(p.id!=='custom')assert(summary.includes(p.price));assert(summary.includes('href="#compare-'+p.id+'"'));
 for(const field of ['description','distinction','pages','interviewees','photos','copies','words','revisions'])assert(!/\bup to\b/i.test(p[field]));
}
assert(!packagesHTML.includes('data-fit='));assert(!packagesHTML.includes('Select to highlight a package'));assert(!packagesHTML.includes('explore all four below'));assert(!packagesHTML.includes('your-choice'));assert(!packagesHTML.includes('Download details'));assert(!packagesHTML.includes('Selected memories'));
assert.equal(data.inclusions.at(-2),'Published books');assert.equal(data.inclusions.at(-1),'Print-ready digital edition');
const original={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dist,'previous/packages.js'),'utf8'),original);
data.packages.forEach((p,i)=>{const old=original.window.BOUND_TO_TELL.packages[i];assert.equal(p.price,['$4,500','$7,500','$11,000','Custom quote'][i]);if(i<3){assert.equal(p.hours,old.interviews);assert.equal(p.words,old.wordLimit.replace(/^Up to /,''));assert.equal(p.pages,i===0?'35–45 pages':old.pages.replace(/^Approximately /,''));assert.equal(p.copies,old.copies);}});
const contact=environment('contact.html');expectedSubject(contact.e('contact-email').getAttribute('href'),'Memoir inquiry');
assert(!contact.html.includes('estimated costs'));assert(!contact.html.includes('Your email app will open'));assert(!contact.html.includes('Connect</a>'));
for(const html of [packagesHTML,contact.html]){
 assert(html.includes('>Call or text</span>'));
 assert(html.includes('class="button primary phone-connect" href="tel:+17323440886">732.344.0886</a>'));
 assert(html.includes('>info@boundtotell.com</a>'));assert(!html.includes('class="contact-address"'));
 assert(!html.includes('For an inquiry'));assert(!html.includes('This is an inquiry'));assert(!html.includes('Your email app will open'));
}
assert(packagesHTML.includes('Selected:</p>'));assert(!packagesHTML.includes('Let’s connect'));
assert(packagesHTML.includes("Please select an option below to arrange a free initial consultation and discuss the story you'd like to preserve."));
assert(packagesHTML.includes('A full memoir covering the major stages of a life story.'));
assert(!packagesHTML.includes('agreed after consultation'));assert(!packagesHTML.includes('undefined'));assert(!packagesHTML.includes('NaN'));
assert.equal((packagesHTML.match(/Word count, interview hours and revision rounds custom/g)||[]).length,2);
assert.equal((packagesHTML.match(/rowspan="3"/g)||[]).length,2);
assert(!packagesHTML.includes('Starting at'));assert(!packagesHTML.includes('$15,000'));assert(!packagesHTML.includes('card-number'));
assert(!packagesHTML.includes('Approximately'));assert(!packagesHTML.includes('Choose the scope'));assert(!packagesHTML.includes('All quotes are estimates only.'));
assert.equal((decode(packagesHTML).match(/Yes! I'd like a free consultation\.<\/button>/g)||[]).length,4);
assert(packagesHTML.includes('Printed copies – custom quantities'));assert(packagesHTML.includes('and printed copies are available for an additional charge. Color interiors,'));
assert(packagesHTML.includes('id="print-packages"'));assert(packagesHTML.includes('id="package-print"'));assert(packagesHTML.includes('id="print-comparison"'));
const printSheet=packagesHTML.slice(packagesHTML.indexOf('<section id="package-print"'));
assert(printSheet.indexOf('print-logo')<printSheet.indexOf('print-comparison'));assert(printSheet.indexOf('print-contact')>printSheet.indexOf('</table>'));
for(const value of ['boundtotell.com','info@boundtotell.com','732.344.0886'])assert(printSheet.includes(value));
for(const p of data.packages){for(const value of [p.tier,p.name,p.pages,p.photos,p.interviewees,p.copies])assert(printSheet.includes(value));}
assert(!printSheet.includes('data-inquire'));assert(!printSheet.includes('data-column'));
const mainPrint=printSheet.slice(printSheet.indexOf('<table id="print-comparison"'),printSheet.indexOf('</table>'));
assert.equal((printSheet.match(/<table /g)||[]).length,1,'Print the comparison as one continuous table');
assert(mainPrint.includes('Word count'));assert(mainPrint.includes('Interview time'));assert(mainPrint.includes('Revision rounds'));assert(!printSheet.includes('id="print-fine"'));
assert(mainPrint.indexOf('* Possibility of additional copies')>mainPrint.indexOf('Revision rounds'));
assert.equal((printSheet.match(/\* Possibility of additional copies/g)||[]).length,3);
assert(packagesHTML.includes(data.pageNote+' '+data.priceNote));
assert(faqPage.html.includes('and then weave them into a beautiful, cohesive narrative'));assert(faqPage.html.includes('The story can simply be shared in your own words.'));assert(faqPage.html.includes('The more contributors there are, the more perspectives and details can be included, allowing us to create a richer account.'));
const printStyles=fs.readFileSync(path.join(dist,'print.css'),'utf8');assert(printStyles.includes('@media print'));assert(printStyles.includes('size: landscape'));assert(printStyles.includes('border: .3mm solid'));assert(printStyles.includes('border-right: .5mm solid'));assert(printStyles.includes('#print-comparison .fine-row th, #print-comparison .fine-row td { font-size: 8pt; color: #777; border-color: #b7b7b7; background: #fff; }'));
for(const [file,title]of [['samples.html','From our Satisfied Clients'],['packages.html','Packages'],['faqs.html','Frequently Asked Questions']]){
 const html=fs.readFileSync(path.join(dist,file),'utf8');assert(new RegExp('<h[12][^>]*class="section-title"[^>]*>'+title+'</h[12]>').test(html));
}
// Current publication shows the approved prices: Classic $4,500, Signature $7,500, Premier $11,000.
for(const v of ['$4,500','$7,500','$11,000'])assert(packagesHTML.includes(v));
assert(packagesHTML.includes('A comprehensive book preserving stories and memories.'));
assert(packagesHTML.indexOf('class="view-switch"')<packagesHTML.indexOf('id="included-heading"'));
assert(!packagesHTML.includes('class="package-controls"'));
assert(faqPage.html.includes('<h1 id="faq-heading" class="section-title">Frequently Asked Questions</h1>'));
assert(contact.html.includes('<h1 class="sr-only">Contact Us</h1>'));assert(!contact.html.includes('<h1 class="section-title">Contact Us</h1>'));assert(contact.html.includes('>Contact Us</a>'));
// About Us: approved copy in the original bookcase layout, listed after Packages.
{const aboutPage=environment('about.html');const t=decode(aboutPage.html);for(const x of copy.about)assert(t.includes(x));assert.equal(aboutPage.select('.bookcase-frame').length,0);assert(aboutPage.html.includes('class="ab-promise"'));assert(aboutPage.html.includes('class="ab-mission"'));assert(aboutPage.html.indexOf('>Packages</a>')<aboutPage.html.indexOf('>About Us</a>'));assert(aboutPage.html.indexOf('>About Us</a>')<aboutPage.html.indexOf('>Sample &amp; Testimonials</a>'));}
// Homepage redesign: eight sections in order, prices, mockups and the Schedule a Conversation dialog.
{const order=['hp-hero','hp-why','hp-matters','hp-product','hp-how','hp-packages','hp-gift','hp-cta'].map(c=>home.html.indexOf('class="'+c+'"'));
 order.forEach((v,i)=>{assert(v>0,'missing homepage section '+i);if(i)assert(v>order[i-1],'homepage section out of order '+i);});
 const text=decode(home.html);for(const t of [copy.home.hero.title,copy.home.why.title,copy.home.gift.title,copy.home.matters.objection,copy.home.cta.title,'$4,500','$7,500','$11,000'])assert(text.includes(t),'homepage missing '+t);
 assert(!/As told to/i.test(home.html));
 for(const m of home.html.matchAll(/src="\.\/(assets\/[^"]+)"/g))assert(fs.existsSync(path.join(dist,m[1])),'missing homepage image '+m[1]);
 assert(home.e('inquiry-dialog'));const dlgHTML=home.html.slice(home.html.indexOf('id="inquiry-dialog"'));assert(dlgHTML.includes('href="tel:+17323440886"'));assert(dlgHTML.includes('href="mailto:info@boundtotell.com'));
 assert(home.select('[data-schedule]').length>=3);}
assert(copy.about[0].includes('experiences and family'));assert(copy.about[1].startsWith('At Bound to Tell,'));
for(const phrase of ['stories, and anecdotes','layout, and graphics','unique, published'])assert(!copy.about[2].includes(phrase));
const refresh=fs.readFileSync(path.join(dist,'site-refresh.css'),'utf8');
for(const filename of ['refined-sans.otf','refined-sans-bold.otf','editorial-serif-bold.otf','refined-sans-LICENSE.txt'])assert(fs.existsSync(path.join(dist,'assets',filename)));
assert(refresh.includes('--sans: "Nunito Sans"'));
const archivedHomeCSS=fs.readFileSync(path.join(dist,'versions/35/home.css'),'utf8');
const declaration=(css,name)=>css.match(new RegExp('--'+name+': ([^;]+);'))[1];
assert.equal(declaration(refresh,'page-fade-profile'),declaration(archivedHomeCSS,'hero-fade-profile'),'Retain version 35 fade colors and stops');
assert.equal(declaration(refresh,'page-fade-distance'),declaration(archivedHomeCSS,'hero-fade-distance'),'Retain version 35 fade distance');
assert(!refresh.includes('background-attachment: fixed'),'Keep the gradient in the upper page section');
for(const manifestName of ['previous-version.json','version-23.json','version-35.json']){
 const snapshot=JSON.parse(fs.readFileSync(path.join(root,'docs',manifestName),'utf8')),folder=path.dirname(snapshot.path);
 for(const [file,hash]of Object.entries(snapshot.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dist,folder,file))).digest('hex'),hash,'archived file changed: '+folder+'/'+file);
 for(const file of Object.keys(snapshot.files).filter(f=>f.endsWith('.html'))){
  const archivedHTML=fs.readFileSync(path.join(dist,folder,file),'utf8');
  for(const m of archivedHTML.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert(fs.existsSync(path.resolve(dist,folder,path.dirname(file),m[1])),'archived page missing '+m[1]);
 }
}
assert(fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes('Disallow: /previous/'));assert(fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes('Disallow: /versions/'));
console.log('PASS: five-page navigation and mobile menu; phone package browsing/swipes and tablet resize; revised copy, 8 FAQs and unchanged mission; print action in both views, continuous print comparison with gray fine-print rows and copy-footnote placement; thumbnail-only sample access; contacts, fixed-package quantities and archive hashes; all inquiry, mailto and dial actions; card and comparison-cell highlighting, nested event bubbling, plain tier labels, card/header keyboard controls and text selection; comparison-column reveal with controlled scroll geometry; dialog scroll lock/restore and focus; sample pages 38–40, keyboard, pan reset and zoom. Interaction fixtures: 320–1920px. DOM checks do not replace browser visual QA.');
