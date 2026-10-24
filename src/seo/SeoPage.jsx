import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProjectGallery from '../components/ProjectGallery';
import data from '../data.json';
import { servicePages, casePages } from './pages';
import './seo.css';

export default function SeoPage({ page }) {
  const { t } = useTranslation();
  const project = page?.projectId === undefined ? null : data.myProjects.find(item => item.id === page.projectId);
  return <div className="seo-page">
    <a href="#page-content" className="skip-link">رفتن به محتوای اصلی</a>
    <header className="seo-header"><a href="/" className="seo-brand">امین حقی <span lang="en">HaghiWeb</span></a><nav aria-label="منوی اصلی"><a href="/#services">خدمات</a><a href="/#projects">نمونه‌کارها</a><a href="/#contact" className="seo-cta">گفت‌وگو دربارهٔ پروژه <ArrowUpRight size={17} aria-hidden="true" /></a></nav></header>
    <main id="page-content" className="seo-main" tabIndex={-1}>
      <nav aria-label="مسیر صفحه" className="seo-breadcrumb"><a href="/">خانه</a><span aria-hidden="true"> / </span><span>{page ? page.heading : 'صفحه پیدا نشد'}</span></nav>
      <div className="seo-intro"><p className="section-eyebrow">امین حقی · طراحی سایت و اتوماسیون</p><h1>{page?.heading || 'این صفحه پیدا نشد'}</h1><p>{page?.intro || 'از صفحهٔ اصلی، خدمات و نمونه‌کارهای موجود را بررسی کنید.'}</p></div>
      {project?.gallery && <div className="seo-gallery"><ProjectGallery images={project.gallery} title={page.heading} />{project.mediaNoteKey && <p className="seo-media-note">{t(project.mediaNoteKey)} <a href={project.credits}>{t('projectImageCredits')}</a></p>}</div>}
      <div className="seo-content">{page?.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs?.map(text => <p key={text}>{text}</p>)}{section.items && <ul>{section.items.map(text => <li key={text}>{text}</li>)}</ul>}</section>)}</div>
      {page?.externalUrl && <a className="portfolio-button secondary" href={page.externalUrl} target="_blank" rel="noopener noreferrer">{page.externalLabel}<ArrowUpRight size={17} aria-hidden="true" /></a>}
      {page?.proof && <aside className="seo-proof"><h2>نمونهٔ اجرای مرتبط</h2><a href={page.proof}>{page.proofLabel}<ArrowLeft size={17} aria-hidden="true" /></a></aside>}
      <section className="seo-contact"><h2>دربارهٔ نیاز پروژه‌تان صحبت کنیم</h2><p>آدرس سایت فعلی، امکانات موردنیاز و زمان‌بندی مدنظرتان را بفرستید تا محدودهٔ کار و قدم بعدی را مشخص کنیم.</p><div><a href="/#contact" className="portfolio-button primary">تکمیل فرم درخواست</a><a href="/#inquiry" className="portfolio-button secondary">برآورد اولیهٔ هزینه</a><a href="https://t.me/a_hgh86" target="_blank" rel="noopener noreferrer">گفت‌وگو در تلگرام</a></div></section>
      <nav className="seo-related" aria-label="خدمات و نمونه‌کارهای مرتبط"><h2>خدمات و تجربه‌های مرتبط</h2>{[...servicePages, ...casePages].filter(item => item.path !== page?.path).map(item => <a href={item.path} key={item.path}>{item.heading}</a>)}</nav>
    </main>
    <footer className="seo-footer"><p>امین حقی · طراح سایت و توسعه‌دهندهٔ اتوماسیون · مشهد، ایران</p><a href="/">بازگشت به صفحهٔ اصلی</a><a href="mailto:aminhaghi@gmail.com">aminhaghi@gmail.com</a></footer>
  </div>;
}
