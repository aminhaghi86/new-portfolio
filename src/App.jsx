import { useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Turnstile } from '@marsidev/react-turnstile';
import myData from "./data.json";
import cv from "/cv.pdf";
export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("theme") !== "light"; }
    catch { return true; }
  });
  const policyRef = useRef(null);
  const [status, setStatus] = useState({ type: "", message: "" });
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
  const personal = myData.MyInformation[0];
  const projects = myData.myProjects;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); }
    catch { /* Theme still works when browser storage is unavailable. */ }
  }, [dark]);

  useEffect(() => {
    const dialog = policyRef.current;
    if (showPolicy && dialog && !dialog.open) dialog.showModal();
    if (!showPolicy && dialog?.open) dialog.close();
  }, [showPolicy]);

  const sendToN8N = async (event) => {
    event.preventDefault();
    if (loading) return;
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    if (!cleaned.name || !cleaned.message ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      setStatus({ type: "error", message: "Please enter your name, a valid email address, and a message." });
      return;
    }
    if (!siteKey || !webhookUrl) {
      setStatus({ type: "error", message: "The contact form is temporarily unavailable. Please email aminhaghi@gmail.com." });
      return;
    }
    if (!captchaToken) {
      setStatus({ type: "error", message: "Please complete the security check (Cloudflare Turnstile)." });
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cleaned, captcha: captchaToken, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error("Submission was not confirmed");
      setStatus({ type: "success", message: "Your message has been sent. Thank you — I will reply by email." });
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Delivery could not be confirmed. Please email aminhaghi@gmail.com, or try again. If the connection timed out, your message may already have arrived." });
    } finally {
      setCaptchaToken(null);
      setCaptchaKey((previous) => previous + 1);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b10] text-zinc-900 dark:text-white transition-colors duration-300">
      {/* HEADER / NAVBAR ****/}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0b10]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <a href="#home" className="text-xl sm:text-2xl font-bold tracking-tight">Amin Haghi</a>
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm">
            {myData.navbarItems.map((item) => <a key={item.id} href={item.url} className="hover:text-blue-600 dark:hover:text-blue-400">{item.link}</a>)}
          </nav>

          <button
            onClick={() => setDark((previous) => !previous)}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-all"
          >
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="md:hidden flex justify-center gap-5 px-4 pb-4 text-sm">
          {myData.navbarItems.map((item) => <a key={item.id} href={item.url} className="hover:text-blue-600 dark:hover:text-blue-400">{item.link}</a>)}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="scroll-mt-28 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight"
          >
            Hi, I'm <span className="text-blue-600 dark:text-blue-500">{personal.name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-medium text-zinc-500 dark:text-zinc-400 mt-4"
          >
            {personal.role}
          </motion.h2>

          <p className="mt-8 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {personal.description}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <motion.a
              href="#contact"
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium text-lg transition-all active:scale-95"
            >
              Discuss Your Project
            </motion.a>
            <motion.a
              href={cv}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl font-medium text-lg transition-all"
            >
              View CV
            </motion.a>
          </div>
        </div>
      </section>

      {/* ABOUT ME */}
      {/* ABOUT ME - نسخه بهبود یافته */}
      <section id="about" className="scroll-mt-28 px-6 py-20 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-4xl font-bold mb-6">About Me</h2>

            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
              {personal.bio}
            </p>

            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {personal.about}
            </p>

            {/* Social Links - جدید */}
            <div className="mt-10 flex gap-4">
              <a
                href={myData.myPersonalInfo[0].linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-[#0A66C2] text-white rounded-2xl hover:bg-[#0A66C2]/90 transition-all"
              >
                <span>LinkedIn</span>
              </a>

              <a
                href={myData.myPersonalInfo[0].github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 rounded-2xl hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all"
              >
                <span>GitHub</span>
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

      <section id="services" className="scroll-mt-28 px-6 py-20 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10">
        <h2 className="text-4xl font-bold text-center mb-4">How I Can Help</h2>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">Practical development services for businesses and agencies.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {myData.services.map((service) => (
            <article key={service.title} className="flex flex-col p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900">
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{service.description}</p>
              <a href="#contact" className="mt-auto text-blue-600 dark:text-blue-400 font-medium">Discuss Your Requirements →</a>
            </article>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="px-6 py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {myData.skills.map((skill, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white dark:bg-zinc-900 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4">{skill.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {skill.items}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="scroll-mt-28 px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-7 flex flex-col flex-1">
                <h3 className="font-semibold text-xl mb-3">{project.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-7">
                  {project.tech.slice(0, 5).map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300"
                    >
                      {tech.skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-auto">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 border border-zinc-300 dark:border-white/20 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                  >
                    GitHub
                  </a>
                  {project.demo && project.demo !== project.github && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition"
                    >
                      {project.demoLabel || "Live Demo"}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <article className="p-8 md:p-12 rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">Automation in use on this website</p>
          <h2 className="text-3xl font-bold mb-4">Portfolio Inquiry Automation</h2>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">I connected this contact form to a workflow on my n8n server. Project inquiries are delivered to my Telegram inbox, so I can follow up with the sender by email.</p>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">React · n8n · Telegram · Cloudflare Turnstile</p>
          <a href="#contact" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-medium">Discuss a Similar Workflow →</a>
        </article>
      </section>

      {/* EXPERIENCE */}
      <section className="px-6 py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Background & Experience</h2>
          <div className="space-y-10">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-semibold text-xl">Freelance Web Developer</h3>
              <p className="text-zinc-500 dark:text-zinc-400">2023 - Present</p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Developing web applications and workflow integrations. Available for freelance projects and collaboration with agencies.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-semibold text-xl">Frontend Development Training — Sweden</h3>
              <p className="text-zinc-500 dark:text-zinc-400">2022 - 2023</p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Completed frontend development training in Sweden, working on practical web development projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      {/* CONTACT SECTION */}
      <section id="contact" className="scroll-mt-28 px-6 py-20 max-w-6xl mx-auto">
        <div className="bg-zinc-100 dark:bg-white/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-center mb-10">Get In Touch</h2>

          {/* اطلاعات تماس */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {/* Location */}
            <a
              href="https://www.google.com/maps?q=Mashhad+Iran"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl group-hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-zinc-500 dark:text-zinc-400">Mashhad, Iran</p>
              </div>
            </a>

            {/* phone number */}
            <a
              href="tel:+989304978625"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl group-hover:scale-110 transition">
                <Phone size={26} />
              </div>
              <div>
                <p className="font-semibold">Call me</p>
                <p className="text-zinc-500 dark:text-zinc-400">+989304978625</p>
              </div>
            </a>
            {/* Email */}
            <a
              href="mailto:aminhaghi@gmail.com"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-zinc-500 dark:text-zinc-400">aminhaghi@gmail.com</p>
              </div>
            </a>

            {/* LinkedIn & GitHub - می‌توانی بعداً اضافه کنی */}
          </div>

          {/* فرم ارسال پیام */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-center mb-8">
              Tell Me About Your Project
            </h3>

            <form onSubmit={sendToN8N} className="space-y-4" aria-busy={loading}>
              {/* نام */}
              <label htmlFor="contact-name" className="block text-sm font-medium">Name *</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                maxLength={100}
                required
                autoComplete="name"
                placeholder="Your Name *"
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
                <label htmlFor="contact-email" className="block text-sm font-medium">Email address *</label>
              <input
                  type="email"
                  id="contact-email"
                name="email"
                maxLength={254}
                required
                autoComplete="email"
                placeholder="Email Address *"
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
                <label htmlFor="contact-phone" className="block text-sm font-medium">Phone (optional)</label>
              <input
                  type="tel"
                  id="contact-phone"
                name="phone"
                maxLength={50}
                autoComplete="tel"
                placeholder="e.g. +98…"
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
              <label htmlFor="contact-company" className="block text-sm font-medium">Company (optional)</label>
              <input
                type="text"
                id="contact-company"
                name="company"
                maxLength={150}
                autoComplete="organization"
                placeholder="Company (Optional)"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 
           text-zinc-900 dark:text-white 
           placeholder-zinc-400 dark:placeholder-zinc-500
           border border-zinc-200 dark:border-white/10 
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           outline-none transition-all" />

              {/* متن پیام */}
              <label htmlFor="contact-message" className="block text-sm font-medium">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                maxLength={2000}
                required
                placeholder="What do you need built or improved? Include your timeline and budget range if available."
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
              <div className="flex justify-center my-2 overflow-x-auto">
                {siteKey ? <Turnstile
                  key={captchaKey}
                  siteKey={siteKey}
                  onSuccess={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => {
                    setCaptchaToken(null);
                    setStatus({ type: "error", message: "Security verification could not load. Please retry or contact me by email." });
                  }}
                  options={{ theme: dark ? "dark" : "light" }}
                /> : <p className="text-sm text-red-600 dark:text-red-400">The form is temporarily unavailable. Please use the email link above.</p>}
              </div>

              {/* دکمه ارسال */}
              <button
                type="submit"
                disabled={loading || !siteKey || !webhookUrl}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-2xl font-medium text-lg transition-all"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {status.message && <p role={status.type === "error" ? "alert" : "status"} className={status.type === "error" ? "text-sm text-red-600 dark:text-red-400" : "text-sm text-green-700 dark:text-green-400"}>{status.message}</p>}
            </form>

            <div className="mt-6 space-y-2 text-center">
              <p className="text-xs text-zinc-500">
                Your inquiry is processed through my n8n workflow and delivered to my Telegram inbox.
              </p>

              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                By submitting this form, you acknowledge the processing described in the privacy notice.
                Please do not include passwords, payment details, or other sensitive information.
              </p>

              <button
                onClick={() => setShowPolicy(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                Read Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* FLOATING CONTACT */}
      <a
        href="#contact"
        aria-label="Discuss your project"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
      >
        <MessageCircle size={28} />
      </a>
      <dialog
        ref={policyRef}
        onClose={() => setShowPolicy(false)}
        aria-labelledby="privacy-title"
        className="m-auto w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-8 shadow-2xl backdrop:bg-black/60"
      >
        <div className="flex justify-between items-center gap-4 mb-6">
          <h2 id="privacy-title" className="text-2xl font-bold">Privacy Notice</h2>
          <button type="button" autoFocus onClick={() => setShowPolicy(false)} aria-label="Close privacy notice" className="p-2 text-zinc-500 hover:text-red-500 text-xl">✕</button>
        </div>
        <div className="space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <p>This website is operated by Amin Haghi for presenting development work and receiving project inquiries.</p>
          <p>The contact form sends your name, email address, message, optional phone number and company, submission time, and a security verification token to my self-hosted n8n workflow. Your inquiry is then delivered to my Telegram inbox so I can respond and discuss your project.</p>
          <p>Cloudflare Turnstile verifies the security token to help prevent spam. Cloudflare may process technical information, including your IP address and browser information, for this verification. My hosting server may also record technical request logs. This form does not request your location from an IP lookup service or include browser profiling details in the inquiry payload.</p>
          <p>Your inquiry may be stored in n8n execution history and my Telegram inbox. It is used to respond to you, discuss potential work, and prevent misuse. I do not sell inquiry information or use it for advertising. Cloudflare and Telegram process information as part of these services.</p>
          <p>You can request removal of inquiry records under my control by emailing <a href="mailto:aminhaghi@gmail.com" className="text-blue-600 dark:text-blue-400 underline">aminhaghi@gmail.com</a>. Please avoid submitting passwords, payment information, or other sensitive details.</p>
          <p><a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline">Cloudflare privacy policy</a> · <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="underline">Telegram privacy policy</a></p>
        </div>
      </dialog>
      {/* FOOTER */}
      <footer className="py-12 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-white/10 space-y-4">

        <p>© {new Date().getFullYear()} Amin Haghi • Built with React & Tailwind</p>

        <div className="flex justify-center gap-6 text-xs">
          <button
            onClick={() => setShowPolicy(true)}
            className="hover:text-blue-600 transition"
          >
            Privacy Policy
          </button>

          <a
            href="mailto:aminhaghi@gmail.com"
            className="hover:text-blue-600 transition"
          >
            Contact
          </a>
        </div>

      </footer>
    </div>
  );
}