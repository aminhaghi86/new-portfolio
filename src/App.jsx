import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import myData from "./data.json";
import cv from "/cv.pdf";

export default function App() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    message: "",
  });
  console.log(myData)
  const personal = myData.MyInformation[0];
  const projects = myData.myProjects;

  // Theme Management
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const sendToN8N = async () => {
    if (!form.name || !form.message) {
      alert("Please fill your name and message");
      return;
    }

    try {
      setLoading(true);

      // خواندن URL از فایل .env
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      // چک ایمنی
      if (!webhookUrl) {
        alert("Error: Webhook URL is not configured. Please contact the developer.");
        console.error("VITE_N8N_WEBHOOK_URL is missing in .env file");
        return;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Message sent successfully! 🚀");

      // ریست کردن فرم
      setForm({ name: "", company: "", message: "" });

    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b10] text-zinc-900 dark:text-white transition-colors duration-300">

      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0b10]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Amin Haghi</h1>

          <button
            onClick={() => setDark(!dark)}
            className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-all"
          >
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-7xl font-bold leading-tight"
          >
            Hi, I'm <span className="text-blue-600 dark:text-blue-500">{personal.name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-medium text-zinc-500 dark:text-zinc-400 mt-4"
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
              Hire Me
            </motion.a>
            <motion.a
              href={cv}
              target="_blank"
              className="px-10 py-4 border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl font-medium text-lg transition-all"
            >
              Download CV
            </motion.a>
          </div>
        </div>
      </section>

      {/* ABOUT ME */}
      {/* ABOUT ME - نسخه بهبود یافته */}
      <section className="px-6 py-20 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-4xl font-bold mb-6">About Me</h2>

            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
              {personal.bio}
            </p>

            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {personal.description}
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
              alt={`${personal.name} ${personal.family}`}
              className="w-80 h-80 rounded-3xl object-cover shadow-2xl border-4 border-white dark:border-zinc-800"
            />
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="px-6 py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Frontend", items: "React, Vue, Angular, TypeScript, Tailwind, UI/UX" },
              { title: "Backend & Tools", items: "Node.js, Express, .NET, REST APIs, PostgreSQL" },
              { title: "Automation & Others", items: "n8n, Telegram Bots, Socket.IO, CI/CD, WebSocket" },
            ].map((skill, i) => (
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
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-7">
                <h3 className="font-semibold text-xl mb-3 line-clamp-2">{project.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-4 mb-6">
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

                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 border border-zinc-300 dark:border-white/20 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition"
                  >
                    GitHub
                  </a>
                  {project.demo && project.demo.includes("http") && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="px-6 py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
          <div className="space-y-10">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-semibold text-xl">Freelance Frontend Developer</h3>
              <p className="text-zinc-500 dark:text-zinc-400">2023 - Present</p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Built AI-powered CEFR learning platform with SRS system and microservices architecture.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="font-semibold text-xl">Frontend Developer - Sweden</h3>
              <p className="text-zinc-500 dark:text-zinc-400">2022 - 2023</p>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Developed travel booking system using React, Redux, and Google Maps integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      {/* CONTACT SECTION */}
      <section id="contact" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="bg-zinc-100 dark:bg-white/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-center mb-10">Get In Touch</h2>

          {/* اطلاعات تماس */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {/* Location */}
            <a
              href="https://maps.google.com/?q=Muscat+Oman"
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
                <p className="text-zinc-500 dark:text-zinc-400">Muscat, Oman</p>
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
            <h3 className="text-2xl font-semibold text-center mb-8">Hire Me Instantly</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 focus:border-blue-500 outline-none border border-transparent"
              />

              <input
                type="text"
                placeholder="Company (Optional)"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 focus:border-blue-500 outline-none border border-transparent"
              />

              <textarea
                placeholder="Your Message *"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 focus:border-blue-500 outline-none border border-transparent resize-y"
              />

              <button
                onClick={sendToN8N}
                disabled={loading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-2xl font-medium text-lg transition-all"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>

            <p className="text-center text-xs text-zinc-500 mt-6">
              Your message will be sent to my Telegram via n8n
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-white/10">
        © 2026 Amin Haghi • Built with React & Tailwind
      </footer>
    </div>
  );
}