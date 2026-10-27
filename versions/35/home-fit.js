(() => {
  'use strict';
  const main = document.getElementById('main');
  const hero = document.querySelector('.home-hero');
  const about = document.querySelector('.about-section');
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  if (!main || !hero || !about || !header || !footer) return;

  const height = element => element.getBoundingClientRect().height;
  const setSize = factor => main.style.setProperty('--home-fit', String(factor));
  function fitHome() {
    if (window.innerWidth <= 900) {
      main.style.removeProperty('--home-fit');
      return;
    }
    const available = document.documentElement.clientHeight - height(header) - height(footer) - 2;
    if (available <= 0) return;
    const fits = () => height(hero) + height(about) <= available;
    setSize(1);
    if (fits()) return;
    setSize(0);
    // Keep the minimum reading sizes if the window cannot hold all the text.
    if (!fits()) return;
    let low = 0, high = 1;
    for (let step = 0; step < 10; step++) {
      const candidate = (low + high) / 2;
      setSize(candidate);
      if (fits()) low = candidate;
      else high = candidate;
    }
    setSize(low);
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
