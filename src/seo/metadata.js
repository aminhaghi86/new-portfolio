import fa from '../locales/fa.json';
import en from '../locales/en.json';
import { findPage, normalizePath } from './pages';

export const SITE_ORIGIN = 'https://www.haghiweb.ir';
export const languagePath = lang => lang === 'en' ? '/en/' : '/';

export function getMetadata(path = '/', language = 'fa') {
  const normalized = normalizePath(path);
  const page = findPage(path);
  const home = normalized === '/' || normalized === '/en/';
  const known = home || !!page;
  const lang = home && language === 'en' ? 'en' : 'fa';
  const copy = lang === 'en' ? en : fa;
  const canonical = SITE_ORIGIN + (home ? languagePath(lang) : known ? normalized : '/404.html');
  const title = page?.title || (known ? copy.metaTitle : 'صفحه پیدا نشد | امین حقی');
  const description = page?.description || (known ? copy.metaDescription : 'این نشانی در سایت امین حقی وجود ندارد.');
  const personId = SITE_ORIGIN + '/#person';
  const graph = [
    { '@type': 'Person', '@id': personId, name: 'امین حقی', alternateName: 'Amin Haghi', url: SITE_ORIGIN + '/', image: SITE_ORIGIN + '/mypic.jpeg', jobTitle: 'طراح سایت و توسعه‌دهندهٔ اتوماسیون', sameAs: ['https://github.com/aminhaghi86', 'https://www.linkedin.com/in/aminhaghi', 'https://t.me/a_hgh86'] },
    { '@type': 'WebSite', '@id': SITE_ORIGIN + '/#website', url: SITE_ORIGIN + '/', name: 'امین حقی', alternateName: ['Amin Haghi', 'HaghiWeb'], publisher: { '@id': personId }, inLanguage: ['fa', 'en'] },
    { '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical, name: title, description, inLanguage: lang, isPartOf: { '@id': SITE_ORIGIN + '/#website' }, about: { '@id': personId } },
  ];
  if (page) graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'امین حقی', item: SITE_ORIGIN + '/' },
    { '@type': 'ListItem', position: 2, name: page.heading, item: canonical },
  ] });
  if (page?.serviceId) graph.push({ '@type': 'Service', '@id': canonical + '#service', name: page.heading, description, url: canonical, provider: { '@id': personId } });
  return { title, description, canonical, lang, known, home, graph, alternates: home ? [{ lang: 'fa', url: SITE_ORIGIN + '/' }, { lang: 'en', url: SITE_ORIGIN + '/en/' }, { lang: 'x-default', url: SITE_ORIGIN + '/' }] : [] };
}

export function updateMetadata(path, language) {
  const meta = getMetadata(path, language);
  document.documentElement.lang = meta.lang;
  document.documentElement.dir = meta.lang === 'fa' ? 'rtl' : 'ltr';
  document.title = meta.title;
  for (const [selector, value] of [
    ['meta[name="description"]', meta.description], ['meta[property="og:title"]', meta.title],
    ['meta[property="og:description"]', meta.description], ['meta[property="og:url"]', meta.canonical],
    ['meta[property="og:locale"]', meta.lang === 'fa' ? 'fa_IR' : 'en_US'],
    ['meta[name="twitter:title"]', meta.title], ['meta[name="twitter:description"]', meta.description],
    ['meta[name="robots"]', meta.known ? 'index, follow' : 'noindex, follow'],
  ]) document.querySelector(selector)?.setAttribute('content', value);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.canonical);
  const structured = document.querySelector('#site-structured-data');
  if (structured) structured.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': meta.graph });
}
