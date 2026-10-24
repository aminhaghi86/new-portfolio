import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const origin = 'https://www.haghiweb.ir';
const root = new URL('../dist/', import.meta.url);
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 7, 'Unexpected indexable route count.');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URL.');
const titles = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  assert.ok(url.startsWith(origin + '/'), 'Unexpected canonical origin.');
  const html = await readFile(new URL(`.${path}index.html`, root), 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `Missing or duplicate title: ${url}`); titles.add(title);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One h1 required: ${url}`);
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Canonical mismatch: ${url}`);
  assert.ok(html.includes(`<meta property="og:url" content="${url}"`), `OG URL mismatch: ${url}`);
  assert.ok(html.includes('content="index, follow"'), `Unexpected robots: ${url}`);
  assert.ok(html.includes(`lang="${path === '/en/' ? 'en' : 'fa'}"`), `Language mismatch: ${url}`);
  const graph = JSON.parse(html.match(/<script id="site-structured-data" type="application\/ld\+json">(.*?)<\/script>/s)?.[1]);
  assert.equal(graph['@graph'].filter(item => item['@type'] === 'Person').length, 1);
  assert.equal(graph['@graph'].find(item => item['@type'] === 'WebPage').url, url);
  assert.ok(!html.includes('localhost:3000'), `Public localhost link: ${url}`);
  assert.ok(!/caseStudies\.\d+\./.test(html), `Untranslated case key: ${url}`);
  if (path === '/' || path === '/en/') {
    for (const lang of ['fa', 'en', 'x-default']) assert.ok(html.includes(`hreflang="${lang}"`), `Missing alternate: ${url}`);
    if (path === '/en/') assert.ok(html.includes('Business websites and inquiry workflows'), 'English SSR missing.');
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    if (match[1] === '/404.html') continue;
    const file = match[1].endsWith('/') ? `${match[1]}index.html` : match[1];
    await access(new URL(`.${file}`, root));
  }
}
const notFound = await readFile(new URL('404.html', root), 'utf8');
assert.ok(notFound.includes('content="noindex, follow"'), '404 must not be indexable.');
assert.ok(!sitemap.includes('404.html'));
const robots = await readFile(new URL('robots.txt', root), 'utf8');
assert.ok(robots.includes(`${origin}/sitemap.xml`));
console.log(`SEO checks passed: ${urls.length} rendered pages, metadata, structured data, local links, sitemap and 404.`);
