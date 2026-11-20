import { ExternalLink, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import cv from "/cv.pdf";
import SocialLinks from "../SocialLinks";

const cvButtonClass = "group mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-blue-400 dark:hover:bg-zinc-800";
const textClass = "text-lg leading-relaxed text-zinc-600 dark:text-zinc-400";
const detailClass = "text-sm leading-relaxed text-zinc-600 dark:text-zinc-400";

export default function AboutSection({ personal }) {
  const { t } = useTranslation();
  return (
    <section id="about" data-reveal className="scroll-mt-24 md:scroll-mt-28 px-6 py-20 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">{t("about")}</h2>
          <p className={`${textClass} mb-6`}>{personal.bio}</p>
          <p className={textClass}>{personal.about}</p>

          <details className="about-details mt-6">
            <summary>{t("aboutDetails")}</summary>
            <p className={`mt-4 ${detailClass}`}>{t("skillsSummary")}</p>
            <p className={`mt-3 ${detailClass}`}>{t("experienceSummary")}</p>
          </details>

          <a href={cv} target="_blank" rel="noopener noreferrer" className={cvButtonClass}>
            <FileText size={19} aria-hidden="true" className="text-blue-600 dark:text-blue-400" />
            <span>{t("cv")}</span>
            <ExternalLink size={15} aria-hidden="true" className="text-zinc-400 transition-transform group-hover:-translate-y-0.5" />
          </a>

          <SocialLinks />
        </div>

        <div className="flex justify-center md:justify-end">
          <img src={personal.image} alt={personal.name} className="w-full max-w-80 aspect-square rounded-3xl object-cover shadow-2xl border-4 border-white dark:border-zinc-800" />
        </div>
      </div>
    </section>
  );
}
