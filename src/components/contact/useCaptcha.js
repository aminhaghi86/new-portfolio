import { useEffect, useRef, useState } from "react";

export const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

/**
 * Turnstile state. The widget re-renders when language, theme or width class
 * changes (or after `reset`), and a token is only valid for the widget
 * instance that issued it, so a stale token is never submitted.
 */
export default function useCaptcha({ language, dark, onSuccess, onError }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState("compact");
  const [resetCount, setResetCount] = useState(0);
  const [issued, setIssued] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect.width < 300 ? "compact" : "flexible"));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const widgetKey = `${resetCount}-${language}-${dark}-${size}`;

  return {
    token: issued?.key === widgetKey ? issued.value : null,
    reset: () => setResetCount((count) => count + 1),
    field: {
      containerRef, widgetKey, size, language, dark,
      onSuccess: (value) => { setIssued({ key: widgetKey, value }); onSuccess?.(); },
      onExpire: () => setIssued(null),
      onError: () => { setIssued(null); onError?.(); },
    },
  };
}
