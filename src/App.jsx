import {
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { Phone } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';
import myData from "./data.json";
import cv from "/cv.pdf";
import { useTranslation } from "react-i18next";
import { initializeBrowserLanguage } from "./i18n";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import QuoteWizard from "./components/QuoteWizard";
import DibasanShowcase from "./components/DibasanShowcase";
import "./inquiry.css";
import ProjectDetailsDialog from "./components/ProjectDetailsDialog";
import "./portfolio.css";
import Testimonials from "./components/Testimonials";
import Collaboration from "./components/Collaboration";
import { FaWhatsapp } from "react-icons/fa";
import useScrollReveal from "./hooks/useScrollReveal";
import useLenis from "./hooks/useLenis";
import useProjectCards from "./hooks/useProjectCards";
import ScrollProgress from "./components/ScrollProgress";
import TechMarquee from "./components/TechMarquee";
import {
  getThemeSnapshot,
  getServerThemeSnapshot,
  subscribeTheme,
  setThemeMode,
} from "./utils/theme";
import Header from "./components/Header";
// const featuredProjectIds = [0, 7, 2];
const featuredProjectIds = [0, 8, 7];
export default function App() {
  const { t, i18n } = useTranslation();
  const mainRef = useRef(null);
  const language = i18n.resolvedLanguage === "fa" ? "fa" : "en";
  useScrollReveal(mainRef, [language]);
  useLenis();
  useProjectCards(mainRef, [language]);
  const services = t("serviceCards", { returnObjects: true });
  const themeSnapshot = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const [themeMode, resolvedTheme] = themeSnapshot.split(":");
  const dark = resolvedTheme === "dark";
  const policyRef = useRef(null);
  const captchaContainerRef = useRef(null);
  const lastCaptchaSize = useRef("compact");
  const [captchaSize, setCaptchaSize] = useState("compact");
  const sendingRef = useRef(false);
  const [status, setStatus] = useState({ type: "", messageKey: "" });
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  const [captchaKey, setCaptchaKey] = useState(0); // این کلید باعث ریست شدن کپچا می‌شود
  const [showPolicy, setShowPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  useEffect(() => {
    const receiveQuote = (event) => setForm(current => ({ ...current, message: event.detail.slice(0, 1900) }));
    window.addEventListener("portfolio:quote", receiveQuote);
    return () => window.removeEventListener("portfolio:quote", receiveQuote);
  }, []);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const personal = { ...myData.MyInformation[0], ...t("personal", { returnObjects: true }) };
  const projects = myData.myProjects.map((project) => ({
    ...project, ...t(`projectContent.${project.id}`, { returnObjects: true }),
  }));
  const whatsappUrl = `https://wa.me/989304978625?text=${encodeURIComponent(t("whatsappMessage"))}`;

  useEffect(() => {
    initializeBrowserLanguage();
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#0b0b10" : "#ffffff");
  }, [dark]);

  useEffect(() => {
    let previous = getThemeSnapshot();

    return subscribeTheme(() => {
      const next = getThemeSnapshot();

      if (next !== previous) {
        previous = next;
        setCaptchaToken(null);
      }
    });
  }, []);

  function changeThemeMode(mode) {
    setCaptchaToken(null);
    setThemeMode(mode);
  }

  function toggleLanguage() {
    setCaptchaToken(null);
    i18n.changeLanguage(language === "fa" ? "en" : "fa");
  }



  useEffect(() => {
    const dialog = policyRef.current;
    if (showPolicy && dialog && !dialog.open) dialog.showModal();
    if (!showPolicy && dialog?.open) dialog.close();
  }, [showPolicy]);

  useEffect(() => {
    const container = captchaContainerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const size = entry.contentRect.width < 300 ? "compact" : "flexible";
      if (size === lastCaptchaSize.current) return;
      lastCaptchaSize.current = size;
      setCaptchaToken(null);
      setCaptchaSize(size);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const sendToN8N = async (event) => {
    event.preventDefault();
    if (sendingRef.current) return;
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    if (!cleaned.name || !cleaned.message ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      setStatus({ type: "error", messageKey: "validation" });
      return;
    }
    if (!siteKey || !webhookUrl) {
      setStatus({ type: "error", messageKey: "unconfigured" });
      return;
    }
    if (!captchaToken) {
      setStatus({ type: "error", messageKey: "captchaRequired" });
      return;
    }
    const requestedService = services.find(service => service.id === selectedService);
    if (requestedService) cleaned.message = `${t("inquiryServicePrefix")}: ${requestedService.title}\n\n${cleaned.message}`;
    sendingRef.current = true;
    setLoading(true);
    setStatus({ type: "", messageKey: "" });
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cleaned, captcha: captchaToken, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error("Submission was not confirmed");
      setStatus({ type: "success", messageKey: "success" });
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
      setSelectedService("");
    } catch {
      setStatus({ type: "error", messageKey: "failed" });
    } finally {
      setCaptchaToken(null);
      setCaptchaKey((previous) => previous + 1);
      sendingRef.current = false;
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b10] text-zinc-900 dark:text-white transition-colors duration-300">
      <ScrollProgress />
      <a href="#main-content" className="skip-link">{t("skipContent")}</a>
      {/* HEADER / NAVBAR ****/}
      <Header
        language={language}
        themeMode={themeMode}
        onThemeChange={changeThemeMode}
        onLanguageToggle={toggleLanguage}
      />

      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <div data-reveal="exit-only">
          <HeroSection personal={personal} project={projects.find(project => project.id === 0)} onOpenProject={setActiveProjectId} />
        </div>
        <div data-reveal><TechMarquee /></div>
        <div data-reveal>
          <ServicesSection onSelectService={setSelectedService} />
        </div>
        <QuoteWizard />
        {/* FEATURED PROJECTS */}
        <section id="projects" data-reveal className="scroll-mt-24 md:scroll-mt-28 px-6 py-20 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">{t("projects")}</h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-12">{t("projectsIntro")}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean).map((project) => (
              <article
                key={project.id}
                data-reveal-item
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-full object-contain"
                  />
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3">{t(`caseStudies.${project.id}.badge`)}</p>
                  <h3 className="font-semibold text-xl mb-3">{project.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{t(`caseStudies.${project.id}.use`)}</p>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {project.tech.slice(0, 5).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300"
                      >
                        <bdi dir="ltr">{tech.skill}</bdi>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <button type="button" onClick={() => setActiveProjectId(project.id)} className="flex-1 text-center py-3 border border-zinc-300 dark:border-white/20 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition">{t("projectDetails")}<span className="sr-only"> — {project.title}</span></button>
                    {project.demo && project.demo !== project.github && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition"
                      >
                        {t(project.demoLabel === "Watch Demo" ? "watchDemo" : "liveDemo")}<span className="sr-only"> — {project.title}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <details className="mt-10 rounded-3xl border border-zinc-200 dark:border-white/10 p-6">
            <summary className="cursor-pointer font-semibold text-lg">{t("moreProjects")}</summary>
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {projects.filter((project) => !featuredProjectIds.includes(project.id)).map((project) => (
                <article
                  key={project.id}
                  data-reveal-item
                  data-tilt
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                  {project.gallery?.length > 0 && <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3">{t(`caseStudies.${project.id}.badge`)}</p>}
                  <h3 className="font-semibold text-xl mb-3">{project.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">{project.desc}</p>
                  <div className="flex flex-wrap items-center gap-5 mt-auto text-sm text-blue-600 dark:text-blue-400">
                    {project.gallery?.length > 0 && <button type="button" className="portfolio-button secondary" onClick={() => setActiveProjectId(project.id)}>{t("projectDetails")}<span className="sr-only"> — {project.title}</span></button>}
                    {project.github && project.github !== "#" && <a href={project.github} target="_blank" rel="noopener noreferrer">{t("github")}<span className="sr-only"> — {project.title}</span></a>}
                    {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">{t(project.demoLabel === "Watch Demo" ? "watchDemo" : "liveDemo")}<span className="sr-only"> — {project.title}</span></a>}
                  </div>
                  </div>
                </article>
              ))}
            </div>
          </details>
        </section>
        <DibasanShowcase />
        <div data-reveal>

          <Testimonials />
        </div>
        <div data-reveal>

          <Collaboration />
        </div>

        {/* ABOUT ME */}
        {/* ABOUT ME - نسخه بهبود یافته */}
        <section id="about" data-reveal className="scroll-mt-24 md:scroll-mt-28 px-6 py-20 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div>
              <h2 className="text-4xl font-bold mb-6">{t("about")}</h2>

              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
                {personal.bio}
              </p>

              <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {personal.about}
              </p>

              <details className="about-details mt-6">
                <summary>{t("aboutDetails")}</summary>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("skillsSummary")}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("experienceSummary")}</p>
              </details>

              <a href={cv} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 text-blue-600 dark:text-blue-400 underline">{t("cv")}</a>
              {/* Social Links - جدید */}
              <div className="mt-10 flex gap-4">
                <a
                  href={myData.myPersonalInfo[0].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-[#0A66C2] text-white rounded-2xl hover:bg-[#0A66C2]/90 transition-all"
                >
                  <span>{t("linkedin")}</span>
                </a>

                <a
                  href={myData.myPersonalInfo[0].github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 rounded-2xl hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all"
                >
                  <span>{t("github")}</span>
                </a>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <img
                src={personal.image}
                alt={personal.name}
                className="w-full max-w-80 aspect-square rounded-3xl object-cover shadow-2xl border-4 border-white dark:border-zinc-800"
              />
            </div>
          </div>
        </section>

        <section data-reveal className="px-6 pb-20 max-w-4xl mx-auto" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl font-bold mb-8">{t("faqTitle")}</h2>
          <div className="space-y-4">
            {t("faqItems", { returnObjects: true }).map((item) => (
              <details key={item.question} className="border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        {/* CONTACT */}
        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-24 md:scroll-mt-28 px-6 py-20 max-w-6xl mx-auto">
          <div className="bg-zinc-100 dark:bg-white/5 rounded-3xl p-5 sm:p-8 md:p-12">
            <h2 className="text-4xl font-bold text-center mb-4">{t("contact")}</h2>
            <p className="text-center max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 mb-3">{t("contactIntro")}</p>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-10">{t("contactNext")}</p>

            {/* اطلاعات تماس */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* Location */}
              <a
                href="https://www.google.com/maps?q=Mashhad+Iran"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl group-hover:scale-110 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{t("location")}</p>
                  <p className="text-zinc-500 dark:text-zinc-400">{t("city")}</p>
                </div>
              </a>

              {/* phone number */}
              <a
                href="tel:+989304978625"
                className="group flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl group-hover:scale-110 transition">
                  <Phone size={26} />
                </div>
                <div>
                  <p className="font-semibold">{t("call")}</p>
                  <p dir="ltr" className="text-start text-zinc-500 dark:text-zinc-400">+989304978625</p>
                </div>
              </a>
              {/* Email */}
              <a
                href="mailto:aminhaghi@gmail.com"
                className="group flex items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{t("email")}</p>
                  <p dir="ltr" className="text-zinc-500 dark:text-zinc-400 break-all">aminhaghi@gmail.com</p>
                </div>
              </a>

              {/* LinkedIn & GitHub - می‌توانی بعداً اضافه کنی */}
            </div>

            {/* فرم ارسال پیام */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-center mb-8">
                {t("formTitle")}
              </h3>

              <form onSubmit={sendToN8N} className="space-y-4" aria-busy={loading}>
                <fieldset disabled={loading} className="min-w-0 space-y-4" aria-label={t("formTitle")}>
                  <label htmlFor="contact-service" className="block text-sm font-medium">{t("inquiryService")}</label>
                  <select id="contact-service" name="service" className="contact-service" value={selectedService} onChange={event => setSelectedService(event.target.value)}>
                    <option value="">{t("servicePlaceholder")}</option>
                    {services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}
                  </select>
                  {/* نام */}
                  <label htmlFor="contact-name" className="block text-sm font-medium">{t("nameLabel")}</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    dir="auto"
                    maxLength={100}
                    required
                    autoComplete="name"
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 
           text-zinc-900 dark:text-white 
           placeholder-zinc-400 dark:placeholder-zinc-500
           border border-zinc-200 dark:border-white/10 
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           outline-none transition-all" />

                  {/* ردیف دوم: ایمیل و تلفن */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium">{t("emailLabel")}</label>
                      <input
                        type="email"
                        dir="ltr"
                        id="contact-email"
                        name="email"
                        maxLength={254}
                        required
                        autoComplete="email"
                        placeholder={t("emailPlaceholder")}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 
           text-zinc-900 dark:text-white 
           placeholder-zinc-400 dark:placeholder-zinc-500
           border border-zinc-200 dark:border-white/10 
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           outline-none transition-all"/>
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium">{t("phoneLabel")}</label>
                      <input
                        type="tel"
                        dir="ltr"
                        id="contact-phone"
                        name="phone"
                        maxLength={50}
                        autoComplete="tel"
                        placeholder={t("phonePlaceholder")}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 
           text-zinc-900 dark:text-white 
           placeholder-zinc-400 dark:placeholder-zinc-500
           border border-zinc-200 dark:border-white/10 
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           outline-none transition-all" />
                    </div>
                  </div>

                  {/* شرکت */}
                  <label htmlFor="contact-company" className="block text-sm font-medium">{t("companyLabel")}</label>
                  <input
                    type="text"
                    id="contact-company"
                    name="company"
                    dir="auto"
                    maxLength={150}
                    autoComplete="organization"
                    placeholder={t("companyPlaceholder")}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 
           text-zinc-900 dark:text-white 
           placeholder-zinc-400 dark:placeholder-zinc-500
           border border-zinc-200 dark:border-white/10 
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           outline-none transition-all" />

                  {/* متن پیام */}
                  <label htmlFor="contact-message" className="block text-sm font-medium">{t("messageLabel")}</label>
                  <textarea
                    dir="auto"
                    id="contact-message"
                    name="message"
                    maxLength={1900}
                    required
                    placeholder={t("messagePlaceholder")}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 
           text-zinc-900 dark:text-white 
           placeholder-zinc-400 dark:placeholder-zinc-500
           border border-zinc-200 dark:border-white/10 
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           outline-none transition-all" />

                  {/* ویجت کپچا - بهتر است بالای دکمه باشد تا کاربر اول آن را ببیند */}
                  <div ref={captchaContainerRef} className="flex justify-center my-2 overflow-x-auto"
                    style={{ minHeight: captchaSize === "compact" ? 140 : 65 }}
                  >

                    {siteKey ? <Turnstile
                      key={`${captchaKey}-${language}-${dark}-${captchaSize}`}
                      siteKey={siteKey}
                      onSuccess={(token) => setCaptchaToken(token)}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => {
                        setCaptchaToken(null);
                        setStatus({ type: "error", messageKey: "captchaError" });
                      }}
                      options={{ theme: dark ? "dark" : "light", language, size: captchaSize }}
                    /> : <p className="text-sm text-red-600 dark:text-red-400">{t("formUnavailable")}</p>}
                  </div>

                  {/* دکمه ارسال */}
                  <button
                    type="submit"
                    disabled={loading || !siteKey || !webhookUrl}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-2xl font-medium text-lg transition-all"
                  >
                    {loading ? t("sending") : t("send")}
                  </button>
                </fieldset>
                {status.messageKey && <p role={status.type === "error" ? "alert" : "status"} className={status.type === "error" ? "text-sm text-red-600 dark:text-red-400" : "text-sm text-green-700 dark:text-green-400"}>{t(status.messageKey)}</p>}
              </form>

              <div className="mt-6 space-y-2 text-center">
                <p className="text-xs text-zinc-500">
                  {t("deliveryNotice")}
                </p>

                <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                  {t("acknowledgement")}
                </p>

                <button
                  onClick={() => setShowPolicy(true)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t("readPrivacy")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* FLOATING CONTACT */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("floatingContact")}
        className="fixed bottom-6 start-6 z-50 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-full shadow-2xl transition-all"
      >
        <FaWhatsapp size={25} aria-hidden="true" /><span className="text-sm font-semibold">{t("whatsappShort")}</span>
      </a>
      <ProjectDetailsDialog project={projects.find(project => project.id === activeProjectId) ?? null} onClose={() => setActiveProjectId(null)} />
      <dialog
        ref={policyRef}
        onClose={() => setShowPolicy(false)}
        aria-labelledby="privacy-title"
        className="m-auto w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-8 shadow-2xl backdrop:bg-black/60"
      >
        <div className="flex justify-between items-center gap-4 mb-6">
          <h2 id="privacy-title" className="text-2xl font-bold">{t("privacyTitle")}</h2>
          <button type="button" autoFocus onClick={() => setShowPolicy(false)} aria-label={t("closePrivacy")} className="p-2 text-zinc-500 hover:text-red-500 text-xl">✕</button>
        </div>
        <div className="space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <p>{t("privacyOperator")}</p>
          <p>{t("privacyData")}</p>
          <p>{t("privacySecurity")}</p>
          <p>{t("privacyStorage")}</p>
          <p>{t("privacyPreferences")}</p>
          <p>{t("privacyDeletion")} <a href="mailto:aminhaghi@gmail.com" className="text-blue-600 dark:text-blue-400 underline"><bdi dir="ltr">aminhaghi@gmail.com</bdi></a>{t("privacySensitive")}</p>
          <p><a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline">{t("cloudflarePrivacy")}</a> · <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="underline">{t("telegramPrivacy")}</a></p>
        </div>
      </dialog>
      {/* FOOTER */}
      <footer className="py-12 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-white/10 space-y-4">

        <p>{t("copyright", { year: new Date().getFullYear() })}</p>

        <div className="flex justify-center gap-6 text-xs">
          <button
            onClick={() => setShowPolicy(true)}
            className="hover:text-blue-600 transition"
          >
            {t("privacy")}
          </button>

          <a
            href="mailto:aminhaghi@gmail.com"
            className="hover:text-blue-600 transition"
          >
            {t("footerContact")}
          </a>
        </div>

      </footer>
    </div>
  );
}
