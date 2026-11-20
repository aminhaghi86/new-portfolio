import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  return (
    <section data-reveal className="px-6 pb-20 max-w-4xl mx-auto" aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-3xl font-bold mb-8">{t("faqTitle")}</h2>
      <div className="space-y-4">
        {t("faqItems", { returnObjects: true }).map((item) => (
          <details key={item.question} className="border border-zinc-200 dark:border-white/10 rounded-2xl p-6">
            <summary className="cursor-pointer font-semibold">{item.question}</summary>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
