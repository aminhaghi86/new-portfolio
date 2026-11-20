import { useTranslation } from "react-i18next";
import FeaturedProjectCard from "../projects/FeaturedProjectCard";
import ProjectCard from "../projects/ProjectCard";

const FEATURED_PROJECT_IDS = [0, 8, 7];

export default function ProjectsSection({ projects, onOpenProject }) {
  const { t } = useTranslation();
  const featured = FEATURED_PROJECT_IDS.map((id) => projects.find((project) => project.id === id)).filter(Boolean);
  const others = projects.filter((project) => !FEATURED_PROJECT_IDS.includes(project.id));

  return (
    <section id="projects" data-reveal className="scroll-mt-24 md:scroll-mt-28 px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">{t("projects")}</h2>
      <p className="text-center text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-12">{t("projectsIntro")}</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((project) => <FeaturedProjectCard key={project.id} project={project} onOpen={onOpenProject} />)}
      </div>

      <details className="mt-10 rounded-3xl border border-zinc-200 dark:border-white/10 p-6">
        <summary className="cursor-pointer font-semibold text-lg">{t("moreProjects")}</summary>
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {others.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpenProject} />)}
        </div>
      </details>
    </section>
  );
}
