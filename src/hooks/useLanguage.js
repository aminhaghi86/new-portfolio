import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initializeBrowserLanguage, languageFromPath, setLanguage } from "../i18n";

/** Current language plus an in-place toggle that keeps back/forward working. */
export default function useLanguage() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "fa" ? "fa" : "en";

  useEffect(() => {
    initializeBrowserLanguage();
    const syncWithUrl = () => setLanguage(languageFromPath(window.location.pathname), { updateUrl: false });
    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, []);

  const toggleLanguage = () => setLanguage(language === "fa" ? "en" : "fa");
  return { language, toggleLanguage };
}
