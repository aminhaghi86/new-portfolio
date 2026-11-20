import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const linkClass = "underline";

export default function PrivacyDialog({ open, onClose }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="privacy-title" className="m-auto w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white p-8 shadow-2xl backdrop:bg-black/60">
      <div className="flex justify-between items-center gap-4 mb-6">
        <h2 id="privacy-title" className="text-2xl font-bold">{t("privacyTitle")}</h2>
        <button type="button" autoFocus onClick={onClose} aria-label={t("closePrivacy")} className="p-2 text-zinc-500 hover:text-red-500 text-xl">✕</button>
      </div>
      <div className="space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
        {["privacyOperator", "privacyData", "privacySecurity", "privacyStorage", "privacyPreferences"].map((key) => <p key={key}>{t(key)}</p>)}
        <p>
          {t("privacyDeletion")}{" "}
          <a href="mailto:aminhaghi@gmail.com" className="text-blue-600 dark:text-blue-400 underline"><bdi dir="ltr">aminhaghi@gmail.com</bdi></a>
          {t("privacySensitive")}
        </p>
        <p>
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className={linkClass}>{t("cloudflarePrivacy")}</a>
          {" · "}
          <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>{t("telegramPrivacy")}</a>
        </p>
      </div>
    </dialog>
  );
}
