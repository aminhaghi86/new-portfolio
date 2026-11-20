import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fa from "./locales/fa.json";
import { languagePath, updateMetadata } from "./seo/metadata";

export const supportedLanguages = ["fa", "en"];

export const languageFromPath = (pathname) =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa";

const isHomePath = (pathname) => ["/", "/en", "/en/"].includes(pathname);

function updateDocument(language) {
  if (typeof document === "undefined") return;
  updateMetadata(window.location.pathname, language);
  try { localStorage.setItem("portfolio-language", language); } catch { /* optional preference */ }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: typeof window === "undefined" ? "fa" : languageFromPath(window.location.pathname),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

i18n.on("languageChanged", updateDocument);

/**
 * Switches language in place (no reload). Each language keeps its own
 * prerendered URL (`/` and `/en/`), so the address bar is updated too.
 */
export function setLanguage(language, { updateUrl = true } = {}) {
  if (!supportedLanguages.includes(language)) return;
  const path = languagePath(language);
  if (updateUrl && window.location.pathname !== path) {
    window.history.pushState(window.history.state, "", path + window.location.hash);
  }
  if (i18n.resolvedLanguage === language) updateDocument(language);
  else i18n.changeLanguage(language);
}

/** Applies a legacy `?lang=` link and syncs metadata after hydration. */
export function initializeBrowserLanguage() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("lang");
  if (isHomePath(url.pathname) && supportedLanguages.includes(query)) {
    url.searchParams.delete("lang");
    url.pathname = languagePath(query);
    window.history.replaceState(window.history.state, "", url);
    setLanguage(query, { updateUrl: false });
    return;
  }
  updateDocument(i18n.resolvedLanguage);
}

export default i18n;
