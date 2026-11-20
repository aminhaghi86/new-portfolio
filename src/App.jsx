import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import ScrollProgress from "./components/ScrollProgress";
import HeroSection from "./components/HeroSection";
import TechMarquee from "./components/TechMarquee";
import ServicesSection from "./components/ServicesSection";
import QuoteWizard from "./components/QuoteWizard";
import ProjectsSection from "./components/sections/ProjectsSection";
import DibasanShowcase from "./components/DibasanShowcase";
import Testimonials from "./components/Testimonials";
import Collaboration from "./components/Collaboration";
import AboutSection from "./components/sections/AboutSection";
import FaqSection from "./components/sections/FaqSection";
import ContactSection from "./components/sections/ContactSection";
import SiteFooter from "./components/SiteFooter";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ProjectDetailsDialog from "./components/ProjectDetailsDialog";
import PrivacyDialog from "./components/PrivacyDialog";
import useLanguage from "./hooks/useLanguage";
import useTheme from "./hooks/useTheme";
import usePortfolioContent from "./hooks/usePortfolioContent";
import useScrollReveal from "./hooks/useScrollReveal";
import useLenis from "./hooks/useLenis";
import useProjectCards from "./hooks/useProjectCards";
import "./inquiry.css";
import "./portfolio.css";
import "./seo/seo.css";

const HERO_PROJECT_ID = 0;

export default function App() {
  const { t } = useTranslation();
  const mainRef = useRef(null);
  const { language, toggleLanguage } = useLanguage();
  const { themeMode, dark, setThemeMode } = useTheme();
  const { personal, projects } = usePortfolioContent();

  const [selectedService, setSelectedService] = useState("");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const openPrivacy = () => setPrivacyOpen(true);

  useLenis();
  useScrollReveal(mainRef, [language]);
  useProjectCards(mainRef, [language]);

  const findProject = (id) => projects.find((project) => project.id === id) ?? null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b10] text-zinc-900 dark:text-white transition-colors duration-300">
      <ScrollProgress />
      <a href="#main-content" className="skip-link">{t("skipContent")}</a>
      <Header language={language} themeMode={themeMode} onThemeChange={setThemeMode} onLanguageToggle={toggleLanguage} />

      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <div data-reveal="exit-only">
          <HeroSection personal={personal} project={findProject(HERO_PROJECT_ID)} onOpenProject={setActiveProjectId} />
        </div>
        <div data-reveal><TechMarquee /></div>
        <div data-reveal><ServicesSection onSelectService={setSelectedService} /></div>
        <QuoteWizard />
        <ProjectsSection projects={projects} onOpenProject={setActiveProjectId} />
        <DibasanShowcase />
        <div data-reveal><Testimonials /></div>
        <div data-reveal><Collaboration /></div>
        <AboutSection personal={personal} />
        <FaqSection />
        <ContactSection
          language={language}
          dark={dark}
          selectedService={selectedService}
          onSelectService={setSelectedService}
          onOpenPrivacy={openPrivacy}
        />
      </main>

      <FloatingWhatsApp />
      <ProjectDetailsDialog project={findProject(activeProjectId)} onClose={() => setActiveProjectId(null)} />
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <SiteFooter language={language} onOpenPrivacy={openPrivacy} />
    </div>
  );
}
