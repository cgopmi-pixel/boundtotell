(() => {
  'use strict';
  const main = document.getElementById('main');
  const story = document.querySelector('.home-story');
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  if (!main || !story || !header || !footer) return;

  const height = element => element.getBoundingClientRect().height;
  const setSize = factor => main.style.setProperty('--home-fit', String(factor));
  function fitHome() {
    if (window.innerWidth <= 1200) {
      main.style.removeProperty('--home-fit');
      return;
    }
    const available = document.documentElement.clientHeight - height(header) - height(footer) - 2;
    if (available <= 0) return;
    // Measure with the prior type sizes so fitting cannot undo the requested
    // reduction. CSS then keeps text 8% smaller within the same bookcase layout.
    main.style.setProperty('--home-type-scale', '1');
    main.style.setProperty('--home-tagline-scale', '1');
    try {
      const fits = () => height(story) <= available;
      // Grow as well as shrink, so taller screens do not leave an empty band.
      setSize(3);
      if (fits()) return;
      setSize(0);
      // Keep the minimum reading sizes if the window cannot hold all the text.
      if (!fits()) return;
      let low = 0, high = 3;
      for (let step = 0; step < 10; step++) {
        const candidate = (low + high) / 2;
        setSize(candidate);
        if (fits()) low = candidate;
        else high = candidate;
      }
      setSize(low);
    } finally {
      main.style.removeProperty('--home-type-scale');
      main.style.removeProperty('--home-tagline-scale');
    }
  }
  let pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(() => { pending = false; fitHome(); });
  }
  fitHome();
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  window.addEventListener('load', schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
})();
