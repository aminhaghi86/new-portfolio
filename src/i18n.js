import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fa from './locales/fa.json';

const supported = ['en', 'fa'];
function initialLanguage() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (supported.includes(query)) return query;
  try {
    const saved = localStorage.getItem('portfolio-language');
    if (supported.includes(saved)) return saved;
  } catch { /* Browser storage may be disabled. */ }
  return 'en';
}

function updateDocument(language) {
  const lang = language === 'fa' ? 'fa' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = i18n.dir(lang);
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", lang === "fa" ? "fa_IR" : "en_US");
  document.title = i18n.t('metaTitle', { lng: lang });
  const metadata = [
    ['meta[name="description"]', 'metaDescription'],
    ['meta[property="og:title"]', 'metaTitle'],
    ['meta[property="og:description"]', 'metaDescription'],
  ];
  for (const [selector, key] of metadata) {
    document.querySelector(selector)?.setAttribute('content', i18n.t(key, { lng: lang }));
  }
  try { localStorage.setItem('portfolio-language', lang); }
  catch { /* Language switching still works without persistence. */ }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState(window.history.state, '', url);
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fa: { translation: fa } },
  lng: initialLanguage(),
  fallbackLng: 'en',
  supportedLngs: supported,
  interpolation: { escapeValue: false }, // React escapes text nodes.
  react: { useSuspense: false },
});
updateDocument(i18n.language);
i18n.on('languageChanged', updateDocument);

export default i18n;
