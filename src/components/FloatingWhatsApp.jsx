import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "989304978625";

export default function FloatingWhatsApp() {
  const { t } = useTranslation();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("whatsappMessage"))}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("floatingContact")}
      className="fixed bottom-6 start-6 z-50 flex items-center justify-center w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-2xl transition-all"
    >
      <FaWhatsapp size={28} aria-hidden="true" />
    </a>
  );
}
