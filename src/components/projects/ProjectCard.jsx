import { useTranslation } from "react-i18next";
import ProjectImage from "./ProjectImage";
import { casePath, demoLabelKey } from "./projectLinks";

export default function ProjectCard({ project, onOpen }) {
  const { t } = useTranslation();
  const fullCase = casePath(project.id);
  const hasGallery = project.gallery?.length > 0;
  const hasGithub = project.github && project.github !== "#";
  const forTitle = <span className="sr-only"> — {project.title}</span>;

  return (
    <article data-reveal-item data-tilt className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <ProjectImage project={project} />
      <div className="p-6 flex flex-col flex-1">
        {hasGallery && <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-3">{t(`caseStudies.${project.id}.badge`)}</p>}
        <h3 className="font-semibold text-xl mb-3">{project.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">{project.desc}</p>
        <div className="flex flex-wrap items-center gap-5 mt-auto text-sm text-blue-600 dark:text-blue-400">
          {fullCase && <a href={fullCase}>{t("projectFullCase")}</a>}
          {hasGallery && <button type="button" className="portfolio-button secondary" onClick={() => onOpen(project.id)}>{t("projectDetails")}{forTitle}</button>}
          {hasGithub && <a href={project.github} target="_blank" rel="noopener noreferrer">{t("github")}{forTitle}</a>}
          {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">{t(demoLabelKey(project))}{forTitle}</a>}
        </div>
      </div>
    </article>
  );
}
