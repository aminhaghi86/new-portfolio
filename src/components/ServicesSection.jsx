import { ArrowUpRight, Check, Globe, Workflow, ShoppingBag } from 'lucide-react';
import { servicePages } from '../seo/pages';
import { useTranslation } from 'react-i18next';

const icons = { website: Globe, shop: ShoppingBag, automation: Workflow };

export default function ServicesSection({ onSelectService }) {
  const { t } = useTranslation();
  return (
    <section id="services" className="portfolio-services scroll-mt-24 md:scroll-mt-28" aria-labelledby="services-title">
      <div className="section-heading"><div><p className="section-eyebrow">{t('servicesEyebrow')}</p><h2 id="services-title">{t('services')}</h2></div><p>{t('servicesIntro')}</p></div>
      <div className="service-grid">
        {t('serviceCards', { returnObjects: true }).map(service => {
          const Icon = icons[service.id];
          return (
            <article key={service.id} data-reveal-item className="service-card">
              <span className="service-icon"><Icon size={23} aria-hidden="true" /></span>
              <p className="package-kicker">{t("packageScope")}</p>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>{service.deliverables.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
              <dl className="package-facts">
                {[["pages", "packagePages"], ["training", "packageTraining"], ["support", "packageSupport"], ["extras", "packageExtras"]].map(([key, label]) => <div key={key}><dt>{t(label)}</dt><dd>{service[key]}</dd></div>)}
              </dl>
              <a href={servicePages.find(page => page.serviceId === service.id)?.path} className="service-link">{t('serviceDetails')}<ArrowUpRight size={18} aria-hidden="true" /></a>
              <a href="#contact" className="service-link" onClick={() => onSelectService(service.id)}>{t('serviceCta')}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> — {service.title}</span></a>
            </article>
          );
        })}
      </div>
      <p className="package-note" data-reveal-item>{t('packageNote')}</p>
      <details className="service-proof" data-reveal-item>
        <summary>{t('automationTitle')}</summary>
        <p>{t('automationDescription')}</p>
        <a href="#contact" onClick={() => onSelectService('automation')}>{t('similarWorkflow')}</a>
      </details>
    </section>
  );
}
