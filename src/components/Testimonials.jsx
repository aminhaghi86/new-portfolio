import React from 'react'
import { useTranslation } from "react-i18next";
const Testimonials = () => {
      const { t, i18n } = useTranslation();
  return (
// {/* TESTIMONIALS */}
<section className="px-6 py-20 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10">
  <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
    {t("testimonialsTitle")}
  </h2>
  <p className="text-center text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
    {t("testimonialsIntro")}
  </p>

  <div className="max-w-3xl mx-auto">
    <figure className="p-8 md:p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10">
      <blockquote className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
        “{t("testimonialDibasan.quote")}”
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-4">
        <div>
          <p className="font-semibold">{t("testimonialDibasan.author")}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("testimonialDibasan.role")}
          </p>
        </div>
      </figcaption>
    </figure>
  </div>
</section>
  )
}

export default Testimonials
