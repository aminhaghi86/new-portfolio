
import { useTranslation } from "react-i18next";
const Collaboration = () => {
    const { t } = useTranslation();
    return (
        // {/* HOW WE WORK TOGETHER */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t("collaborationTitle")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl">
                {t("collaborationIntro")}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
                {t("collaborationItems", { returnObjects: true }).map((item, index) => (
                    <article
                        key={item.title}
                        className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10"
                    >
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            0{index + 1}
                        </span>
                        <h3 className="text-xl font-semibold mt-3 mb-3">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {item.description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default Collaboration