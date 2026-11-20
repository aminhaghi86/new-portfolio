import { useEffect, useSyncExternalStore } from "react";
import { getServerThemeSnapshot, getThemeSnapshot, setThemeMode, subscribeTheme } from "../utils/theme";

/** Theme mode (auto/light/dark), the resolved value, and document sync. */
export default function useTheme() {
  const snapshot = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [themeMode, resolved] = snapshot.split(":");
  const dark = resolved === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b0b10" : "#ffffff");
  }, [dark]);

  return { themeMode, dark, setThemeMode };
}
