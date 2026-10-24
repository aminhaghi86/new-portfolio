import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Calculator, Mail, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QUOTE_OPTIONS, estimateQuote, formatQuote } from '../quoteCatalog';

const copy = {
  fa: {
    eyebrow: 'برآورد اولیه پروژه', title: 'استعلام قیمت هوشمند', intro: 'خدمات موردنیاز را انتخاب کنید؛ برآورد اولیه بر اساس جدول خدمات محاسبه می‌شود و با هوش مصنوعی قیمت‌گذاری نمی‌شود.',
    to: 'تا', progress: 'مرحله', of: 'از', ready: 'برآورد آماده است؛ هنوز درخواستی ارسال نشده.', edit: 'ویرایش خدمات', copyError: 'کپی انجام نشد؛ خلاصه را از کادر زیر انتخاب و کپی کنید.', telegram: 'گفت‌وگو در تلگرام', previewSummary: 'متن کامل خلاصه برای بررسی و کپی', detailHint: 'وضعیت و فوریت برای بررسی پیشنهاد ثبت می‌شوند و ضریب قیمت خودکار ندارند.', costHint: 'جمع بازه‌های خدمات انتخابی؛ هزینهٔ دامنه، میزبانی، مجوزها، اشتراک‌ها و مصرف API جداگانه بررسی می‌شود.', timeHint: 'جمع زمان‌های کاتالوگ، با فرض اجرای پشت‌سرهم؛ شروع پس از دریافت محتوا و دسترسی‌هاست. زمان نهایی نیازمند تأیید است.', steps: ['انتخاب خدمات', 'جزئیات پروژه', 'برآورد و ارسال'], next: 'ادامه', back: 'بازگشت',
    choose: 'حداقل یک خدمت انتخاب کنید', details: 'چند نکته درباره پروژه شما', type: 'وضعیت فعلی کسب‌وکار',
    existing: ['هنوز وب‌سایت ندارم', 'سایت دارم و نیاز به ارتقا دارد', 'پروژه جدید / محصول نرم‌افزاری'],
    urgency: 'زمان موردنظر', urgencyItems: ['زمان‌بندی منعطف', 'تا یک ماه آینده', 'فوری (نیازمند بررسی)'],
    notes: 'توضیحات و نیازهای خاص (اختیاری)', notesPlaceholder: 'نوع کسب‌وکار، امکانات ویژه، آدرس سایت فعلی و ...',
    cost: 'برآورد اولیه هزینه', days: 'مدت اجرای تقریبی', dayUnit: 'روز کاری', recurring: 'پشتیبانی ماهانه اختیاری',
    caveat: 'این اعداد صرفاً برآورد اولیه و غیرالزام‌آور هستند. هزینه نهایی پس از بررسی نیازمندی‌ها، زیرساخت، محتوا و قرارداد مشخص می‌شود. خدمات هم‌پوشان ممکن است در پیشنهاد نهایی تجمیع شوند.',
    email: 'ارسال خلاصه با ایمیل', contact: 'تکمیل فرم تماس', copy: 'کپی خلاصه', copied: 'خلاصه کپی شد', selected: 'خدمت انتخاب‌شده',
    preview: 'نمونه‌کار مرتبط: دیباسان', summary: 'خلاصه استعلام',
  },
  en: {
    eyebrow: 'Project cost planner', title: 'Interactive project estimate', intro: 'Choose services for a rule-based estimate from the service catalogue. This is not AI pricing.',
    to: 'to', progress: 'Step', of: 'of', ready: 'Estimate ready. No inquiry has been sent yet.', edit: 'Edit services', copyError: 'Copy failed. Select and copy the summary below.', telegram: 'Chat on Telegram', previewSummary: 'Full summary for review and copying', detailHint: 'Situation and urgency inform the proposal; they do not automatically change this estimate.', costHint: 'Sum of selected service bands. Domain, hosting, licences, subscriptions and API usage are assessed separately.', timeHint: 'Sum of catalogue durations assuming sequential work, starting after content and access are provided. Final dates require confirmation.', steps: ['Select services', 'Project details', 'Estimate & inquiry'], next: 'Continue', back: 'Back',
    choose: 'Choose at least one service', details: 'Tell me about your project', type: 'Current situation',
    existing: ['No website yet', 'Existing website needs improvements', 'New software product'],
    urgency: 'Preferred timeline', urgencyItems: ['Flexible', 'Within one month', 'Urgent (subject to review)'],
    notes: 'Additional requirements (optional)', notesPlaceholder: 'Industry, special features, existing URL…',
    cost: 'Indicative setup estimate', days: 'Estimated delivery', dayUnit: 'business days', recurring: 'Optional monthly support',
    caveat: 'Illustrative, non-binding estimates only. Final pricing and delivery depend on confirmed scope, integrations, content, and a written proposal. Overlapping work may be consolidated.',
    email: 'Email the summary', contact: 'Continue to contact form', copy: 'Copy summary', copied: 'Copied', selected: 'Selected service',
    preview: 'Related case study: Dibasan', summary: 'Project inquiry summary',
  },
};

export default function QuoteWizard() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fa' ? 'fa' : 'en';
  const t = copy[language];
  const [step, setStep] = useState(0);
  const panelRef = useRef(null);
  const changeStep = next => { setStep(next); setCopied(false); setCopyError(false); requestAnimationFrame(() => panelRef.current?.focus()); };
  const [chosen, setChosen] = useState(['website']);
  const [situation, setSituation] = useState(0);
  const [urgency, setUrgency] = useState(0);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const estimate = useMemo(() => estimateQuote(chosen), [chosen]);
  const money = value => formatQuote(value, language);
  const selected = QUOTE_OPTIONS.filter(item => chosen.includes(item.id));
  const summary = [t.summary, ...selected.map(item => `• ${item[language].title}`), `${t.cost}: ${money(estimate.min)} – ${money(estimate.max)}`, `${t.days}: ${estimate.minDays}–${estimate.maxDays} ${t.dayUnit}`, `${t.type}: ${t.existing[situation]}`, `${t.urgency}: ${t.urgencyItems[urgency]}`, `${t.notes}: ${notes.trim() || '—'}`, t.costHint, t.timeHint, t.caveat].join('\n');
  const toggle = id => { setCopied(false); setChosen(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); };
  const sendToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    window.dispatchEvent(new CustomEvent('portfolio:quote', { detail: summary }));
    document.getElementById('contact-message')?.focus({ preventScroll: true });
  };
  const copySummary = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); } catch { setCopyError(true); } };
  return (
    <section id="inquiry" className="quote-section scroll-mt-24" aria-labelledby="quote-heading">
      <div className="quote-intro"><span className="quote-eyebrow"><Calculator size={17} /> {t.eyebrow}</span><h2 id="quote-heading">{t.title}</h2><p>{t.intro}</p></div>
      <div className="quote-shell">
        <div className="quote-progress-label" aria-live="polite"><strong>{t.progress} {step + 1} {t.of} {t.steps.length}: {t.steps[step]}</strong><span>{Math.round((step + 1) / t.steps.length * 100)}%</span></div>
        <progress className="quote-progress" max={t.steps.length} value={step + 1} aria-label={`${t.progress} ${step + 1} ${t.of} ${t.steps.length}`} />
        <ol className="quote-steps" aria-label={t.title}>{t.steps.map((label, index) => <li key={label} className={index === step ? 'active' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}><span>{index < step ? <Check size={15} /> : index + 1}</span><button type="button" disabled={index > step} onClick={() => changeStep(index)}>{label}</button></li>)}</ol>
        <div ref={panelRef} className="quote-panel" tabIndex={-1} role="group" aria-label={`${t.progress} ${step + 1}: ${t.steps[step]}`}>
        {step === 0 && <div className="quote-option-grid">{QUOTE_OPTIONS.map(item => <label key={item.id} className={`quote-option ${chosen.includes(item.id) ? 'selected' : ''}`}><input type="checkbox" checked={chosen.includes(item.id)} onChange={() => toggle(item.id)} /><span className="quote-option-check"><Check size={16}/></span><strong>{item[language].title}</strong><small>{item[language].description}</small><span className="quote-option-price">{money(item.min)} – {money(item.max)}</span></label>)}</div>}
        {step === 1 && <div className="quote-details"><h3>{t.details}</h3><p className="quote-disclaimer">{t.detailHint}</p><label>{t.type}<select value={situation} onChange={event => setSituation(Number(event.target.value))}>{t.existing.map((option, index) => <option key={option} value={index}>{option}</option>)}</select></label><label>{t.urgency}<select value={urgency} onChange={event => setUrgency(Number(event.target.value))}>{t.urgencyItems.map((option, index) => <option key={option} value={index}>{option}</option>)}</select></label><label>{t.notes}<textarea value={notes} onChange={event => setNotes(event.target.value)} maxLength={500} dir="auto" rows={4} placeholder={t.notesPlaceholder}/></label></div>}
        {step === 2 && <div className="quote-results"><p className="quote-ready">{t.ready}</p><div className="quote-total"><p>{t.cost}</p><strong className="quote-range"><bdi>{money(estimate.min)}</bdi><span>{t.to}</span><bdi>{money(estimate.max)}</bdi></strong><p>{t.days}: <b>{estimate.minDays.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')} {t.to} {estimate.maxDays.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')} {t.dayUnit}</b></p></div><ul>{selected.map(item => <li key={item.id}><Check size={17}/>{item[language].title}</li>)}</ul><p className="quote-disclaimer">{t.costHint}</p><p className="quote-disclaimer">{t.timeHint}</p><p className="quote-disclaimer">{t.caveat}</p><details className="quote-summary"><summary>{t.previewSummary}</summary><textarea aria-label={t.summary} readOnly value={summary} rows={9} dir="auto" /></details><div className="quote-actions"><button type="button" onClick={sendToContact} className="quote-primary">{t.contact} <ArrowLeft size={17}/></button><a className="quote-secondary" href="https://t.me/a_hgh86" target="_blank" rel="noopener noreferrer"><Send size={17} aria-hidden="true"/>{t.telegram}</a><a className="quote-secondary" href={`mailto:aminhaghi@gmail.com?subject=${encodeURIComponent(t.title)}&body=${encodeURIComponent(summary)}`}><Mail size={17}/>{t.email}</a><button type="button" className="quote-secondary" onClick={copySummary}>{copied ? t.copied : t.copy}</button></div><p role="status">{copied ? t.copied : copyError ? t.copyError : ''}</p></div>}
        </div>
        <div className="quote-footer"><button type="button" className="quote-secondary" disabled={step === 0} onClick={() => changeStep(step - 1)}><ArrowRight size={17}/>{t.back}</button>{step < 2 && <button type="button" className="quote-primary" disabled={chosen.length === 0} onClick={() => changeStep(step + 1)}>{t.next}<ArrowLeft size={17}/></button>}{chosen.length === 0 && <p role="status">{t.choose}</p>}</div>
      </div>
    </section>
  );
}
