(() => {
  'use strict';
  const { packages, inclusions, priceNote } = window.BOUND_TO_TELL;
  const $ = id => document.getElementById(id);
  let selected = null;
  const currency = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const price = p => (p.startingAt ? 'Starting at ' : '') + currency(p.price);
  const details = p => p.scope || [p.wordLimit, p.pages, p.interviews, p.interviewees, p.photos, p.revisions, 'Print-ready digital edition', p.copies];
  const compactDetails = p => p.scope ? p.scope.slice(0, 4) : [p.wordLimit, p.interviews, p.photos, p.shortCopies];
  const check = '<span class="check" aria-hidden="true">✓</span>';
  const listItems = arr => arr.map(t => `<li>${check}<span>${t}</span></li>`).join('');

  $('inclusions').innerHTML = listItems(inclusions);
  $('summary-inclusions-list').innerHTML = listItems(inclusions);

  let beginAnimation;
  $('begin-link').addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const main = $('main');
    if (typeof main.animate === 'function') {
      beginAnimation?.cancel();
      const reduced = reducedMotion();
      const distance = reduced ? 2 : 9;
      beginAnimation = main.animate([
        { transform: 'translateY(0)', offset: 0 },
        { transform: `translateY(${distance}px)`, offset: 0.35 },
        { transform: `translateY(${reduced ? 0 : -2}px)`, offset: 0.75 },
        { transform: 'translateY(0)', offset: 1 }
      ], { duration: reduced ? 150 : 380, easing: 'ease-out' });
    }
  });

  const samplePages = [38, 39, 40];
  let sampleIndex = 0;
  function showSample(index) {
    sampleIndex = Math.max(0, Math.min(samplePages.length - 1, index));
    const page = samplePages[sampleIndex];
    $('sample-image').setAttribute('src', `./assets/book/sample-pdf-${page}.webp`);
    $('sample-image').setAttribute('alt', `Sample memoir, PDF page ${page}`);
    $('sample-caption').textContent = `Page ${sampleIndex + 1} of ${samplePages.length}`;
    $('sample-prev').disabled = sampleIndex === 0;
    $('sample-next').disabled = sampleIndex === samplePages.length - 1;
  }
  $('sample-open').addEventListener('click', () => {
    showSample(0);
    $('sample-dialog').showModal();
    $('sample-close').focus();
  });
  $('sample-prev').addEventListener('click', () => showSample(sampleIndex - 1));
  $('sample-next').addEventListener('click', () => showSample(sampleIndex + 1));
  $('sample-close').addEventListener('click', () => $('sample-dialog').close());
  $('sample-dialog').addEventListener('close', () => $('sample-open').focus());
  $('sample-dialog').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showSample(sampleIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showSample(sampleIndex + 1); }
  });
  $('package-cards').innerHTML = packages.map((p, i) => `
    <article class="package-card" id="card-${p.id}" aria-labelledby="title-${p.id}">
      <div class="card-topline"><span class="card-number">0${i + 1}</span><span class="scope-tag">${p.label}</span></div>
      <h3 id="title-${p.id}">${p.name}</h3>
      <p class="card-price">${p.startingAt ? '<small>Starting at</small>' : ''}${currency(p.price)}</p>
      <p class="card-description">${p.description}</p>
      <div class="card-divider"></div>
      <ul class="card-features" id="features-${p.id}">${listItems(compactDetails(p))}</ul>
      <button class="details-toggle" id="expand-${p.id}" aria-expanded="false" aria-controls="features-${p.id} distinction-${p.id}">Details <span aria-hidden="true">+</span></button>
      <div class="card-distinction" id="distinction-${p.id}" hidden><p class="distinction">${p.distinction}</p>${p.scope ? '<p class="custom-disclaimer">Possible project elements; final scope and price estimate follow an initial consultation.</p>' : ''}</div>
      <button class="button card-select" data-select="${p.id}" aria-pressed="false" aria-label="Select ${p.name}">Select</button>
    </article>`).join('');

  // Match compact cards to each other, independently of any open details.
  function alignClosedCards() {
    const cards = packages.map(p => $('card-' + p.id));
    cards.forEach(card => { card.style.minHeight = ''; });
    if ($('package-cards').hidden || window.innerWidth <= 650) return;
    const closed = cards.filter(card => !card.classList.contains('details-expanded'));
    if (!closed.length) return;
    const height = Math.ceil(Math.max(...closed.map(card => card.getBoundingClientRect().height)));
    closed.forEach(card => { card.style.minHeight = `${height}px`; });
  }
  let alignmentFrame;
  function queueCardAlignment() {
    if (typeof window.requestAnimationFrame !== 'function') { alignClosedCards(); return; }
    window.cancelAnimationFrame(alignmentFrame);
    alignmentFrame = window.requestAnimationFrame(alignClosedCards);
  }
  window.addEventListener('resize', queueCardAlignment);
  document.fonts?.ready.then(queueCardAlignment);
  queueCardAlignment();

  packages.forEach(p => $('expand-' + p.id).addEventListener('click', () => {
    const button = $('expand-' + p.id);
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    button.innerHTML = expanded ? 'Show less <span aria-hidden="true">−</span>' : 'Details <span aria-hidden="true">+</span>';
    $('features-' + p.id).innerHTML = listItems(expanded ? details(p) : compactDetails(p));
    $('features-' + p.id).classList.toggle('expanded', expanded);
    $('card-' + p.id).classList.toggle('details-expanded', expanded);
    $('distinction-' + p.id).hidden = !expanded;
    queueCardAlignment();
  }));

  const rows = [
    ['Word count', 'wordLimit'], ['Approximate pages', 'pages'], ['Interview time', 'interviews'], ['Interviewees', 'interviewees'], ['Photographs', 'photos'], ['Revision rounds', 'revisions'], ['Printed books', 'copies'], ['Print-ready digital edition', null]
  ];
  $('comparison-table').innerHTML = `<thead><tr><th scope="col">Package details</th>${packages.map(p => `<th scope="col" data-column="${p.id}"><span>${p.name}</span><strong>${price(p)}</strong></th>`).join('')}</tr></thead><tbody>${rows.map(([label, field]) => `<tr><th scope="row">${label}</th>${packages.map(p => `<td data-column="${p.id}">${field ? p[field] : 'Included'}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">Choose your package</th>${packages.map(p => `<td data-column="${p.id}"><button class="button table-select" data-select="${p.id}" aria-pressed="false" aria-label="Select ${p.name}">Select</button></td>`).join('')}</tr></tbody>`;

  function updateSelection(id, moveFocus = true) {
    const previous = selected;
    const p = packages.find(p => p.id === id);
    selected = p || null;
    $('empty-choice').hidden = !!p;
    $('selected-choice').hidden = !p;
    $('choice-instruction').textContent = p ? 'Download or save the details to decide on the best fit.' : 'Select a package and download or save the details to decide on the best fit.';
    $('action-status').textContent = '';
    document.querySelectorAll('[data-select]').forEach(button => {
      const active = button.dataset.select === p?.id;
      button.setAttribute('aria-pressed', String(active));
      button.innerHTML = active ? 'Deselect' : 'Select';
      button.setAttribute('aria-label', `${active ? 'Remove selection of' : 'Select'} ${packages.find(item => item.id === button.dataset.select).name}`);
    });
    document.querySelectorAll('[data-fit]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.fit === p?.id)));
    packages.forEach(item => {
      $(`card-${item.id}`).classList.toggle('selected', item.id === p?.id);
      $(`card-${item.id}`).classList.toggle('suggested', false);
    });
    document.querySelectorAll('[data-column]').forEach(cell => cell.classList.toggle('selected-column', cell.dataset.column === p?.id));
    $('fit-feedback').textContent = p ? `${p.name}: ${p.distinction}${p.scope ? ' Scope and a price estimate follow an initial consultation.' : ''}` : 'Select a scope to highlight its matching package, or explore all four below.';
    if (p) {
      $('selected-name').textContent = p.name;
      $('selected-price').textContent = price(p);
      $('selected-description').textContent = p.description;
      $('selected-details').innerHTML = listItems(details(p));
      $('legacy-note').hidden = !p.scope;
      buildPrintContent(p);
      if (moveFocus) {
        $('your-choice').scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
        $('selected-name').focus({ preventScroll: true });
      }
    } else {
      $('print-content').innerHTML = '';
      if (previous) $('action-status').textContent = 'Selection cleared. You can choose another package above.';
      if (moveFocus) {
        $('empty-choice-heading').focus({ preventScroll: true });
      }
    }
  }

  function reducedMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function summaryText(p) {
    return ['BOUND TO TELL', 'PERSONAL & FAMILY MEMOIRS', '', 'YOUR SELECTED PACKAGE', p.name, price(p), '', p.description, '', p.scope ? 'POSSIBLE CUSTOM PROJECT ELEMENTS' : 'PACKAGE DETAILS', ...details(p).map(t => `• ${t}`), ...(p.scope ? ['', 'The scope and a price estimate are determined following an initial consultation. Project elements are tailored to the agreed scope.'] : []), '', 'EVERY PACKAGE INCLUDES', ...inclusions.map(t => `• ${t}`), '', 'PRICING NOTES', priceNote, '', 'This selection is for planning. It does not place an order, reserve services, or send an inquiry.', '', 'Let’s tell your story.', '732.344.0886 • info@boundtotell.com'].join('\n');
  }

  function buildPrintContent(p) {
    $('print-content').innerHTML = `<div class="print-brand">Bound <em>to</em> Tell</div><p>PERSONAL &amp; FAMILY MEMOIRS</p><hr><p>Your selected package</p><h1>${p.name}</h1><h2>${price(p)}</h2><p>${p.description}</p><h3>${p.scope ? 'Possible custom project elements' : 'Package details'}</h3><ul>${details(p).map(t => `<li>${t}</li>`).join('')}</ul>${p.scope ? '<p>The scope and a price estimate are determined following an initial consultation. Project elements are tailored to the agreed scope.</p>' : ''}<h3>Every package includes</h3><ul>${inclusions.map(t => `<li>${t}</li>`).join('')}</ul><p class="print-small">${priceNote}</p><p class="print-small">This selection is for planning. It does not place an order, reserve services, or send an inquiry.</p><hr><p>Let’s tell your story.<br>732.344.0886 · info@boundtotell.com</p>`;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-select]');
    if (button) {
      const remove = selected?.id === button.dataset.select;
      updateSelection(remove ? null : button.dataset.select, !remove);
    }
  });
  $('clear-choice').addEventListener('click', () => updateSelection(null));

  function showView(table) {
    $('package-cards').hidden = table;
    $('comparison-panel').hidden = !table;
    $('cards-view').classList.toggle('active', !table);
    $('table-view').classList.toggle('active', table);
    $('cards-view').setAttribute('aria-pressed', String(!table));
    $('table-view').setAttribute('aria-pressed', String(table));
    queueCardAlignment();
  }
  $('cards-view').addEventListener('click', () => showView(false));
  $('table-view').addEventListener('click', () => showView(true));

  document.querySelectorAll('[data-fit]').forEach(button => button.addEventListener('click', () => {
    updateSelection(selected?.id === button.dataset.fit ? null : button.dataset.fit, false);
  }));

  $('save-summary').addEventListener('click', () => {
    if (!selected) return;
    const blob = new Blob([summaryText(selected)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Bound-to-Tell-${selected.name.replaceAll(' ', '-')}-Summary.txt`;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('action-status').textContent = 'Your package summary has been downloaded.';
  });
  $('print-summary').addEventListener('click', () => { if (selected) { buildPrintContent(selected); window.print(); } });
  // Clear older saved preferences; all new selections live only in page memory.
  try { localStorage.removeItem('bound-to-tell-package-v1'); } catch { /* Optional cleanup. */ }
  window.addEventListener('pageshow', () => updateSelection(null, false));
})();
