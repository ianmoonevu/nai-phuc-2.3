import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { transformSync } from 'esbuild';
const require = createRequire(import.meta.url);
function load(file, deps = {}, globals = {}) {
  const module = { exports: {} };
  const code = transformSync(readFileSync(new URL(file, import.meta.url), 'utf8'), { loader: 'tsx', format: 'cjs' }).code;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => deps[name] || require(name), URL, ...globals });
  return module.exports;
}
const lib = load('../src/lib/analytics.ts');
assert.equal(lib.normalizeGa4Id(' g-ABC1234567 '), 'G-ABC1234567');
for (const id of ['GTM-12345', '<script>alert(1)</script>', '', null]) assert.equal(lib.normalizeGa4Id(id), '');
assert.equal(lib.analyticsLocation('https://hokimetal.com/products?product=HF-8060&email=user@test.com#secret'), 'https://hokimetal.com/products?product=HF-8060');
let calls = []; const track = lib.createPageTracker((...args) => calls.push(args));
track('https://hokimetal.vn/'); track('https://hokimetal.vn/#top'); track('https://hokimetal.vn/projects'); track('https://hokimetal.vn/');
assert.equal(calls.length, 3); assert.equal(calls[1][1], 'https://hokimetal.vn/');

let effect, cleanup, timer; let scripts = [];
const window = { location: { href: 'https://hokimetal.vn/', pathname: '/' }, addEventListener() {}, removeEventListener() {} };
const history = { pushState(_s,_t,path) { window.location.href = new URL(path, window.location.href).href; window.location.pathname = new URL(window.location.href).pathname; }, replaceState(...args) { this.pushState(...args); } };
let data = { branding: { ga4MeasurementId: 'G-ABC1234567', ga4Enabled: false }, isAdminAuthenticated: false };
const component = load('../src/components/Analytics.tsx', { react: { useEffect(fn) { effect = fn; } }, '../context/DataContext': { useData: () => data }, '../lib/analytics': lib }, {
  window, history, document: { title: 'HOKI', getElementById: id => scripts.find(s => s.id === id), createElement: () => ({}), head: { appendChild(s) { scripts.push(s); } } },
  setTimeout(fn) { timer = fn; return 1; }, clearTimeout() { timer = undefined; },
});
component.Analytics(); effect(); assert.equal(scripts.length, 0);
data.branding.ga4Enabled = true; component.Analytics(); cleanup = effect(); timer();
assert.equal(scripts.length, 1);
const events = () => window.dataLayer.map(a => Array.from(a)).filter(a => a[0] === 'event');
assert.equal(events().length, 1);
history.pushState(null,'','/projects'); timer(); assert.equal(events().length, 2);
history.replaceState(null,'','/projects'); timer(); assert.equal(events().length, 2);
history.pushState(null,'','/admin'); timer(); assert.equal(events().length, 2); assert.equal(window['ga-disable-G-ABC1234567'], true);
cleanup(); data.isAdminAuthenticated = true; component.Analytics(); effect(); assert.equal(scripts.length, 1); assert.equal(window['ga-disable-G-ABC1234567'], true);
const backup = load('../src/lib/contentBackup.ts');
const original = { branding: { hotlinePhone: 'existing', ga4MeasurementId: 'G-ABC1234567', ga4Enabled: true } };
const restored = backup.validateBackup(backup.createBackup(original));
assert.equal(restored.branding.ga4MeasurementId, 'G-ABC1234567');
assert.equal(backup.mergeBackup(original, { branding: { headerLogoUrl: '/logo.svg' } }, 'merge').branding.ga4Enabled, true);
console.log('PASS: ID validation, URL privacy, navigation deduplication, disabled/admin suppression, script loading, backup roundtrip.');

// Installed GTM suppresses the legacy injector even with an enabled direct ID.
scripts.push({ id: 'hoki-gtm' });
data.isAdminAuthenticated = false;
const beforeGtm = window.dataLayer.length;
component.Analytics(); effect();
assert.equal(window.dataLayer.length, beforeGtm);
assert.equal(scripts.filter(s => s.id.startsWith('hoki-ga4')).length, 1);
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.equal((html.match(/GTM-5TCPTXZ2/g) || []).length, 2);
assert.ok(html.indexOf('id="hoki-gtm"') < html.indexOf('</head>'));
assert.ok(/<body[^>]*>\s*<!-- Google Tag Manager \(noscript\) -->\s*<noscript>/.test(html));
console.log('PASS: GTM snippet placement, container ID and legacy GA4 suppression.');
