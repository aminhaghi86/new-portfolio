import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fa from "./locales/fa.json";

const supported = ["en", "fa"];

function updateDocument(language) {
  if (typeof document === "undefined") return;

  const lang = language === "en" ? "en" : "fa";

  document.documentElement.lang = lang;
  document.documentElement.dir = i18n.dir(lang);
  document.title = i18n.t("metaTitle", { lng: lang });

  document
    .querySelector('meta[property="og:locale"]')
    ?.setAttribute("content", lang === "fa" ? "fa_IR" : "en_US");

  const metadata = [
    ['meta[name="description"]', "metaDescription"],
    ['meta[property="og:title"]', "metaTitle"],
    ['meta[property="og:description"]', "metaDescription"],
  ];

  for (const [selector, key] of metadata) {
    document
      .querySelector(selector)
      ?.setAttribute("content", i18n.t(key, { lng: lang }));
  }

  try {
    localStorage.setItem("portfolio-language", lang);
  } catch {
    // Continue without browser storage.
  }

  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState(window.history.state, "", url);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: "fa",
  fallbackLng: "en",
  supportedLngs: supported,
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

i18n.on("languageChanged", updateDocument);

export function initializeBrowserLanguage() {
  const query = new URLSearchParams(window.location.search).get("lang");
  let desired = supported.includes(query) ? query : null;

  if (!desired) {
    try {
      const saved = localStorage.getItem("portfolio-language");
      if (supported.includes(saved)) desired = saved;
    } catch {
      // Continue with the default language.
    }
  }

  desired ??= "fa";

  if (desired !== i18n.resolvedLanguage) {
    void i18n.changeLanguage(desired);
  } else {
    updateDocument(desired);
  }
}

export default i18n;