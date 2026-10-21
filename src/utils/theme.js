export function readThemeMode() {
  if (typeof window === "undefined") return "auto";

  try {
    const saved = localStorage.getItem("theme");
    if (["auto", "light", "dark"].includes(saved)) return saved;
  } catch {
    // Continue without browser storage.
  }

  return "auto";
}

export function resolveDark(mode) {
  if (mode === "dark") return true;
  if (mode === "light") return false;

  const hour = new Date().getHours();
  return hour < 7 || hour >= 19;
}

let mode = readThemeMode();
const listeners = new Set();
let stopListening;

function notify() {
  for (const listener of listeners) listener();
}

export function getThemeSnapshot() {
  return `${mode}:${resolveDark(mode) ? "dark" : "light"}`;
}

export function getServerThemeSnapshot() {
  return "auto:light";
}

export function setThemeMode(nextMode) {
  if (!["auto", "light", "dark"].includes(nextMode)) return;

  mode = nextMode;

  try {
    localStorage.setItem("theme", mode);
  } catch {
    // Keep the selection in memory.
  }

  notify();
}

export function subscribeTheme(listener) {
  listeners.add(listener);

  if (listeners.size === 1) {
    const onStorage = (event) => {
      if (event.key === "theme" || event.key === null) {
        mode = readThemeMode();
        notify();
      }
    };

    const intervalId = window.setInterval(notify, 30_000);

    window.addEventListener("focus", notify);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", notify);

    stopListening = () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", notify);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", notify);
    };
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      stopListening?.();
      stopListening = undefined;
    }
  };
}