import { ArrowUpRight, Check, Globe, Workflow, PanelsTopLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const icons = { website: Globe, application: PanelsTopLeft, automation: Workflow };

export default function ServicesSection({ onSelectService }) {
  const { t } = useTranslation();
  return (
    <section id="services" className="portfolio-services scroll-mt-40 md:scroll-mt-28" aria-labelledby="services-title">
      <div className="section-heading"><div><p className="section-eyebrow">{t('servicesEyebrow')}</p><h2 id="services-title">{t('services')}</h2></div><p>{t('servicesIntro')}</p></div>
      <div className="service-grid">
        {t('serviceCards', { returnObjects: true }).map(service => {
          const Icon = icons[service.id];
          return (
            <article key={service.id} className="service-card">
              <span className="service-icon"><Icon size={23} aria-hidden="true" /></span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>{service.deliverables.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
              <a href="#contact" className="service-link" onClick={() => onSelectService(service.id)}>{t('serviceCta')}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> — {service.title}</span></a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
