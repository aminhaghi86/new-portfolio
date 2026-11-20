import { useTranslation } from 'react-i18next';

const text = {
  fa: {
    kicker: 'مطالعه موردی واقعی', title: 'دیباسان؛ از معرفی محصول تا گردش‌کار محتوا',
    intro: 'نمونه‌ای از اجرای سایت وردپرس/ووکامرس برای تولیدکننده بسته‌بندی و توسعه گردش‌کار کنترل‌شده تولید مقاله.',
    website: 'سایت عمومی دیباسان', editorial: 'کنسول محتوای تلگرام / n8n', live: 'مشاهده سایت',
    websiteText: 'نمایش دسته‌بندی محصولات، کاتالوگ و مسیر تماس و استعلام برای مشتریان صنعتی.',
    editorialText: 'فرمان‌های تلگرام، ثبت brief تأییدشده، تهیه پیش‌نویس، تکمیل سئو و بازبینی انسانی. نسخه جدید در مرحله آزمایشی است و انتشار خودکار غیرفعال است.',
  },
  en: {
    kicker: 'Real case study', title: 'Dibasan: product catalogue to editorial workflow',
    intro: 'A packaging manufacturer’s WordPress/WooCommerce site and an approval-controlled editorial workflow.',
    website: 'Public Dibasan website', editorial: 'Telegram / n8n editorial console', live: 'Visit website',
    websiteText: 'Product categories, catalogue and customer contact/inquiry paths for an industrial manufacturer.',
    editorialText: 'Telegram commands, verified briefs, draft creation, SEO checks and human review. The newer workflow remains experimental; automatic publishing is disabled.',
  },
};
export default function DibasanShowcase() {
  const { i18n } = useTranslation();
  const t = text[i18n.resolvedLanguage === 'fa' ? 'fa' : 'en'];
  return <section id="dibasan-case" className="dibasan-section scroll-mt-24" aria-labelledby="dibasan-title">
    <div className="quote-intro"><span className="quote-eyebrow">{t.kicker}</span><h2 id="dibasan-title">{t.title}</h2><p>{t.intro}</p></div>
    <div className="dibasan-cards"><article><span className="dibasan-tag">WordPress · WooCommerce · Elementor</span><h3>{t.website}</h3><p>{t.websiteText}</p><a href="https://dibasan.com/" target="_blank" rel="noopener noreferrer">{t.live} ↗</a></article><article><span className="dibasan-tag">Telegram · n8n · PostgreSQL</span><h3>{t.editorial}</h3><p>{t.editorialText}</p></article></div>
  </section>;
}
