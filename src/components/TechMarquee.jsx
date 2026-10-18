import { useTranslation } from "react-i18next";
import {
  SiWordpress, SiWoocommerce, SiN8N, SiReact, SiTelegram,
  SiVite, SiTailwindcss, SiNodedotjs, SiCloudflare,
} from "react-icons/si";

const techs = [
  { name: "WordPress", Icon: SiWordpress, color: "#21759B" },
  { name: "WooCommerce", Icon: SiWoocommerce, color: "#96588A" },
  { name: "n8n", Icon: SiN8N, color: "#EA4B71" },
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Telegram Bot", Icon: SiTelegram, color: "#26A5E4" },
  { name: "Vite", Icon: SiVite, color: "#646CFF" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Cloudflare", Icon: SiCloudflare, color: "#F38020" },
];

// هر گروه دو بار لیست را دارد تا روی مانیتورهای عریض هم فاصلهٔ خالی دیده نشود
const loop = [...techs, ...techs];

export default function TechMarquee() {
  const { t } = useTranslation();
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="tech-marquee border-y border-zinc-200 dark:border-white/10 py-10"
    >
      <p id="stack-title" className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8 px-6">
        {t("marqueeLabel")}
      </p>

      {/* بخش تزئینی؛ برای صفحه‌خوان‌ها فقط لیست ساده می‌ماند */}
      <div className="marquee" dir="ltr" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <ul key={group} className="marquee-group">
              {loop.map(({ name, Icon, color }, index) => (
                <li key={`${name}-${index}`} className="marquee-item" style={{ "--brand": color }}>
                  <Icon size={24} />
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {techs.map(({ name }) => <li key={name}>{name}</li>)}
      </ul>
    </section>
  );
}