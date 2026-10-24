#!/usr/bin/env python3
"""Apply inquiry package to a checked-out Inquire-branch repository."""
from pathlib import Path
import json, shutil, sys

source = Path(__file__).resolve().parent
repo = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
if not (repo / 'src/App.jsx').exists() or not (repo / 'src/components/Header.jsx').exists():
    raise SystemExit('ERROR: run inside the new-portfolio project root or pass its path.')

def replace_once(path, old, new):
    content = path.read_text(encoding='utf-8')
    if old not in content:
        if new in content:
            print(f'Already patched: {path.name}')
            return
        raise SystemExit(f'ERROR: expected anchor missing in {path}. No further changes made.')
    path.write_text(content.replace(old, new, 1), encoding='utf-8')

app = repo / 'src/App.jsx'
header = repo / 'src/components/Header.jsx'
# Verify all critical anchors before writing any files.
app_text = app.read_text(encoding='utf-8')
header_text = header.read_text(encoding='utf-8')
checks = [(app_text, 'import ServicesSection from "./components/ServicesSection";'), (app_text, '        {/* FEATURED PROJECTS */}'), (app_text, '        <div data-reveal>\n\n          <Testimonials />'), (header_text, '                <nav aria-label={t("mainNav")}'), (header_text, '                    {navigation.map((item) => (')]
for content, anchor in checks:
    if anchor not in content:
        raise SystemExit(f'ERROR: project structure differs. Missing: {anchor[:65]}')

for relative in ['src/quoteCatalog.js', 'src/inquiry.css', 'src/components/QuoteWizard.jsx', 'src/components/DibasanShowcase.jsx']:
    destination = repo / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source / relative, destination)

replace_once(app, 'import ServicesSection from "./components/ServicesSection";', 'import ServicesSection from "./components/ServicesSection";\nimport QuoteWizard from "./components/QuoteWizard";\nimport DibasanShowcase from "./components/DibasanShowcase";\nimport "./inquiry.css";')
replace_once(app, '        {/* FEATURED PROJECTS */}', '        <QuoteWizard />\n        {/* FEATURED PROJECTS */}')
replace_once(app, '        <div data-reveal>\n\n          <Testimonials />', '        <DibasanShowcase />\n        <div data-reveal>\n\n          <Testimonials />')
# Pass quote draft to the EXISTING validated Turnstile/n8n contact form; do not create a bypass endpoint.
replace_once(app, '  const [selectedService, setSelectedService] = useState("");', '  const [selectedService, setSelectedService] = useState("");\n  useEffect(() => {\n    const receiveQuote = (event) => setForm(current => ({ ...current, message: event.detail.slice(0, 1900) }));\n    window.addEventListener("portfolio:quote", receiveQuote);\n    return () => window.removeEventListener("portfolio:quote", receiveQuote);\n  }, []);')
# Desktop and mobile links added independently.
replace_once(header, '                </nav>\n\n                <div className="flex items-center gap-2">', '                    <a href="#inquiry" className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700">{language === "fa" ? "استعلام قیمت" : "Get a quote"}</a>\n                </nav>\n\n                <div className="flex items-center gap-2">')
replace_once(header, '                    {navigation.map((item) => (\n                        <a\n', '                    <a href="#inquiry" onClick={() => setMenuOpen(false)} className="py-3.5 border-t border-zinc-200 dark:border-white/10 font-semibold text-blue-600 dark:text-blue-400">{language === "fa" ? "استعلام قیمت" : "Get a quote"}</a>\n                    {navigation.map((item) => (\n                        <a\n')
print('SUCCESS: Inquiry wizard, Dibasan demo, styles and header links installed.')
