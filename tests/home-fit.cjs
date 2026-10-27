const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const script = fs.readFileSync(path.join(__dirname, '../dist/home-fit.js'), 'utf8');
// Controlled measurements test fitting and fallback behavior, not browser rendering.
function fixture(width = 1440, viewportHeight = 993) {
  const values = new Map(), events = {}, frames = [];
  let fontReady, extraTextHeight = 0;
  const factor = () => Number(values.get('--home-fit') ?? 1);
  const measured = () => 440 + 610 * factor() + (factor() > .55 ? 30 : 0) + extraTextHeight;
  const box = fn => ({getBoundingClientRect: () => ({height: fn()})});
  const main = {style: {setProperty: (k, v) => values.set(k, v), removeProperty: k => values.delete(k)}};
  const elements = {'.home-story': box(measured), '.site-header': box(() => 90), '.site-footer': box(() => 104)};
  const document = {getElementById: () => main, querySelector: s => elements[s], documentElement: {clientHeight: viewportHeight}, fonts: {ready: {then: fn => {fontReady = fn;}}}};
  const window = {innerWidth: width, addEventListener: (k, fn) => {events[k] = fn;}, requestAnimationFrame: fn => frames.push(fn)};
  vm.runInNewContext(script, {window, document});
  return {values, window, document, events, frames, factor, measured,
    budget: () => document.documentElement.clientHeight - 196,
    fontsChange: () => {extraTextHeight = 60; fontReady();},
    flush: () => {while (frames.length) frames.shift()();}};
}
const normal = fixture();
assert(normal.measured() <= normal.budget(), 'Include header and footer in available height');
assert(normal.factor() > .54, 'Keep the largest fitting version across a text-wrap step');
assert(normal.budget() - normal.measured() < 30, 'Do not leave a broad empty band');
normal.fontsChange(); normal.flush();
assert(normal.measured() <= normal.budget(), 'Recheck when the real fonts change wrapping');
assert(normal.factor() < .5);
normal.document.documentElement.clientHeight = 1400;
normal.events.resize(); normal.events.resize();
assert.equal(normal.frames.length, 1, 'Batch resize events into one layout update');
normal.flush();
assert(normal.factor() > 1, 'Enlarge the content to use taller windows');
assert(normal.measured() <= normal.budget());
assert(normal.budget() - normal.measured() < 3, 'Use the available height after enlarging');
const tall = fixture(1920, 2600);
assert.equal(tall.factor(), 3, 'Cap enlargement on unusually tall screens');
for (const width of [1201, 1280, 1440, 1920]) {
  const tablet = fixture(width, 1024);
  assert(tablet.values.has('--home-fit'), 'Fit large-screen Home');
  assert(tablet.measured() <= tablet.budget());
}
normal.window.innerWidth = 1200; normal.events.resize(); normal.flush();
assert(!normal.values.has('--home-fit'), 'Leave phone and tablet typography to compact responsive styles');
for (const width of [320, 390, 540, 600, 760, 768, 820, 900, 1024, 1200]) assert(!fixture(width).values.has('--home-fit'));
normal.window.innerWidth = 1440; normal.events.resize(); normal.flush();
assert(normal.values.has('--home-fit'));assert(normal.measured() <= normal.budget(), 'Restore desktop fitting after compact layout and orientation changes');
const short = fixture(1280, 430);
assert.equal(short.factor(), 0, 'Keep readable minimums and permit natural scrolling on short windows');
assert(short.measured() > short.budget());
for (const page of [normal, tall, short]) for (const property of ['--home-type-scale', '--home-tagline-scale']) assert(!page.values.has(property), 'Restore the smaller type after every fitting exit, including fallback and maximum sizes');
const home = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
assert(home.includes('<script src="./home-fit.js" defer></script>'));
for (const file of ['packages.html', 'samples.html', 'faqs.html', 'contact.html']) assert(!fs.readFileSync(path.join(__dirname, '../dist', file), 'utf8').includes('home-fit.js'));
console.log('PASS: Home fitting includes header/footer, keeps the largest fitting size, handles font loading and resize, and preserves small-screen and short-window fallbacks. Controlled geometry does not verify rendered layout.');
