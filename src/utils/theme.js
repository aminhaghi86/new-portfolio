export function readThemeMode() {
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