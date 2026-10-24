import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import Site from './Site';
import i18n from './i18n';
import { getMetadata } from './seo/metadata';
import { contentPages } from './seo/pages';

export const routes = ['/', '/en/', ...contentPages.map(page => page.path)];
export async function render(path = '/') {
  const language = path === '/en/' ? 'en' : 'fa';
  await i18n.changeLanguage(language);
  return {
    markup: renderToString(<StrictMode><Site path={path} /></StrictMode>),
    metadata: getMetadata(path, language),
  };
}
