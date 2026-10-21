import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { readThemeMode, resolveDark } from './utils/theme'
import './index.css'
import App from './App.jsx'
const initialDark = resolveDark(readThemeMode());

document.documentElement.classList.toggle('dark', initialDark);
document.documentElement.style.colorScheme =
  initialDark ? 'dark' : 'light';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
