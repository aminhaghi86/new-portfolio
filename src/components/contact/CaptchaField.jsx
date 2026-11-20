import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslation } from "react-i18next";
import { siteKey } from "./useCaptcha";

/** Cloudflare Turnstile widget; props come from `useCaptcha().field`. */
export default function CaptchaField({ containerRef, widgetKey, size, language, dark, onSuccess, onExpire, onError }) {
  const { t } = useTranslation();
  return (
    <div ref={containerRef} className="flex justify-center my-2 overflow-x-auto" style={{ minHeight: size === "compact" ? 140 : 65 }}>
      {siteKey ? (
        <Turnstile
          key={widgetKey}
          siteKey={siteKey}
          onSuccess={onSuccess}
          onExpire={onExpire}
          onError={onError}
          options={{ theme: dark ? "dark" : "light", language, size }}
        />
      ) : (
        <p className="text-sm text-red-600 dark:text-red-400">{t("formUnavailable")}</p>
      )}
    </div>
  );
}
