import { useTranslation } from "react-i18next";
import CaptchaField from "./CaptchaField";
import useCaptcha, { siteKey } from "./useCaptcha";
import useContactForm from "./useContactForm";

const fieldClass = "w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all";
const labelClass = "block text-sm font-medium";

export default function ContactForm({ language, dark, selectedService, onSelectService }) {
  const { t } = useTranslation();
  const services = t("serviceCards", { returnObjects: true });
  const service = services.find((item) => item.id === selectedService);

  const contact = useContactForm({
    servicePrefix: service && `${t("inquiryServicePrefix")}: ${service.title}`,
    onSent: () => onSelectService(""),
  });
  const captcha = useCaptcha({
    language,
    dark,
    onSuccess: () => contact.clearError("captchaError", "captchaRequired"),
    onError: () => contact.showError("captchaError"),
  });
  const { form, updateField, status, loading } = contact;

  const handleSubmit = async (event) => {
    event.preventDefault();
    // A Turnstile token is single-use, so issue a fresh widget after each attempt.
    if (await contact.submit(captcha.token)) captcha.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
      <fieldset disabled={loading} className="min-w-0 space-y-4" aria-label={t("formTitle")}>
        <label htmlFor="contact-service" className={labelClass}>{t("inquiryService")}</label>
        <select id="contact-service" name="service" className="contact-service" value={selectedService} onChange={(event) => onSelectService(event.target.value)}>
          <option value="">{t("servicePlaceholder")}</option>
          {services.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>

        <label htmlFor="contact-name" className={labelClass}>{t("nameLabel")}</label>
        <input id="contact-name" name="name" type="text" dir="auto" maxLength={100} required autoComplete="name" placeholder={t("namePlaceholder")} value={form.name} onChange={updateField("name")} className={fieldClass} />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-email" className={labelClass}>{t("emailLabel")}</label>
            <input id="contact-email" name="email" type="email" dir="ltr" maxLength={254} required autoComplete="email" placeholder={t("emailPlaceholder")} value={form.email} onChange={updateField("email")} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass}>{t("phoneLabel")}</label>
            <input id="contact-phone" name="phone" type="tel" dir="ltr" maxLength={50} autoComplete="tel" placeholder={t("phonePlaceholder")} value={form.phone} onChange={updateField("phone")} className={fieldClass} />
          </div>
        </div>

        <label htmlFor="contact-company" className={labelClass}>{t("companyLabel")}</label>
        <input id="contact-company" name="company" type="text" dir="auto" maxLength={150} autoComplete="organization" placeholder={t("companyPlaceholder")} value={form.company} onChange={updateField("company")} className={fieldClass} />

        <label htmlFor="contact-message" className={labelClass}>{t("messageLabel")}</label>
        <textarea id="contact-message" name="message" dir="auto" maxLength={1900} required rows={5} placeholder={t("messagePlaceholder")} value={form.message} onChange={updateField("message")} className={fieldClass} />

        <CaptchaField {...captcha.field} />

        <button type="submit" disabled={loading || !siteKey || !contact.configured} className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-2xl font-medium text-lg transition-all">
          {loading ? t("sending") : t("send")}
        </button>
      </fieldset>
      {status.messageKey && (
        <p role={status.type === "error" ? "alert" : "status"} className={status.type === "error" ? "text-sm text-red-600 dark:text-red-400" : "text-sm text-green-700 dark:text-green-400"}>
          {t(status.messageKey)}
        </p>
      )}
    </form>
  );
}
