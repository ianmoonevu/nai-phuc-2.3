import assert from 'node:assert/strict';
import { normalizeSiteUrl, sitemapUrls, sitemapXml } from '../src/lib/sitemap';
import { mergeProjects } from '../src/lib/mergeProjects';

assert.equal(normalizeSiteUrl('https://hokimetal.com/'), 'https://hokimetal.com');
for (const url of ['http://hokimetal.vn', 'https://hokimetal.vn/path', 'https://user:pass@hokimetal.vn', 'https://hokimetal.vn/?a=1']) assert.throws(() => normalizeSiteUrl(url));
const projects = mergeProjects([{id:'1',title:'Old'}, {id:'2',title:'Deleted'}], [{id:'1',title:'Updated',slug:'custom-name'}, {id:'3',title:'New Project'}], ['2']);
const urls = sitemapUrls('https://hokimetal.com', projects, [{id:'fiber&one'}]);
assert.ok(urls.includes('https://hokimetal.com/projects/custom-name'));
assert.ok(urls.includes('https://hokimetal.com/projects/new-project'));
assert.ok(!urls.some(url => /deleted|old|admin|hokimetal\.vn/.test(url)));
assert.ok(urls.includes('https://hokimetal.com/products?product=fiber%26one'));
assert.equal(sitemapUrls('https://hokimetal.vn', [{title:'Same'}, {title:'Same'}], []).length, 7);
assert.ok(sitemapXml(['https://hokimetal.vn/?a=1&b=2']).includes('&amp;'));
assert.ok(!sitemapXml(urls).includes('lastmod'));
assert.throws(() => sitemapUrls('https://hokimetal.vn', [{title:''}], []));
console.log('PASS: sitemap domain validation, routes, seed merging/deletions, deduplication, XML escaping.');
