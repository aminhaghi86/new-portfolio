import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Calculator, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QUOTE_OPTIONS, estimateQuote, formatQuote } from '../quoteCatalog';

const copy = {
  fa: {
    eyebrow: 'برآورد اولیه پروژه', title: 'استعلام قیمت هوشمند', intro: 'خدمات موردنیاز را انتخاب کنید؛ هزینه و زمان تقریبی به‌صورت لحظه‌ای محاسبه می‌شود.',
    steps: ['انتخاب خدمات', 'جزئیات پروژه', 'برآورد و ارسال'], next: 'ادامه', back: 'بازگشت',
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
    eyebrow: 'Project cost planner', title: 'Interactive project estimate', intro: 'Choose multiple services to see an indicative budget and delivery timeline.',
    steps: ['Select services', 'Project details', 'Estimate & inquiry'], next: 'Continue', back: 'Back',
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
  const [chosen, setChosen] = useState(['website']);
  const [situation, setSituation] = useState(0);
  const [urgency, setUrgency] = useState(0);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const estimate = useMemo(() => estimateQuote(chosen), [chosen]);
  const money = value => formatQuote(value, language);
  const selected = QUOTE_OPTIONS.filter(item => chosen.includes(item.id));
  const summary = [t.summary, ...selected.map(item => `• ${item[language].title}`), `${t.cost}: ${money(estimate.min)} – ${money(estimate.max)}`, `${t.days}: ${estimate.minDays}–${estimate.maxDays} ${t.dayUnit}`, `${t.type}: ${t.existing[situation]}`, `${t.urgency}: ${t.urgencyItems[urgency]}`, `${t.notes}: ${notes.trim() || '—'}`, t.caveat].join('\n');
  const toggle = id => setChosen(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const sendToContact = () => {
    try { sessionStorage.setItem('portfolio-quote-draft', summary); } catch { /* private browsing */ }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('portfolio:quote', { detail: summary }));
  };
  const copySummary = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); } catch { window.location.href = `mailto:aminhaghi@gmail.com?subject=${encodeURIComponent(t.title)}&body=${encodeURIComponent(summary)}`; } };
  return (
    <section id="inquiry" className="quote-section scroll-mt-24" aria-labelledby="quote-heading">
      <div className="quote-intro"><span className="quote-eyebrow"><Calculator size={17} /> {t.eyebrow}</span><h2 id="quote-heading">{t.title}</h2><p>{t.intro}</p></div>
      <div className="quote-shell">
        <ol className="quote-steps" aria-label={t.title}>{t.steps.map((label, index) => <li key={label} className={index === step ? 'active' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}><span>{index < step ? <Check size={15} /> : index + 1}</span>{label}</li>)}</ol>
        {step === 0 && <div className="quote-option-grid">{QUOTE_OPTIONS.map(item => <label key={item.id} className={`quote-option ${chosen.includes(item.id) ? 'selected' : ''}`}><input type="checkbox" checked={chosen.includes(item.id)} onChange={() => toggle(item.id)} /><span className="quote-option-check"><Check size={16}/></span><strong>{item[language].title}</strong><small>{item[language].description}</small><span className="quote-option-price">{money(item.min)} – {money(item.max)}</span></label>)}</div>}
        {step === 1 && <div className="quote-details"><h3>{t.details}</h3><label>{t.type}<select value={situation} onChange={event => setSituation(Number(event.target.value))}>{t.existing.map((option, index) => <option key={option} value={index}>{option}</option>)}</select></label><label>{t.urgency}<select value={urgency} onChange={event => setUrgency(Number(event.target.value))}>{t.urgencyItems.map((option, index) => <option key={option} value={index}>{option}</option>)}</select></label><label>{t.notes}<textarea value={notes} onChange={event => setNotes(event.target.value)} maxLength={1200} rows={4} placeholder={t.notesPlaceholder}/></label></div>}
        {step === 2 && <div className="quote-results"><div className="quote-total"><p>{t.cost}</p><strong dir="ltr">{money(estimate.min)} – {money(estimate.max)}</strong><p>{t.days}: <b>{estimate.minDays}–{estimate.maxDays} {t.dayUnit}</b></p></div><ul>{selected.map(item => <li key={item.id}><Check size={17}/>{item[language].title}</li>)}</ul><p className="quote-disclaimer">{t.caveat}</p><div className="quote-actions"><button type="button" onClick={sendToContact} className="quote-primary">{t.contact} <ArrowLeft size={17}/></button><a className="quote-secondary" href={`mailto:aminhaghi@gmail.com?subject=${encodeURIComponent(t.title)}&body=${encodeURIComponent(summary)}`}><Mail size={17}/>{t.email}</a><button type="button" className="quote-secondary" onClick={copySummary}>{copied ? t.copied : t.copy}</button></div></div>}
        {step < 2 && <div className="quote-footer"><button type="button" className="quote-secondary" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowRight size={17}/>{t.back}</button><button type="button" className="quote-primary" disabled={chosen.length === 0} onClick={() => setStep(step + 1)}>{t.next}<ArrowLeft size={17}/></button>{chosen.length === 0 && <p role="status">{t.choose}</p>}</div>}
      </div>
    </section>
  );
}
