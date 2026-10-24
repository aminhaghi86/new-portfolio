import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fa from "./locales/fa.json";
import { updateMetadata } from "./seo/metadata";

const supported = ["en", "fa"];

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
  lng: typeof window !== "undefined" && window.location.pathname.startsWith("/en/") ? "en" : "fa",
  fallbackLng: "en",
  supportedLngs: supported,
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

i18n.on("languageChanged", updateDocument);

export function initializeBrowserLanguage() {
  const query = new URLSearchParams(window.location.search).get("lang");
  const home = ["/", "/en", "/en/"].includes(window.location.pathname);
  if (home && supported.includes(query)) {
    const target = query === "en" ? "/en/" : "/";
    if (window.location.pathname !== target) {
      window.location.replace(target + window.location.hash);
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url);
  }
  // Each language has a stable URL. Stored preferences do not replace its content.
  updateDocument(i18n.resolvedLanguage);
}

export default i18n;