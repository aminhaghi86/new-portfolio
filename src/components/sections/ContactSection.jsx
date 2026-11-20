import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import ContactCard from "../contact/ContactCard";
import ContactForm from "../contact/ContactForm";

export default function ContactSection({ language, dark, selectedService, onSelectService, onOpenPrivacy }) {
  const { t } = useTranslation();
  const methods = [
    { href: "https://www.google.com/maps?q=Mashhad+Iran", icon: MapPin, tone: "orange", title: t("location"), value: t("city"), external: true },
    { href: "tel:+989304978625", icon: Phone, tone: "green", title: t("call"), value: "+989304978625", valueDir: "ltr" },
    { href: "mailto:aminhaghi@gmail.com", icon: Mail, tone: "blue", title: t("email"), value: "aminhaghi@gmail.com", valueDir: "ltr" },
    { href: "https://t.me/a_hgh86", icon: Send, tone: "blue", title: t("telegramContact"), value: "@a_hgh86", valueDir: "ltr", external: true },
  ];

  return (
    <section id="contact" className="scroll-mt-24 md:scroll-mt-28 px-6 py-20 max-w-6xl mx-auto">
      <div className="bg-zinc-100 dark:bg-white/5 rounded-3xl p-5 sm:p-8 md:p-12">
        <h2 className="text-4xl font-bold text-center mb-4">{t("contact")}</h2>
        <p className="text-center max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 mb-3">{t("contactIntro")}</p>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-10">{t("contactNext")}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {methods.map((method) => <ContactCard key={method.href} {...method} />)}
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-8">{t("formTitle")}</h3>
          <ContactForm language={language} dark={dark} selectedService={selectedService} onSelectService={onSelectService} />
          <div className="mt-6 space-y-2 text-center">
            <p className="text-xs text-zinc-500">{t("deliveryNotice")}</p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">{t("acknowledgement")}</p>
            <button type="button" onClick={onOpenPrivacy} className="text-xs text-blue-600 hover:underline">{t("readPrivacy")}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
