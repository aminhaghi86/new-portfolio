import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Calculator, Mail, Send, Copy, Camera, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { QUOTE_OPTIONS, estimateQuote, formatQuote } from '../quoteCatalog';

// Drop-in replacement: src/components/QuoteWizard.jsx
const PRIMARY = new Set(['website', 'store', 'custom']);
const translations = {
  fa: { title:'استعلام قیمت هوشمند', subtitle:'خدمات را انتخاب کنید تا برآورد اولیه هزینه و زمان پروژه را ببینید.', steps:['انتخاب خدمات','جزئیات پروژه','برآورد و ارسال'], step:'مرحله', of:'از', next:'ادامه', back:'بازگشت', platform:'برای یک وب‌سایت، تنها یک بستر اصلی قابل انتخاب است. انتخاب وردپرس، ووکامرس یا وب‌اپلیکیشن اختصاصی، گزینه قبلی را جایگزین می‌کند.', select:'حداقل یک خدمت انتخاب کنید.', status:'وضعیت پروژه', statuses:['شروع پروژه جدید','ارتقای سایت موجود','افزودن امکانات'], urgency:'زمان‌بندی', urgencies:['منعطف','تا یک ماه','فوری؛ نیازمند هماهنگی'], notes:'توضیحات تکمیلی', placeholder:'نوع کسب‌وکار، آدرس سایت و امکانات مورد نیاز...', price:'برآورد اولیه هزینه', days:'زمان تخمینی', day:'روز کاری', to:'تا', caveat:'این قیمت‌ها بر اساس کاتالوگ داخلی خدمات و صرفاً برآورد اولیه هستند؛ نرخ قطعی یا قیمت تأییدشده بازار نیستند. هزینه دامنه، هاست، سرویس‌های ثالث و مصرف API جداست. قیمت و زمان نهایی پس از بررسی نیازمندی‌ها تعیین می‌شود.', summary:'متن کامل استعلام', contact:'انتقال به فرم تماس', telegram:'اشتراک‌گذاری در تلگرام', direct:'گفت‌وگوی مستقیم تلگرام', email:'ارسال با ایمیل', whatsapp:'ارسال با واتساپ', copy:'کپی متن کامل', copied:'متن کامل کپی شد.', copyError:'کپی خودکار ممکن نشد؛ متن زیر را انتخاب و کپی کنید.', telegramNote:'لینک اشتراک‌گذاری تلگرام متن را آماده می‌کند، اما گفت‌وگوی مقصد را خودکار انتخاب نمی‌کند. پس از باز شدن تلگرام، گفت‌وگو را انتخاب کنید؛ برای گفت‌وگوی مستقیم می‌توانید متن را کپی و جای‌گذاری کنید.', notSent:'این درخواست هنوز ارسال نشده است.', instagram:'اینستاگرام @haghiweb' },
  en: { title:'Interactive project estimate', subtitle:'Choose services to see an indicative budget and timeline.', steps:['Choose services','Project details','Estimate & share'], step:'Step', of:'of', next:'Continue', back:'Back', platform:'Choose one primary website platform. Selecting WordPress, WooCommerce or custom development replaces the previous primary choice.', select:'Choose at least one service.', status:'Project status', statuses:['New project','Improve existing website','Add features'], urgency:'Preferred timeline', urgencies:['Flexible','Within a month','Urgent; confirmation required'], notes:'Additional requirements', placeholder:'Business, website URL and required features...', price:'Indicative cost', days:'Estimated duration', day:'business days', to:'to', caveat:'These are internal catalogue estimates, not verified market rates or binding offers. Hosting, domain, third-party services and API usage are excluded. Final price and timeline depend on a scope review.', summary:'Complete inquiry text', contact:'Use contact form', telegram:'Share via Telegram', direct:'Direct Telegram chat', email:'Send by email', whatsapp:'Share via WhatsApp', copy:'Copy full text', copied:'Full text copied.', copyError:'Automatic copy failed; select and copy the text below.', telegramNote:'Telegram sharing pre-fills the text but does not choose a recipient. Select a chat after opening Telegram, or copy and paste into the direct chat.', notSent:'This inquiry has not been sent yet.', instagram:'Instagram @haghiweb' }
};

const extraCSS = `
#inquiry{scroll-margin-top:110px}
#inquiry .qw-hint{padding:1rem 1.2rem;border-radius:16px;background:#eff6ff;color:#1e40af;line-height:1.9;margin-bottom:1.25rem}
.dark #inquiry .qw-hint{background:#172554;color:#bfdbfe}
#inquiry .qw-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
#inquiry .qw-card{display:flex;flex-direction:column;gap:.65rem;padding:1.25rem;border:1px solid #a1a1aa88;border-radius:18px;cursor:pointer;background:#fff;min-height:160px}
.dark #inquiry .qw-card{background:#18181b}
#inquiry .qw-card[data-selected="true"]{border:2px solid #2563eb;padding:calc(1.25rem - 1px)}
#inquiry .qw-card:focus-within{outline:3px solid #60a5fa;outline-offset:3px}
#inquiry .qw-card input{width:18px;height:18px;accent-color:#2563eb}
#inquiry .qw-card small{line-height:1.8;color:#71717a}
.dark #inquiry .qw-card small{color:#a1a1aa}
#inquiry .qw-price{color:#2563eb;font-weight:700;margin-top:auto}
#inquiry .qw-detail{display:grid;gap:1.25rem;max-width:650px;margin:auto}
#inquiry .qw-detail label{display:grid;gap:.5rem;font-weight:600}
#inquiry .qw-detail select,#inquiry .qw-detail textarea,#inquiry .qw-summary{width:100%;padding:1rem;border:1px solid #a1a1aa88;border-radius:12px;background:transparent;color:inherit}
#inquiry .qw-detail option{color:#18181b}
#inquiry .qw-summary{margin-top:1rem;line-height:1.9;min-height:210px}
#inquiry .qw-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.25rem}
#inquiry .qw-actions>*{flex:1 1 180px}
#inquiry .qw-social{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1rem}
#inquiry .qw-social a{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1rem;border:1px solid #a1a1aa88;border-radius:12px}
#inquiry .qw-notice{font-size:.85rem;line-height:1.9;margin-top:1rem;opacity:.8}
#inquiry .qw-panel:focus{outline:none}
@media(max-width:700px){#inquiry .qw-options{grid-template-columns:1fr}#inquiry .qw-actions>*{width:100%}}
`;

export default function QuoteWizard() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage === 'fa' ? 'fa' : 'en';
  const t = translations[lang];
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState(['website']);
  const [status, setStatus] = useState(0);
  const [urgency, setUrgency] = useState(0);
  const [notes, setNotes] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const panel = useRef(null);
  const selected = useMemo(() => QUOTE_OPTIONS.filter(item => chosen.includes(item.id)), [chosen]);
  const estimate = useMemo(() => estimateQuote(chosen), [chosen]);
  const money = n => formatQuote(n, lang);
  const summary = [t.summary, 'HaghiWeb — https://haghiweb.ir', '', ...selected.map(item => `• ${item[lang].title}: ${money(item.min)} – ${money(item.max)}`), '', `${t.price}: ${money(estimate.min)} – ${money(estimate.max)}`, `${t.days}: ${estimate.minDays}–${estimate.maxDays} ${t.day}`, `${t.status}: ${t.statuses[status]}`, `${t.urgency}: ${t.urgencies[urgency]}`, `${t.notes}: ${notes.trim() || '—'}`, '', t.caveat].join('\n');
  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent('https://haghiweb.ir')}&text=${encodeURIComponent(summary)}`;
  const emailShare = `mailto:aminhaghi@gmail.com?subject=${encodeURIComponent(t.title)}&body=${encodeURIComponent(summary)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(summary)}`;
  const toggle = id => { setCopyStatus(''); setChosen(current => current.includes(id) ? current.filter(x => x !== id) : PRIMARY.has(id) ? [...current.filter(x => !PRIMARY.has(x)), id] : [...current, id]); };
  const changeStep = n => { if(n > 0 && !chosen.length) return; setStep(Math.min(2, Math.max(0, n))); setCopyStatus(''); requestAnimationFrame(() => panel.current?.focus({preventScroll:true})); };
  const copySummary = async () => { try { await navigator.clipboard.writeText(summary); setCopyStatus(t.copied); } catch { setCopyStatus(t.copyError); } };
  const sendToContact = () => { window.dispatchEvent(new CustomEvent('portfolio:quote', {detail:summary})); document.getElementById('contact')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}); };

  // Handle existing header anchors without changing Header.jsx.
  useEffect(() => {
    const onClick = event => {
      const anchor = event.target.closest?.('a[href^="#"]');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      const offset = (document.querySelector('header')?.getBoundingClientRect().height || 0) + 12;
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
      window.scrollTo({top, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      if (location.hash !== hash) history.pushState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return <section id="inquiry" className="quote-section" aria-labelledby="quote-heading">
    <style>{extraCSS}</style>
    <div className="quote-intro"><span className="quote-eyebrow"><Calculator size={17}/>{t.title}</span><h2 id="quote-heading">{t.title}</h2><p>{t.subtitle}</p></div>
    <div className="quote-shell">
      <div className="quote-progress-label" aria-live="polite"><strong>{t.step} {step+1} {t.of} 3: {t.steps[step]}</strong><span>{Math.round((step+1)/3*100)}%</span></div>
      <progress className="quote-progress" max={3} value={step+1} aria-label={`${t.step} ${step+1} ${t.of} 3`}/>
      <ol className="quote-steps">{t.steps.map((label,i) => <li key={label} className={i===step?'active':i<step?'complete':''} aria-current={i===step?'step':undefined}><span>{i<step?<Check size={15}/>:i+1}</span><button type="button" disabled={i>step} onClick={()=>changeStep(i)}>{label}</button></li>)}</ol>
      <div className="qw-panel quote-panel" ref={panel} tabIndex={-1} role="group" aria-label={t.steps[step]}>
        {step===0 && <><p className="qw-hint">{t.platform}</p><div className="qw-options">{QUOTE_OPTIONS.map(item=><label className="qw-card" data-selected={chosen.includes(item.id)} key={item.id}><input type="checkbox" checked={chosen.includes(item.id)} onChange={()=>toggle(item.id)}/><strong>{item[lang].title}</strong><small>{item[lang].description}</small><span className="qw-price">{money(item.min)} – {money(item.max)}</span></label>)}</div></>}
        {step===1 && <div className="qw-detail"><label>{t.status}<select value={status} onChange={e=>setStatus(Number(e.target.value))}>{t.statuses.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></label><label>{t.urgency}<select value={urgency} onChange={e=>setUrgency(Number(e.target.value))}>{t.urgencies.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></label><label>{t.notes}<textarea rows={5} maxLength={500} dir="auto" value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t.placeholder}/></label></div>}
        {step===2 && <div className="quote-results"><p className="quote-ready">{t.notSent}</p><div className="quote-total"><p>{t.price}</p><strong className="quote-range"><bdi>{money(estimate.min)}</bdi><span>{t.to}</span><bdi>{money(estimate.max)}</bdi></strong><p>{t.days}: {estimate.minDays}–{estimate.maxDays} {t.day}</p></div><ul>{selected.map(item=><li key={item.id}><Check size={17}/>{item[lang].title}</li>)}</ul><p className="quote-disclaimer">{t.caveat}</p><details className="quote-summary" open><summary>{t.summary}</summary><textarea className="qw-summary" readOnly dir="auto" value={summary} rows={11} aria-label={t.summary} onFocus={e=>e.target.select()}/></details><div className="qw-actions quote-actions"><button type="button" className="quote-primary" onClick={sendToContact}>{t.contact}<ArrowLeft size={17}/></button><a className="quote-secondary" href={telegramShare} target="_blank" rel="noopener noreferrer"><Send size={17}/>{t.telegram}</a><a className="quote-secondary" href={emailShare}><Mail size={17}/>{t.email}</a><a className="quote-secondary" href={whatsappShare} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/>{t.whatsapp}</a><button type="button" className="quote-secondary" onClick={copySummary}><Copy size={17}/>{t.copy}</button></div><p className="qw-notice" role="status">{copyStatus}</p><p className="qw-notice">{t.telegramNote}</p><div className="qw-social"><a href="https://t.me/a_hgh86" target="_blank" rel="noopener noreferrer"><Send size={17}/>{t.direct}</a><a href="https://www.instagram.com/haghiweb/" target="_blank" rel="noopener noreferrer"><Camera size={17}/>{t.instagram}</a></div></div>}
      </div>
      <div className="quote-footer"><button type="button" className="quote-secondary" disabled={step===0} onClick={()=>changeStep(step-1)}><ArrowRight size={17}/>{t.back}</button>{step<2 && <button type="button" className="quote-primary" disabled={!chosen.length} onClick={()=>changeStep(step+1)}>{t.next}<ArrowLeft size={17}/></button>}{!chosen.length && <p role="status">{t.select}</p>}</div>
    </div>
  </section>;
}
