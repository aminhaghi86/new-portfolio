import App from './App';
import SeoPage from './seo/SeoPage';
import { findPage, normalizePath } from './seo/pages';

export default function Site({ path = '/' }) {
  const normalized = normalizePath(path);
  return normalized === '/' || normalized === '/en/' ? <App /> : <SeoPage page={findPage(path)} />;
}
