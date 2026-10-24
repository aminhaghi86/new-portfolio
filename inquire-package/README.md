# Portfolio sales enhancements — Inquire-branch

This package was designed from the **actual `aminhaghi86/new-portfolio` Inquire-branch structure** retrieved on 24 Oct 2026. It is **not pushed to GitHub**.

## Included
- Bilingual RTL/LTR, responsive three-step **multi-select quote calculator**, 8 service options, indicative cost and work-day ranges.
- A new quote CTA in both desktop and mobile header navigation.
- The quote summary can be copied, emailed, or inserted into the existing contact form. **Existing Turnstile and n8n verification remain in charge of actual submission**.
- Dibasan case study: public WordPress/WooCommerce website vs. experimental Telegram/n8n editorial console, clearly labeled.
- Five-stage **browser-only interactive** editorial demo, explicitly not connected to customer WordPress or Telegram.
- New CSS uses existing portfolio styling conventions and dark mode.

## Install (Mac or Linux)

1. Open a terminal in your local `new-portfolio` directory.
2. `git fetch origin && git switch Inquire-branch && git pull --ff-only origin Inquire-branch`
3. Unzip this package, then run `python3 /path/to/inquire-package/apply.py /path/to/new-portfolio`.
4. `npm ci && npm run lint && npm run build && npm run dev`
5. Review the UI at `http://localhost:5173/`, including Persian/English, dark mode, mobile width, quote submission and Dibasan demo.
6. If satisfied: `git add src/App.jsx src/components/Header.jsx src/components/QuoteWizard.jsx src/components/DibasanShowcase.jsx src/quoteCatalog.js src/inquiry.css && git commit -m "feat: bilingual inquiry estimator and Dibasan workflow demo" && git push origin Inquire-branch`

**Do not merge to `main` before reviewing.** Your current GitHub Actions setup deploys `main`; pushing a feature branch does not automatically provide a preview URL. For a preview, import this repository into Vercel or Netlify and enable branch preview deployments, then inspect the resulting URL.

## Pricing notes
Price figures are **editorial starting estimates in millions of tomans**, not sourced market benchmarks or binding quotes. The calculator sums the ranges and work days of selected services; it does **not** account for overlapping scope, hosting, licences, VAT, third-party subscriptions or delivery capacity. Confirm actual pricing before publishing.

## Security and integration notes
- The quote builder stores no personal information; only a draft summary can be copied into the existing contact form.
- No direct webhook calls or secret credentials are added.
- The Dibasan workflow demo is entirely local, illustrative and does not publish content.
- Existing production contact webhook and Cloudflare Turnstile remain unchanged.
- The install script checks known code anchors before writing, but **the final repository must be linted, built and browser-tested locally**.

## Rollback
`git restore src/App.jsx src/components/Header.jsx` and remove the four newly added files before committing; or revert the resulting commit after pushing.
