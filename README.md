# Amin Haghi — Web Development & Automation

Bilingual portfolio built with React, Vite, Tailwind CSS, react-i18next.

## Development

Use Node.js 22.12 or later on the Node 22 line, or a newer supported release.

```sh
npm ci
npm run dev
```

Persian is the default for new visitors. Open `/?lang=fa` or `/?lang=en` to choose explicitly. Language and theme preferences are stored in the browser.

## Contact form

Copy `.env.example` to `.env.local` and supply the public Turnstile site key and n8n webhook URL. The form is disabled when configuration is absent; direct contact links remain available.

Vite embeds VITE_* values in the browser bundle during the build. Never put a Turnstile secret key or Telegram bot token in these values. Rebuild after changing environment variables. Configure values independently in Vercel, GitHub Actions, and Docker build arguments if using Docker.

The webhook receives JSON fields: name, email, phone, company, message, captcha and submittedAt. The frontend requires an HTTP success response containing JSON `{ "ok": true }` to show success. The backend must independently validate input and the Turnstile token and handle abuse controls. The backend implementation is outside this repository.

## Verification and deployment

```sh
npm run lint
npm run build
npm run preview
```

GitHub Actions installs, lints and builds before copying dist to the existing server destination on pushes to main. The separate quality workflow runs lint and build for improve/** branches and pull requests to main without deployment credentials. Production deployments are serialized to avoid overlapping copies. Vercel Git deployments are configured separately. This workflow does not configure Vercel or domain redirects.

## Content

- src/locales/fa.json and en.json: interface and project descriptions.
- src/data.json: project links, images and technical metadata.
- src/App.jsx: page layout and featured project IDs.
- public/: images, CV, social preview, robots and sitemap.

Examples include staging and technical work. Describe status and personal contribution accurately. Publish client names, testimonials or commercial metrics only with established facts and permission.

## Primary domain

This revision proposes https://www.haghiweb.ir/ as the primary portfolio origin. Canonical, Open Graph and sitemap URLs use it. If another domain is chosen, update index.html, public/robots.txt, public/sitemap.xml and the social preview before publishing.

Redirecting secondary domains is a separate hosting task. Preserve paths and language query parameters. After deployment, check both languages, themes, metadata and images, then test a real inquiry through the configured backend.

## Contact CORS preflight check

```sh
npm run check:contact-cors -- https://your-n8n-host/webhook/hire-me
```

This sends OPTIONS only and checks that both current www portfolio domains are explicitly allowed to POST JSON. It does not submit an inquiry or confirm Telegram delivery. Adapt the origins in scripts/check-contact-cors.mjs if the secondary domain is retired. The webhook must return compatible CORS headers on both preflight and actual responses.


## Portfolio experience

The landing page targets businesses in Iran and preserves an English version. HeroSection and ServicesSection present the work and services; ProjectDetailsDialog opens accessible project previews with Escape/close controls. Service links select an optional inquiry category. On submission, the category is included as a text prefix in the existing message field so the webhook schema stays unchanged. It is cleared only after confirmed success.

Vazirmatn is served locally from public/fonts. Its SIL Open Font License is included alongside the unmodified font. No external font service is needed. See https://github.com/rastikerdar/vazirmatn for the original font project.


## German learning case study

Featured work includes a personal German learning application in local development, explicitly marked pre-launch. Its five screenshots are real application captures cropped to remove browser and desktop chrome and compressed to WebP. No public demo, customer results, learner counts or verified live-payment claims are added. Some UI statistics in the development screenshots are demonstration values.

Gallery captions and case-study text live in both locale files; asset metadata is in src/data.json. The screenshots do not publish the application's private source code.
