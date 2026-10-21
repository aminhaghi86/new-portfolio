import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { readThemeMode, resolveDark } from "./utils/theme";
import "./index.css";
import App from "./App.jsx";

const initialDark = resolveDark(readThemeMode());

document.documentElement.classList.toggle("dark", initialDark);
document.documentElement.style.colorScheme =
  initialDark ? "dark" : "light";

const container = document.getElementById("root");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}