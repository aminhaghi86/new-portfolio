import { useTranslation } from "react-i18next";
import { servicePages } from "../seo/pages";

export default function SiteFooter({ language, onOpenPrivacy }) {
  const { t } = useTranslation();
  return (
    <footer className="py-12 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-white/10 space-y-4">
      <nav className="seo-service-links" aria-label={t("serviceDetails")}>
        {servicePages.map((page) => <a href={page.path} key={page.path}>{language === "fa" ? page.heading : page.title}</a>)}
      </nav>
      <p>{t("copyright", { year: new Date().getFullYear() })}</p>
      <div className="flex justify-center gap-6 text-xs">
        <button type="button" onClick={onOpenPrivacy} className="hover:text-blue-600 transition">{t("privacy")}</button>
        <a href="mailto:aminhaghi@gmail.com" className="hover:text-blue-600 transition">{t("footerContact")}</a>
      </div>
    </footer>
  );
}
