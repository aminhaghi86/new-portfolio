import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { build, createServer, loadEnv } from 'vite';

await build();
let server;
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const env = loadEnv('production', process.cwd(), '');
const verification = process.env.GOOGLE_SITE_VERIFICATION || env.GOOGLE_SITE_VERIFICATION || '';
if (verification && !/^[A-Za-z0-9_-]{10,200}$/.test(verification)) throw new Error('Invalid Search Console verification value. Use only the content value supplied by Google.');

try {
  server = await createServer({ mode: 'production', appType: 'custom', server: { middlewareMode: true, watch: null, hmr: false, ws: false }, ssr: { noExternal: ['gsap', '@gsap/react'] } });
  const { render, routes } = await server.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const marker = '<div id="root"></div>';
  if (!template.includes(marker)) throw new Error('Empty root marker not found.');

  for (const path of [...routes, '/404.html']) {
    const { markup, metadata: meta } = await render(path);
    if ((markup.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`Expected one h1: ${path}`);
    if (path === '/' && !markup.includes('id="contact"')) throw new Error('Homepage missing contact form.');
    let html = template.replace(marker, () => `<div id="root">${markup}</div>`)
      .replace(/<html[^>]*>/, `<html lang="${meta.lang}" dir="${meta.lang === 'fa' ? 'rtl' : 'ltr'}">`)
      .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escape(meta.title)}</title>`)
      .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escape(meta.canonical)}" />`);
    for (const [attribute, name, content] of [
      ['name', 'description', meta.description], ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description], ['property', 'og:url', meta.canonical],
      ['property', 'og:locale', meta.lang === 'fa' ? 'fa_IR' : 'en_US'],
    ]) html = html.replace(new RegExp(`<meta ${attribute}="${name}"[\\s\\S]*?/>`), () => `<meta ${attribute}="${name}" content="${escape(content)}" />`);
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script id="site-structured-data" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.graph }).replace(/</g, '\\u003c')}</script>`);
    const extra = [
      `<meta name="robots" content="${meta.known ? 'index, follow' : 'noindex, follow'}" />`,
      `<meta name="twitter:title" content="${escape(meta.title)}" />`,
      `<meta name="twitter:description" content="${escape(meta.description)}" />`,
      '<meta name="twitter:image" content="https://www.haghiweb.ir/social-card.png" />',
      ...meta.alternates.map(item => `<link rel="alternate" hreflang="${item.lang}" href="${item.url}" />`),
      ...(verification ? [`<meta name="google-site-verification" content="${verification}" />`] : []),
    ];
    html = html.replace('</head>', extra.join('\n  ') + '\n</head>');
    const directory = path === '/404.html' ? new URL('../dist/', import.meta.url) : new URL(`../dist${path}`, import.meta.url);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL(path === '/404.html' ? '404.html' : 'index.html', directory), html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(path => `  <url><loc>https://www.haghiweb.ir${path}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(new URL('../dist/sitemap.xml', import.meta.url), sitemap);
  console.log(`Prerender complete: ${routes.length} indexable pages plus a noindex 404 page.`);
} finally { await server?.close(); }
