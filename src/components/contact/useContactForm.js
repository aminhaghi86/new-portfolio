import { useEffect, useRef, useState } from "react";

const EMPTY_FORM = { name: "", email: "", phone: "", company: "", message: "" };
const MESSAGE_LIMIT = 1900;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

const appendQuote = (message, quote) => [message.trim(), quote].filter(Boolean).join("\n\n");

/**
 * Contact form state and submission to the n8n webhook.
 * `servicePrefix` is prepended to the message when a service is selected.
 * `submit` resolves to true once a request was actually sent.
 */
export default function useContactForm({ servicePrefix, onSent }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ type: "", messageKey: "" });
  const [loading, setLoading] = useState(false);
  const sending = useRef(false);
  const attachedQuote = useRef("");

  // The quote wizard sends its summary through a window event.
  useEffect(() => {
    const receiveQuote = ({ detail }) => {
      if (typeof detail !== "string" || sending.current) return;
      const previousQuote = attachedQuote.current;
      const draft = previousQuote ? form.message.replace(previousQuote, "") : form.message;
      const message = appendQuote(draft, detail);
      if (message.length > MESSAGE_LIMIT) {
        setStatus({ type: "error", messageKey: "quoteTooLong" });
        return;
      }
      attachedQuote.current = detail;
      setForm((current) => ({ ...current, message }));
      setStatus({ type: "", messageKey: "" });
    };
    window.addEventListener("portfolio:quote", receiveQuote);
    return () => window.removeEventListener("portfolio:quote", receiveQuote);
  }, [form.message]);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const showError = (messageKey) => setStatus({ type: "error", messageKey });
  const clearError = (...keys) => setStatus((current) => (keys.includes(current.messageKey) ? { type: "", messageKey: "" } : current));

  const submit = async (captchaToken) => {
    if (sending.current) return false;
    const cleaned = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (!cleaned.name || !cleaned.message || !EMAIL_PATTERN.test(cleaned.email)) { showError("validation"); return false; }
    if (!webhookUrl) { showError("unconfigured"); return false; }
    if (!captchaToken) { showError("captchaRequired"); return false; }
    if (servicePrefix) cleaned.message = `${servicePrefix}\n\n${cleaned.message}`;

    sending.current = true;
    setLoading(true);
    setStatus({ type: "", messageKey: "" });
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cleaned, captcha: captchaToken, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error("Submission was not confirmed");
      setStatus({ type: "success", messageKey: "success" });
      attachedQuote.current = "";
      setForm(EMPTY_FORM);
      onSent?.();
    } catch {
      showError("failed");
    } finally {
      sending.current = false;
      setLoading(false);
    }
    return true;
  };

  return { form, updateField, status, showError, clearError, loading, submit, configured: Boolean(webhookUrl) };
}
