import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import myData from "../data.json";
import ThemeToggle from "./ThemeToggle";

export default function Header({ language, themeMode, onThemeChange, onLanguageToggle }) {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigation = myData.navbarItems.map((item, index) => ({ ...item, link: t(`nav.${index}`) }));

    // منوی موبایل: با Escape یا بزرگ شدن صفحه بسته شود
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (event) => { if (event.key === "Escape") setMenuOpen(false); };
        const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
        };
    }, [menuOpen]);

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0b10]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                <a href="#home" aria-label={t("brand")} className="brand-lockup text-lg sm:text-xl font-bold">
                    <span className="brand-mark" aria-hidden="true" dir="ltr">AH</span>
                    <span className="hidden sm:inline">{t("brand")}</span>
                </a>

                <nav aria-label={t("mainNav")} className="hidden md:flex items-center gap-6 text-sm">
                    {navigation.map((item) => (
                        <a key={item.id} href={item.url} className="hover:text-blue-600 dark:hover:text-blue-400">{item.link}</a>
                    ))}
                    <a href="#inquiry" className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">{language === "fa" ? "استعلام قیمت" : "Get a quote"}</a>
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onLanguageToggle}
                        aria-label={t("language")}
                        className="px-3 py-3 rounded-2xl bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20"
                        lang={language === "fa" ? "en" : "fa"}
                    >
                        {language === "fa" ? "English" : "فارسی"}
                    </button>

                    <ThemeToggle mode={themeMode} language={language} onChange={onThemeChange} />

                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        className="md:hidden p-3 rounded-2xl bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-all"
                    >
                        {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav id="mobile-menu" aria-label={t("mobileNav")} className="md:hidden flex flex-col px-6 pb-3 text-base">
                    <a href="#inquiry" onClick={() => setMenuOpen(false)} className="py-3.5 border-t border-zinc-200 dark:border-white/10 font-semibold text-blue-600 dark:text-blue-400">{language === "fa" ? "استعلام قیمت" : "Get a quote"}</a>
                    {navigation.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            onClick={() => setMenuOpen(false)}
                            className="py-3.5 border-t border-zinc-200 dark:border-white/10 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            {item.link}
                        </a>
                    ))}
                </nav>
            )}
        </header>
    );
}