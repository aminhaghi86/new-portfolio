import { useState } from 'react';
import { CheckCircle2, ClipboardList, FilePenLine, SearchCheck, Send, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const text = {
  fa: {
    kicker: 'مطالعه موردی واقعی + شبیه‌سازی', title: 'دیباسان؛ از معرفی محصول تا گردش‌کار محتوا',
    intro: 'نمونه‌ای از اجرای سایت وردپرس/ووکامرس برای تولیدکننده بسته‌بندی و توسعه گردش‌کار کنترل‌شده تولید مقاله.',
    website: 'سایت عمومی دیباسان', editorial: 'کنسول محتوای تلگرام / n8n', live: 'مشاهده سایت',
    websiteText: 'نمایش دسته‌بندی محصولات، کاتالوگ و مسیر تماس و استعلام برای مشتریان صنعتی.',
    editorialText: 'فرمان‌های تلگرام، ثبت brief تأییدشده، تهیه پیش‌نویس، تکمیل سئو و بازبینی انسانی. نسخه جدید در مرحله آزمایشی است و انتشار خودکار غیرفعال است.',
    demo: 'دموی تعاملی فرایند محتوا', disclaimer: 'این بخش شبیه‌سازی داخل مرورگر است؛ هیچ درخواستی به تلگرام، n8n یا وردپرس ارسال نمی‌کند.',
    steps: ['دریافت درخواست', 'بررسی اطلاعات منبع', 'ساخت پیش‌نویس', 'بازبینی سئو', 'تأیید انسانی'],
    next: 'اجرای مرحله بعد', reset: 'شروع دوباره', finished: 'شبیه‌سازی کامل شد؛ انتشار واقعی انجام نشده است.',
    labels: ['مدیر موضوع مقاله را ثبت می‌کند.', 'منبع شرکت و اطلاعات تأییدشده کنترل می‌شود.', 'پیش‌نویس قابل بازبینی آماده می‌شود.', 'عنوان، توضیح متا و تصویر بررسی می‌شوند.', 'تأیید مدیر برای انتشار لازم است؛ این دمو منتشر نمی‌کند.'],
  },
  en: {
    kicker: 'Real case study + simulated workflow', title: 'Dibasan: product catalogue to editorial workflow',
    intro: 'A packaging manufacturer’s WordPress/WooCommerce site and an approval-controlled editorial workflow.',
    website: 'Public Dibasan website', editorial: 'Telegram / n8n editorial console', live: 'Visit website',
    websiteText: 'Product categories, catalogue and customer contact/inquiry paths for an industrial manufacturer.',
    editorialText: 'Telegram commands, verified briefs, draft creation, SEO checks and human review. The newer workflow remains experimental; automatic publishing is disabled.',
    demo: 'Interactive editorial workflow demo', disclaimer: 'Browser-only simulation: no messages or data are sent to Telegram, n8n or WordPress.',
    steps: ['Receive request', 'Verify sources', 'Prepare draft', 'Review SEO', 'Human approval'],
    next: 'Run next stage', reset: 'Restart', finished: 'Simulation complete. Nothing has been published.',
    labels: ['Manager submits a topic.', 'Approved company sources are checked.', 'A reviewable draft is prepared.', 'Metadata and image are reviewed.', 'Human approval is required; this demo never publishes.'],
  },
};
const icons = [ClipboardList, ShieldCheck, FilePenLine, SearchCheck, Send];
export default function DibasanShowcase() {
  const { i18n } = useTranslation();
  const t = text[i18n.resolvedLanguage === 'fa' ? 'fa' : 'en'];
  const [current, setCurrent] = useState(0);
  return <section id="dibasan-case" className="dibasan-section scroll-mt-24" aria-labelledby="dibasan-title">
    <div className="quote-intro"><span className="quote-eyebrow">{t.kicker}</span><h2 id="dibasan-title">{t.title}</h2><p>{t.intro}</p></div>
    <div className="dibasan-cards"><article><span className="dibasan-tag">WordPress · WooCommerce · Elementor</span><h3>{t.website}</h3><p>{t.websiteText}</p><a href="https://dibasan.com/" target="_blank" rel="noopener noreferrer">{t.live} ↗</a></article><article><span className="dibasan-tag">Telegram · n8n · PostgreSQL</span><h3>{t.editorial}</h3><p>{t.editorialText}</p><a href="#dibasan-demo">{t.demo} ↓</a></article></div>
    <div id="dibasan-demo" className="dibasan-demo"><div><h3>{t.demo}</h3><p className="quote-disclaimer">{t.disclaimer}</p></div><ol className="dibasan-timeline">{t.steps.map((step, index) => { const Icon = icons[index]; return <li key={step} className={index < current ? 'done' : index === current ? 'active' : ''}><span><Icon size={18}/></span><div><strong>{step}</strong><p>{t.labels[index]}</p></div>{index < current && <CheckCircle2 size={18} className="dibasan-done-icon"/>}</li>; })}</ol><div className="quote-footer"><button type="button" className="quote-primary" onClick={() => setCurrent(value => value === t.steps.length ? 0 : value + 1)}>{current === t.steps.length ? t.reset : t.next}</button>{current === t.steps.length && <p role="status">{t.finished}</p>}</div></div>
  </section>;
}
