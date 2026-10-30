const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const consultation="Yes! I'd like a free consultation.";
let SEO={};const setSeo=s=>{SEO=s||{}};
const routes=[['home','index.html','Home'],['packages','packages.html','Packages'],['about','about.html','About Us'],['samples','samples.html','Sample & Testimonials'],['faqs','faqs.html','FAQs'],['contact','contact.html','Contact Us']];
function email(pkg){
 const tier=pkg?`${pkg.tier} — ${pkg.name}`:null;
 const subject=tier?`Interested in the ${tier}`:'Memoir inquiry';
 const body=tier?`Hello,\r\n\r\nI'm interested in the ${tier} and would like to arrange a free initial consultation.\r\n\r\nThank you.`:`Hello,\r\n\r\nI'd like to learn more about preserving a life or family story and arranging a free initial consultation.\r\n\r\nThank you.`;
 return 'mailto:info@boundtotell.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
const logo=cls=>`<img class="${cls||''}" src="./assets/bound-to-tell-logo.png" alt="Bound to Tell — Personal &amp; Family Memoirs" width="798" height="301">`;
const cross='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
function header(page){return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a class="brand" href="./index.html" aria-label="Bound to Tell home">${logo()}</a><button id="nav-toggle" class="nav-toggle" aria-controls="site-navigation" aria-expanded="false" aria-label="Open menu" hidden>Menu <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><nav id="site-navigation" aria-label="Main navigation">${routes.map(([id,url,label])=>`<a href="./${url}"${id===page?' aria-current="page"':''}>${esc(label)}</a>`).join('')}</nav></div></header>`;}
const footer=()=>`<footer class="site-footer"><div class="wrap">${logo('footer-logo')}<p>© 2026 Bound to Tell</p></div></footer>`;
function shell(page,title,body,extras=''){return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#563313">${(()=>{const m=SEO[page]||{},url="https://boundtotell.com/"+(page==="home"?"":(routes.find(x=>x[0]===page)||[,""])[1]);const t=m.title||title+" — Bound to Tell",d=m.description||"Bound to Tell — personal and family memoirs, thoughtfully written and designed.";return `<meta name="description" content="${esc(d)}"><title>${esc(t)}</title><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="Bound to Tell"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://boundtotell.com/assets/mockups/hero-book.webp">`;})()}<link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="./assets/nunito-sans-latin.woff2" as="font" type="font/woff2" crossorigin>${page==='home'||page==='about'?'<link rel="preload" href="./assets/raleway-latin.woff2" as="font" type="font/woff2" crossorigin>':''}<link rel="stylesheet" href="./site.css"><link rel="stylesheet" href="./responsive.css"><link rel="stylesheet" href="./compact.css"><link rel="stylesheet" href="./device-layout.css"><link rel="stylesheet" href="./site-refresh.css"><link rel="stylesheet" href="./small-screens.css" media="screen">${page==='home'||page==='packages'?'<link rel="stylesheet" href="./pk-summary.css">':''}${page==='home'?'<link rel="stylesheet" href="./home-v2.css">':''}${page==='about'?'<link rel="stylesheet" href="./about.css">':''}${page==='packages'?'<link rel="stylesheet" href="./print.css">':''}<script src="./common.js" defer></script>${page==='home'?'<script src="./home.js" defer></script>':''}${page==='packages'?'<script src="./package-data.js" defer></script><script src="./packages-ui.js" defer></script>':''}</head><body data-page="${page}">${header(page)}<main id="main">${body}</main>${footer()}${extras}</body></html>\n`;}
function sample(){return `<dialog id="sample-dialog" class="dialog sample-dialog" aria-labelledby="sample-title"><header class="dialog-header"><div class="dialog-title">${logo('sample-viewer-logo')}<h2 id="sample-title">Sample Memoir</h2></div><button id="sample-dialog-close" class="icon-button close-button" aria-label="Close sample viewer">${cross}</button></header><div class="sample-page" role="region" tabindex="0" aria-label="Sample memoir page"><img id="sample-image" src="./assets/book/sample-pdf-38.webp" alt="Sample memoir, PDF page 38" width="864" height="1296"></div><div class="sample-controls"><button id="sample-prev" class="icon-button" aria-label="Previous sample page" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button><p id="sample-caption" aria-live="polite">Page 1 of 3</p><button id="sample-next" class="icon-button" aria-label="Next sample page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button><button id="sample-zoom" class="icon-button" aria-label="Enlarge sample page" title="Enlarge sample page" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6"/><path class="zoom-plus" d="M10 7v6"/></svg></button></div></dialog>`;}
function contactOptions(prefix){return `<div class="contact-options"><div class="contact-method"><span>Call or text</span><a class="button primary phone-connect" href="tel:+17323440886">732.344.0886</a></div><div class="contact-method"><span>Email</span><a id="${prefix}-email" class="button primary email-connect" href="${esc(email())}">info@boundtotell.com</a></div></div>`;}
function inquiry(){return `<dialog id="inquiry-dialog" class="dialog inquiry-dialog" aria-labelledby="inquiry-title inquiry-package" aria-describedby="inquiry-instruction"><header class="dialog-header"><div><p id="inquiry-title" class="inquiry-label">Selected:</p><h2 id="inquiry-package"></h2></div><button id="inquiry-dialog-close" class="icon-button close-button" aria-label="Close package inquiry">${cross}</button></header><div class="inquiry-body"><p id="inquiry-description" class="inquiry-description"></p><p id="inquiry-instruction">Please select an option below to arrange a free initial consultation and discuss the story you'd like to preserve.</p>${contactOptions('inquiry')}</div></dialog>`;}
const icon={
 listen:'<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="12" cy="25" r="5"/><path d="M3 43c0-5.5 4-9.5 9-9.5s9 4 9 9.5"/><circle cx="36" cy="25" r="5"/><path d="M27 43c0-5.5 4-9.5 9-9.5s9 4 9 9.5"/><path d="M19 4h11a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5l-4 3.5V15h-2a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/></svg>',
 create:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 38 32 16l4 4-22 22H10z"/><path d="m29 19 4 4M8 8h14M8 14h9"/></svg>',
 keep:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12c6-2 11-1 16 3 5-4 10-5 16-3v26c-6-2-11-1-16 3-5-4-10-5-16-3z"/><path d="M24 15v26"/></svg>'};
function scheduleDialog(){return `<dialog id="inquiry-dialog" class="dialog inquiry-dialog" aria-labelledby="inquiry-package" aria-describedby="inquiry-instruction"><header class="dialog-header"><div><p class="inquiry-label">Schedule a conversation</p><h2 id="inquiry-package">Free initial consultation</h2></div><button id="inquiry-dialog-close" class="icon-button close-button" aria-label="Close">${cross}</button></header><div class="inquiry-body"><p id="inquiry-instruction">Call, text or email us and we’ll set up a time to talk about the story you’d like to preserve, the scope of the book, package options and timeline.</p>${contactOptions('schedule')}</div></dialog>`;}
function pkSummary(data,base){
 const pk=data.packages.filter(p=>p.id!=='custom'),custom=data.packages.find(p=>p.id==='custom');
 return `<div class="hp-pk-grid">${pk.map(p=>`<article class="hp-pk" id="summary-${p.id}"><p class="hp-pk-tier">${esc(p.tier.replace(' Package',''))}</p><h3>${esc(p.name)}</h3><p class="hp-pk-price">${esc(p.price)}</p><p class="hp-pk-desc">${esc(p.description)}</p><a class="button secondary" href="${base}#compare-${p.id}" data-show="${p.id}">View Package Details</a></article>`).join('')}</div>
 <article class="hp-legacy" id="summary-custom"><div><p class="hp-pk-tier">Custom</p><h3>${esc(custom.name)}</h3><p class="hp-pk-price">${esc(custom.price)}</p><p>Want a larger family history? This package brings together the family’s history, records and stories from many interviewees, and is quoted to fit your project.</p></div><a class="button secondary" href="${base}#compare-custom" data-show="custom">View Family Legacy Details</a></article>`;
}
function home(copy,data){
 const h=copy.home,schedule=(cls='primary')=>`<button class="button ${cls}" data-schedule aria-haspopup="dialog" aria-controls="inquiry-dialog">Schedule a Conversation</button>`;
 const pk=data.packages.filter(p=>p.id!=='custom'),custom=data.packages.find(p=>p.id==='custom');
 const body=`
<section class="hp-hero" aria-labelledby="hero-title"><div class="wrap hp-hero-grid">
 <div class="hp-hero-copy"><h1 id="hero-title">${esc(h.hero.title)}</h1><p class="hp-lede">${esc(h.hero.text)}</p>
 <div class="hp-actions"><a class="button primary" href="#packages">Explore Packages</a>${schedule('secondary')}</div>
 <ul class="hp-facts">${h.hero.facts.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></div>
 <figure class="hp-hero-media"><img src="./assets/mockups/hero-book.webp" alt="A finished Bound to Tell softcover memoir, A Collection of Memories" width="1200" height="1200" fetchpriority="high"></figure>
</div></section>

<section class="hp-why" aria-labelledby="why-title"><div class="wrap">
 <div class="hp-why-grid">
  <div class="hp-why-head"><h2 id="why-title" class="hp-h2">${esc(h.why.title)}</h2><p class="hp-why-lead">${esc(h.why.lead)}</p></div>
  <ul class="hp-prompts">${h.why.prompts.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
 </div>
 <div class="hp-why-close"><p>${esc(h.why.close[0])}</p><p class="hp-why-strong">${esc(h.why.close[1])}</p></div>
</div></section>

<section class="hp-matters" aria-labelledby="matters-title"><div class="wrap hp-narrow">
 <h2 id="matters-title" class="hp-objection">${esc(h.matters.objection)}</h2>
 <p class="hp-answer">${esc(h.matters.answer)}<br>${esc(h.matters.want)}</p>
 <ul class="hp-memories">${h.matters.list.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
 <p class="hp-matters-close">${esc(h.matters.close)}</p>
</div></section>

<section class="hp-product" aria-labelledby="product-title"><div class="wrap">
 <div class="hp-product-head"><h2 id="product-title" class="hp-h2">${esc(h.product.title)}</h2><p>${esc(h.product.text)}</p></div>
 <div class="hp-product-grid">
  <figure class="hp-spread"><img src="./assets/mockups/interior-spread.webp" alt="An open Bound to Tell memoir showing a chapter opening with photographs and captions" width="1641" height="1279" loading="lazy"></figure>
  <div class="hp-features"><ul>${h.product.features.map(f=>`<li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join('')}</ul>
  <button class="button secondary" data-open-sample aria-haspopup="dialog" aria-controls="sample-dialog">Read sample pages</button></div>
 </div>
</div></section>

<section class="hp-how" aria-labelledby="how-title"><div class="wrap">
 <h2 id="how-title" class="hp-h2 hp-center">How it works</h2>
 <ol class="hp-steps">${h.steps.map((s,i)=>`<li><span class="hp-step-icon">${[icon.listen,icon.create,icon.keep][i]}</span><span class="hp-step-num">${i+1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
</div></section>

<section class="hp-gift" aria-labelledby="gift-title"><div class="wrap hp-split">
 <figure class="hp-gift-quote"><span class="hp-qmark" aria-hidden="true">“</span><blockquote>${esc(h.gift.quote.text)}</blockquote><span class="hp-qmark hp-qmark-close" aria-hidden="true">”</span><figcaption>${esc(h.gift.quote.author)}</figcaption></figure>
 <div class="hp-gift-copy"><p class="hp-gift-eyebrow">${esc(h.gift.eyebrow)}</p><h2 id="gift-title" class="hp-h2">${esc(h.gift.title)}</h2><p>${esc(h.gift.text)}</p>${schedule('primary')}</div>
</div></section>

<section class="hp-packages" id="packages" aria-labelledby="packages-title"><div class="wrap">
 <h2 id="packages-title" class="hp-h2 hp-center">Packages</h2>
 <p class="hp-center hp-sub">Every package includes guided interviews, writing and editing, interior and cover design, photo placement, a print-ready digital edition and printed books.</p>
 ${pkSummary(data,'./packages.html')}
</div></section>

<section class="hp-cta" aria-labelledby="cta-title"><div class="wrap hp-narrow hp-center">
 <h2 id="cta-title">${esc(h.cta.title)}</h2><p>${esc(h.cta.text)}</p>${schedule('light')}
 <p class="hp-cta-contact"><a href="tel:+17323440886">732.344.0886</a><span aria-hidden="true">·</span><a href="${esc(email())}">info@boundtotell.com</a></p>
</div></section>`;
 return shell('home','Home',body,scheduleDialog()+sample());
}
function about(copy){
 const [intro,promise,process,mission]=copy.about;
 return shell('about','About Us',`<section class="ab-page faq-page" aria-labelledby="about-title"><div class="wrap ab-col">
 <header class="page-heading"><h1 id="about-title" class="section-title">About Us</h1></header>
 <p class="ab-intro">${esc(intro)}</p>
 <p class="ab-promise">${esc(promise)}</p>
 <p class="ab-process">${esc(process)}</p>
 <ul class="ab-steps" aria-label="What we do"><li>Private, one-on-one interviews</li><li>A clear, cohesive narrative</li><li>Design, layout and graphics</li><li>A unique published memoir</li></ul>
 <figure class="ab-mission"><span class="ab-qmark" aria-hidden="true">“</span><p>${esc(mission)}</p></figure>
 <div class="ab-actions"><a class="button primary" href="./packages.html">Explore Packages</a><a class="button secondary" href="./contact.html">Contact Us</a></div>
</div></section>`);
}
function samples(copy){return shell('samples','Sample & Testimonials',`<div class="samples-layout wrap"><section class="sample-column" aria-label="Sample Memoir"><button id="sample-open" class="sample-preview" data-open-sample aria-label="Open Sample Memoir" aria-haspopup="dialog" aria-controls="sample-dialog"><img src="./assets/book/sample-pdf-38.webp" alt="Preview of Sample Memoir" width="864" height="1296"><span class="sample-preview-label">Sample Memoir</span></button></section><section class="client-testimonials" aria-labelledby="testimonials-heading"><h1 id="testimonials-heading" class="section-title">From our Satisfied Clients</h1><div class="testimonial-grid">${copy.testimonials.map(t=>`<figure><span class="quote-mark" aria-hidden="true">“</span><blockquote>${esc(t.quote)}</blockquote><figcaption>${esc(t.author)}</figcaption><span class="quote-mark closing-quote" aria-hidden="true">”</span></figure>`).join('')}</div></section></div>`,sample());}
function faqs(copy){return shell('faqs','FAQs',`<section class="faq-page wrap" aria-labelledby="faq-heading"><header class="page-heading"><h1 id="faq-heading" class="section-title">Frequently Asked Questions</h1></header><div class="faq-list">${copy.faqs.map((f,i)=>`<details id="faq-${i+1}"><summary>${esc(f.question)}<span class="disclosure-symbol" aria-hidden="true"></span></summary><div class="faq-answer">${f.answer.map(t=>`<p>${esc(t)}</p>`).join('')}</div></details>`).join('')}</div></section>`);}
function copies(p,mode='card'){
 if(p.id==='custom'||mode==='table')return esc(p.copies);
 const marker=mode==='print'?'<sup>*</sup>':`<a class="footnote-ref" href="#${mode==='table'?'table-':''}copy-note-${p.id}" aria-label="See additional copies note">*</a>`;
 return esc(p.copies)+marker;
}
const detailRows=[['Estimated page count','pages'],['Photographs','photos'],['Interviewees','interviewees'],['Printed copies','copies'],['Print-ready digital edition',null],['Word count','words'],['Interview time','hours'],['Revision rounds','revisions']];
const fineKeys=['words','hours','revisions'];
function rows(data,print=false,section='all'){
 return detailRows.filter(([,key])=>section==='all'||(section==='fine'?fineKeys.includes(key):!fineKeys.includes(key))).map(([label,key])=>`<tr${fineKeys.includes(key)?' class="fine-row"':''}><th scope="row">${label}</th>${data.packages.map(p=>p.customized&&['hours','revisions'].includes(key)?'':`<td${print?'':` data-column="${p.id}"`}${p.customized&&key==='words'?' class="custom-note" rowspan="3"':''}>${p.customized&&key==='words'?esc(p.customized):key==='copies'?copies(p,print?'print':'table'):key?esc(p[key]):'Included'}</td>`).join('')}</tr>`).join('');
}
function copyFootnotes(data,print=false){return `<tr class="fine-row copy-options"><th scope="row">Additional copies</th>${data.packages.map(p=>`<td${print?'':` data-column="${p.id}"${p.id==='custom'?'':` id="table-copy-note-${p.id}"`}`}>${p.id==='custom'?'':(print?'* ':'')+'Possibility of additional copies'}</td>`).join('')}</tr>`;}
function printSheet(data){return `<section id="package-print" aria-label="Printable package comparison"><header class="print-heading">${logo('print-logo')}<h1>Packages</h1></header><p class="print-inclusions"><strong>Every package includes:</strong> ${esc(data.inclusions.join(' · '))}</p><table id="print-comparison"><colgroup><col class="print-label-column"><col span="4"></colgroup><thead><tr><th scope="col">Package details</th>${data.packages.map(p=>`<th scope="col"><strong>${esc(p.tier)}</strong><span class="print-package-name">${esc(p.name)}</span><span class="print-price">${esc(p.price)}</span></th>`).join('')}</tr></thead><tbody>${rows(data,true)}${copyFootnotes(data,true)}</tbody></table><div class="print-notes"><p>${esc(data.pageNote+' '+data.priceNote)}</p></div><footer class="print-contact"><span>boundtotell.com</span><span>info@boundtotell.com</span><span>732.344.0886</span></footer></section>`;}
function packagePage(data){
 const select=p=>`<div class="package-actions"><button class="button primary" data-inquire="${p.id}" aria-haspopup="dialog" aria-controls="inquiry-dialog" aria-label="${esc(consultation)} ${esc(p.tier)}">${esc(consultation)}</button></div>`;
 const table=`<table id="comparison-table"><caption class="sr-only">Compare the four Bound to Tell memoir packages</caption><colgroup><col class="comparison-label-column"><col span="4"></colgroup><thead><tr><th id="comparison-label" scope="col">Package details</th>${data.packages.map(p=>`<th id="compare-${p.id}" scope="col" data-column="${p.id}" tabindex="0" aria-describedby="package-keyboard-help"><strong>${esc(p.tier)}</strong><span>${esc(p.name)}</span><span class="compare-price">${esc(p.price)}</span></th>`).join('')}</tr></thead><tbody>${rows(data)}${copyFootnotes(data)}<tr><th scope="row">Next step</th>${data.packages.map(p=>`<td data-column="${p.id}">${select(p)}</td>`).join('')}</tr></tbody></table>`;
 return shell('packages','Packages',`<section class="packages-section wrap"><header class="page-heading"><h1 class="section-title">Packages</h1></header><section class="included" aria-labelledby="included-heading"><h2 id="included-heading">Every package includes</h2><ul>${data.inclusions.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section><div class="pk-summary">${pkSummary(data,'')}</div><p id="package-status" class="sr-only" aria-live="polite"></p><p id="package-keyboard-help" class="sr-only">Press Enter or Space to highlight a package.</p><section id="comparison-panel" aria-labelledby="compare-heading"><h2 id="compare-heading" class="compare-heading">Compare package details</h2><p id="comparison-help" class="table-instruction">Click any package column to highlight it. <span>Swipe across to compare all four. Scroll within the table for more details.</span></p><div id="comparison-scroll" class="table-scroll" role="region" tabindex="0" aria-label="Memoir package comparison" aria-describedby="comparison-help">${table}</div></section><div class="package-bottom"><div class="pricing-notes"><p class="pricing-note">${esc(data.pageNote+' '+data.priceNote)}</p></div><button id="print-packages" class="button primary">Print package details</button></div><noscript><p>To discuss a package, please visit our <a href="./contact.html">Contact Us page</a>.</p></noscript></section>`,inquiry()+printSheet(data));
}
function contact(){return shell('contact','Contact Us',`<section class="contact-page wrap" aria-label="Contact Us"><h1 class="sr-only">Contact Us</h1><div class="contact-layout"><div class="contact-copy"><h2>Want to preserve your family’s story? Questions?<em>Let’s get in touch.</em></h2><p>Start with a free initial consultation. We’ll discuss the story you’d like to preserve, the scope of the book, package options and expected timeline.</p></div><div class="contact-card">${contactOptions('contact')}</div></div></section>`);}
module.exports={setSeo,home,about,packagePage,contact,samples,faqs,email};
