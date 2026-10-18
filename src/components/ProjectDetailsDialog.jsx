import { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import ProjectGallery from './ProjectGallery';
import { useTranslation } from 'react-i18next';

export default function ProjectDetailsDialog({ project, onClose }) {
  const ref = useRef(null);
  const { t } = useTranslation();
  useEffect(() => {
    const dialog = ref.current;
    if (!project) { if (dialog.open) dialog.close(); return; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [project]);
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="project-detail-title" className="project-dialog">
      {project && <>
        <div className="project-dialog-heading"><div><p className="project-kind">{t(`caseStudies.${project.id}.badge`)}</p><h2 id="project-detail-title">{project.title}</h2></div><button autoFocus type="button" onClick={() => ref.current.close()} aria-label={t('closeProject')} className="dialog-close"><X size={22} aria-hidden="true" /></button></div>
        {project.gallery?.length ? <ProjectGallery key={project.id} images={project.gallery} title={project.title} /> : <img className="project-detail-image" src={project.image} alt={project.title} width="1280" height="720" />}
        <dl className="project-detail-facts">
          {[["use", "caseUse"], ["work", "caseWork"], ["status", "caseStatus"]].map(([key, label]) => <div key={key}><dt>{t(label)}</dt><dd>{t(`caseStudies.${project.id}.${key}`)}</dd></div>)}
          {t(`caseStudies.${project.id}.period`, { defaultValue: "" }) && <div><dt>{t('casePeriod')}</dt><dd>{t(`caseStudies.${project.id}.period`)}</dd></div>}
          {t(`caseStudies.${project.id}.role`, { defaultValue: "" }) && <div><dt>{t('caseRole')}</dt><dd>{t(`caseStudies.${project.id}.role`)}</dd></div>}
          {t(`caseStudies.${project.id}.outcome`, { defaultValue: "" }) && <div><dt>{t('caseOutcome')}</dt><dd>{t(`caseStudies.${project.id}.outcome`)}</dd></div>}
        </dl>
        {Array.isArray(t(`caseStudies.${project.id}.capabilities`, { returnObjects: true, defaultValue: null })) && <div className="case-capabilities"><h3>{t('caseCapabilities')}</h3><ul>{t(`caseStudies.${project.id}.capabilities`, { returnObjects: true }).map(item => <li key={item}>{item}</li>)}</ul></div>}
        <div className="project-dialog-links">
          {project.demo && <a className="portfolio-button primary" href={project.demo} target="_blank" rel="noopener noreferrer">{t(project.demoLabel === 'Watch Demo' ? 'watchDemo' : 'liveDemo')}<ExternalLink size={17} aria-hidden="true" /></a>}
          {project.github && project.github !== '#' && <a className="portfolio-button secondary" href={project.github} target="_blank" rel="noopener noreferrer"><FaGithub size={17} aria-hidden="true" />{t('github')}</a>}
          <a href="#contact" className="project-similar" onClick={() => ref.current.close()}>{t('similarProject')}</a>
        </div>
      </>}
    </dialog>
  );
}
