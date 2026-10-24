// Indicative price bands in million Iranian tomans; editorial estimates, not verified market quotations.
export const QUOTE_OPTIONS = [
  { id: 'website', min: 25, max: 45, minDays: 12, maxDays: 25, fa: { title: 'سایت شرکتی حرفه‌ای', description: 'معرفی برند، صفحات خدمات، فرم تماس و مدیریت محتوا' }, en: { title: 'Business website', description: 'Brand presentation, service pages, inquiry form and CMS' } },
  { id: 'store', min: 45, max: 85, minDays: 20, maxDays: 40, fa: { title: 'فروشگاه ووکامرس', description: 'کاتالوگ، دسته‌بندی، محصول، سبد خرید و سفارش' }, en: { title: 'WooCommerce store', description: 'Catalogue, products, checkout and order flow' } },
  { id: 'custom', min: 65, max: 150, minDays: 25, maxDays: 60, fa: { title: 'وب‌اپلیکیشن اختصاصی', description: 'React / Next.js، داشبورد و API بر اساس نیاز' }, en: { title: 'Custom web application', description: 'React / Next.js dashboard and API development' } },
  { id: 'inquiry', min: 12, max: 28, minDays: 5, maxDays: 12, fa: { title: 'فرم استعلام و مدیریت سرنخ', description: 'فرم چندمرحله‌ای، اعلان و پیگیری درخواست‌ها' }, en: { title: 'Inquiry and lead capture', description: 'Multi-step form, notifications and lead tracking' } },
  { id: 'automation', min: 25, max: 65, minDays: 10, maxDays: 25, fa: { title: 'اتوماسیون n8n و CRM سبک', description: 'اتصال فرم‌ها، پیام‌رسان‌ها و گردش‌کار فروش' }, en: { title: 'n8n automation and light CRM', description: 'Connect forms, messaging and sales workflows' } },
  { id: 'ai', min: 45, max: 120, minDays: 15, maxDays: 40, fa: { title: 'اتوماسیون و دستیار هوش مصنوعی', description: 'تولید محتوای تأییدمحور، پردازش داده و اتصال API' }, en: { title: 'AI assistant and automation', description: 'Human-approved content, data processing and API integrations' } },
  { id: 'seo', min: 10, max: 30, minDays: 5, maxDays: 15, fa: { title: 'سئو فنی و بهینه‌سازی سرعت', description: 'متادیتا، ساختار صفحات، Core Web Vitals و تحلیل' }, en: { title: 'Technical SEO and performance', description: 'Metadata, page structure, web vitals and audit' } },
  { id: 'infra', min: 12, max: 40, minDays: 4, maxDays: 15, fa: { title: 'استقرار و زیرساخت سرور', description: 'Linux، Docker، Nginx، CI/CD و پایش اولیه' }, en: { title: 'Server and deployment', description: 'Linux, Docker, Nginx, CI/CD and basic monitoring' } },
];
export function estimateQuote(ids) {
  const selected = QUOTE_OPTIONS.filter(option => ids.includes(option.id));
  return selected.reduce((total, item) => ({
    min: total.min + item.min, max: total.max + item.max,
    minDays: total.minDays + item.minDays, maxDays: total.maxDays + item.maxDays,
  }), { min: 0, max: 0, minDays: 0, maxDays: 0 });
}
export function formatQuote(millions, language = 'fa') {
  return language === 'fa' ? `${millions.toLocaleString('fa-IR')} میلیون تومان` : `${millions.toLocaleString('en-US')}M toman`;
}
