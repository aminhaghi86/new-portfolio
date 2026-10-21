import { useRef } from 'react';
import { ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useHeroIntro from '../hooks/useHeroIntro';

export default function HeroSection({ personal, project, onOpenProject }) {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  useHeroIntro(rootRef);
  return (
    <section ref={rootRef} id="home" className="portfolio-hero scroll-mt-24 md:scroll-mt-28">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="section-eyebrow"><span aria-hidden="true" />{t('heroEyebrow')}</p>
          <h1>{t('heroTitle')} <span>{t('heroTitleAccent')}</span></h1>
          <p className="hero-description">{t('heroDescription')}</p>
          <div className="hero-actions">
            <a href="#contact" className="portfolio-button primary">{t('discuss')}<ArrowUpRight size={19} aria-hidden="true" /></a>
            <a href="#projects" className="portfolio-button secondary">{t('viewWork')}</a>
          </div>
          <ul className="hero-promises">
            {t('heroPrinciples', { returnObjects: true }).map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
          </ul>
        </div>
        <div className="hero-showcase">
          <div className="showcase-person">
            <img src={personal.image} alt="" width="56" height="56" />
            <div><p className="showcase-name">{personal.name}</p><p className="showcase-role">{t('personal.role')}</p></div>
          </div>
          <figure className="showcase-browser">
            <div className="browser-bar"><span className="browser-dots" aria-hidden="true"><i /><i /><i /></span><bdi dir="ltr">dibasan.com</bdi><ExternalLink size={13} aria-hidden="true" /></div>
            <button type="button" onClick={() => onOpenProject(project.id)} className="showcase-open" aria-label={t('openProject', { title: t(`projectContent.${project.id}.title`) })}>
              <img src={project.image} alt={t(`projectContent.${project.id}.title`)} width="1280" height="720" fetchPriority="high" />
            </button>
            <figcaption><div><span className="project-kind">{t(`caseStudies.${project.id}.badge`)}</span><p>{t('heroProjectCaption')}</p></div><ArrowUpRight size={21} aria-hidden="true" /></figcaption>
          </figure>
          <div className="showcase-workflow"><span>{t('heroWorkflowLabel')}</span><ol>{t('heroWorkflowSteps', { returnObjects: true }).map((step, index) => <li key={step}><span className="workflow-index" aria-hidden="true">{index + 1}</span>{step}</li>)}</ol></div>
        </div>
      </div>
    </section>
  );
}