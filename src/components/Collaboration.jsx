import { useTranslation } from "react-i18next";

export default function Collaboration() {
  const { t } = useTranslation();
  return (
    <section id="process" className="px-6 py-16 max-w-6xl mx-auto border-t border-zinc-200 dark:border-white/10" aria-labelledby="process-title">
      <h2 id="process-title" className="text-3xl sm:text-4xl font-bold mb-4">{t("processTitle")}</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">{t("processIntro")}</p>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {t("processSteps", { returnObjects: true }).map((step, index) => (
          <li key={step.title} data-reveal-item className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900">
            <span aria-hidden="true" className="text-blue-600 dark:text-blue-400 text-sm">0{index + 1}</span>
            <h3 className="text-xl font-semibold mt-3 mb-3">{step.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{step.description}</p>
          </li>
        ))}
      </ol>
      <div className="handover-panel mt-8" data-reveal-item>
        <h3>{t("handoverTitle")}</h3>
        <dl>{t("handoverItems", { returnObjects: true }).map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl>
      </div>
    </section>
  );
}
