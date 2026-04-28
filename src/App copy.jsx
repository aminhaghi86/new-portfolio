import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import cv from "/cv.pdf";
export default function App() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);



  const sendToN8N = async () => {
    try {
      setLoading(true);

      await fetch("https://n8n.germanyad.com/webhook/hire-me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Sent successfully 🚀");

      setForm({
        name: "",
        company: "",
        message: "",
      });

    } catch (err) {
      alert("Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b10] text-zinc-900 dark:text-white transition">

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-white/10">
        <h1 className="text-lg font-semibold">
          Amin Haghi • Frontend Developer
        </h1>

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-zinc-100 dark:bg-white/10"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* HERO - بهبود یافته */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-white/10 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Available for freelance & full-time
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Amin Haghi
          </h1>
          <h2 className="text-4xl md:text-5xl font-semibold text-zinc-500 dark:text-zinc-400 mt-3">
            Frontend Developer & System Builder
          </h2>

          <p className="mt-8 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            I build high-performance web applications and intelligent automation systems with modern technologies.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 transition rounded-2xl font-medium text-lg">
              Hire Me
            </button>
            <a href={cv} target="_blank" className="px-8 py-4 border border-zinc-300 dark:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl font-medium text-lg transition">
              Download CV
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      {/* CONTACT */}
      <section className="px-6 max-w-6xl mx-auto pb-20">
        <div className="bg-zinc-100 dark:bg-white/5 rounded-3xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300">

          <h2 className="text-3xl font-bold text-center mb-10 text-zinc-800 dark:text-white">
            Get In Touch
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Location */}
            <a
              href="https://maps.google.com/?q=Muscat+Oman"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">Location</p>
                <p className="text-zinc-500 dark:text-zinc-400">Muscat, Oman</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:aminhaghi@gmail.com"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">Email</p>
                <p className="text-zinc-500 dark:text-zinc-400">aminhaghi@gmail.com</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/aminhaghi"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 text-[#0A66C2] rounded-2xl group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">LinkedIn</p>
                <p className="text-zinc-500 dark:text-zinc-400">linkedin.com/in/aminhaghi</p>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/aminhaghi86"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 rounded-2xl group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577 0-.285-.01-1.044-.015-2.049-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.652 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">GitHub</p>
                <p className="text-zinc-500 dark:text-zinc-400">github.com/aminhaghi86</p>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="grid md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto pb-20">

        {[
          {
            title: "Frontend",
            items: "React, Vue, Angular, TypeScript, UI/UX"
          },
          {
            title: "Backend",
            items: "Node.js, Express, .NET, REST APIs"
          },
          {
            title: "Automation",
            items: "n8n, Telegram Bots, CI/CD, WebSocket"
          }
        ].map((item, index) => (

          <div key={index}
            className="p-6 rounded-3xl bg-zinc-100 dark:bg-white/5 hover:scale-105 hover:shadow-2xl transition duration-300">

            <h3 className="text-xl font-bold mb-3">
              {item.title}
            </h3>

            <p className="text-zinc-500 dark:text-zinc-400 leading-7">
              {item.items}
            </p>

          </div>

        ))}
      </section>

      {/* EXPERIENCE (REAL CV ADAPTED) */}
      <section className="px-8 max-w-4xl mx-auto pb-16">
        <h2 className="text-2xl font-bold mb-6">Experience</h2>

        <div className="space-y-6">

          <div className="border-l-2 border-blue-600 pl-4">
            <h3 className="font-semibold">Freelancer (AI Language Platform)</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Built AI-powered CEFR learning system with SRS + 5,500 assets + microservices
            </p>
          </div>

          <div className="border-l-2 border-blue-600 pl-4">
            <h3 className="font-semibold">Frontend Developer - Sweden</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Built travel booking system with React, Redux, APIs, Google Maps
            </p>
          </div>

          <div className="border-l-2 border-blue-600 pl-4">
            <h3 className="font-semibold">Frontend Developer - Iran</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Improved UX, SEO, reusable components, +25% user engagement
            </p>
          </div>

        </div>
      </section>

      {/* HIRE FORM (n8n) */}
      <section className="px-8 max-w-4xl mx-auto pb-20">
        <h2 className="text-2xl font-bold mb-4">Hire Me Instantly</h2>

        <input
          className="w-full p-3 mb-3 rounded bg-zinc-100 dark:bg-white/5"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full p-3 mb-3 rounded bg-zinc-100 dark:bg-white/5"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <textarea
          className="w-full p-3 mb-3 rounded bg-zinc-100 dark:bg-white/5"
          placeholder="Your message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          onClick={sendToN8N}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-sm text-zinc-500 border-t border-zinc-200 dark:border-white/10">
        Professional Developer Portfolio • Built with React
      </footer>

    </div>
  );
}