import { useTranslation } from "react-i18next";
import ProjectImage from "./ProjectImage";
import { casePath, demoLabelKey } from "./projectLinks";

const MAX_TECH_TAGS = 5;

export default function FeaturedProjectCard({ project, onOpen }) {
  const { t } = useTranslation();
  const fullCase = casePath(project.id);
  const hasDemo = project.demo && project.demo !== project.github;

  return (
    <article data-reveal-item className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      <ProjectImage project={project} />
      <div className="p-7 flex flex-col flex-1">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3">{t(`caseStudies.${project.id}.badge`)}</p>
        <h3 className="font-semibold text-xl mb-3">{project.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{t(`caseStudies.${project.id}.use`)}</p>
        <div className="flex flex-wrap gap-2 mb-7">
          {project.tech.slice(0, MAX_TECH_TAGS).map((tech) => (
            <span key={tech.skill} className="text-xs px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300">
              <bdi dir="ltr">{tech.skill}</bdi>
            </span>
          ))}
        </div>

        {fullCase && <a href={fullCase} className="text-sm text-blue-600 dark:text-blue-400 underline mb-4">{t("projectFullCase")}</a>}
        <div className="flex gap-4 mt-auto">
          <button type="button" onClick={() => onOpen(project.id)} className="flex-1 text-center py-3 border border-zinc-300 dark:border-white/20 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/5 transition">
            {t("projectDetails")}<span className="sr-only"> — {project.title}</span>
          </button>
          {hasDemo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition">
              {t(demoLabelKey(project))}<span className="sr-only"> — {project.title}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
