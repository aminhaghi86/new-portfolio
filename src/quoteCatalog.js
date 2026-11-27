// HaghiWeb estimates in million Iranian tomans, benchmarked against published 1405 pricing.
// https://uiverse.ir/landing/website-cost
// https://webiro.ir/price-listing/
// https://webrizan.com/pricing
export const PRIMARY_QUOTE_OPTIONS = new Set(['website', 'store', 'custom']);

export const QUOTE_OPTIONS = [
  { id: 'website', min: 22, max: 45, minDays: 12, maxDays: 25, fa: { title: 'سایت شرکتی وردپرسی', description: 'تا پنج صفحهٔ معرفی، مدیریت محتوا و فرم تماس ساده' }, en: { title: 'WordPress business website', description: 'Up to five pages, content management and a basic contact form' } },
  { id: 'store', min: 35, max: 75, minDays: 18, maxDays: 35, fa: { title: 'فروشگاه ووکامرس', description: 'کاتالوگ، سبد خرید، تسویه‌حساب و ورود اولیه تا ۱۰ محصول' }, en: { title: 'WooCommerce store', description: 'Catalogue, cart, checkout and setup for up to 10 products' } },
  { id: 'custom', min: 90, max: 180, minDays: 30, maxDays: 60, fa: { title: 'نسخهٔ اولیهٔ وب‌اپلیکیشن اختصاصی', description: 'یک فرایند اصلی با پنل و API اختصاصی' }, en: { title: 'Custom web application MVP', description: 'One core workflow with a custom dashboard and API' } },
  { id: 'inquiry', min: 10, max: 25, minDays: 5, maxDays: 12, fa: { title: 'فرم استعلام چندمرحله‌ای', description: 'فرم اختصاصی با اعتبارسنجی و ارسال اعلان به یک مقصد' }, en: { title: 'Multi-step inquiry form', description: 'Custom form with validation and notifications to one destination' } },
  { id: 'automation', min: 12, max: 40, minDays: 5, maxDays: 18, fa: { title: 'اتوماسیون با n8n', description: 'یک گردش‌کار مستقل با اتصال حداکثر دو سرویس' }, en: { title: 'n8n automation', description: 'One standalone workflow connecting up to two services' } },
  { id: 'ai', min: 25, max: 80, minDays: 10, maxDays: 30, fa: { title: 'دستیار هوش مصنوعی', description: 'یک کاربرد مشخص، اتصال به مدل و بازبینی انسانی' }, en: { title: 'AI assistant', description: 'One use case, model integration and human review' } },
  { id: 'seo', min: 10, max: 25, minDays: 5, maxDays: 15, fa: { title: 'ممیزی فنی سئو و سرعت', description: 'بررسی تخصصی و اصلاح موارد توافق‌شده، به‌صورت یک‌باره' }, en: { title: 'Technical SEO and performance audit', description: 'One-time technical review and agreed fixes' } },
  { id: 'infra', min: 8, max: 25, minDays: 3, maxDays: 10, fa: { title: 'راه‌اندازی سرور اختصاص‌یافته به پروژه', description: 'پیکربندی سرور، استقرار، نسخهٔ پشتیبان و پایش اولیه' }, en: { title: 'Project server setup', description: 'Server configuration, deployment, backup and baseline monitoring' } },
];
export function estimateQuote(ids, { existingSite = false } = {}) {
  const selected = QUOTE_OPTIONS.filter(option => ids.includes(option.id));
  if (!selected.length || (existingSite && selected.some(item => PRIMARY_QUOTE_OPTIONS.has(item.id)))) {
    return null;
  }
  return selected.reduce((total, item) => ({
    min: total.min + item.min, max: total.max + item.max,
    minDays: total.minDays + item.minDays, maxDays: total.maxDays + item.maxDays,
  }), { min: 0, max: 0, minDays: 0, maxDays: 0 });
}
export function formatQuote(millions, language = 'fa') {
  return language === 'fa' ? `${millions.toLocaleString('fa-IR')} میلیون تومان` : `${millions.toLocaleString('en-US')}M toman`;
}
