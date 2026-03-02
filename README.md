# Multi-Business Local Service Template

Commercial-ready website template built with React + Vite + TypeScript.

## What this package includes

- One shared codebase
- Four business presets: `restaurant` (Italian), `dental`, `salon`, `gym`
- Four routes for every preset: `/`, `/services`, `/about`, `/contact`
- Centralized preset config files for content + theming
- Pluggable contact form adapters: Formspree, EmailJS, Custom endpoint
- Marketplace-focused docs and release checklists

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Set preset in `.env`:

```env
VITE_PRESET=restaurant
```

Valid values: `restaurant`, `dental`, `salon`, `gym`

## Scripts

- `npm run dev` local development
- `npm run build` type-check + production build
- `npm run preview` preview built app
- `npm run lint` lint TypeScript/React files
- `npm run typecheck` TypeScript checks only
- `npm run test` run full test suite
- `npm run smoke` run route smoke tests only

## Environment variables

See `.env.example`:

- `VITE_PRESET`: active preset key
- `VITE_FORMSPREE_ENDPOINT`: Formspree endpoint URL
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template ID
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key
- `VITE_CUSTOM_FORM_ENDPOINT`: Custom backend endpoint

## Main project structure

- `src/app/`: app bootstrap, context, routes, shell
- `src/components/`: reusable UI blocks
- `src/pages/`: route-level pages
- `src/presets/`: business content + design tokens
- `src/forms/`: form adapters + validation + submit orchestration
- `src/theme/`: global token and style system
- `src/types/`: shared contracts
- `docs/`: long-form product, customization, and release instructions

## Switch business preset

1. Update `VITE_PRESET` in `.env`
2. Restart dev server if needed
3. Verify all 4 routes render expected content

## Add a new business preset

1. Copy one preset folder under `src/presets/`
2. Update `config.ts` fields and `designTokens`
3. Register new preset in `src/presets/index.ts`
4. Run `npm run smoke` and confirm all route tests pass

## Form provider selection

Form provider is selected from `preset.formProvider` and can read credentials/endpoints from environment variables.

See [docs/FORM_PROVIDERS.md](docs/FORM_PROVIDERS.md) for setup details.

## Packaging for sale

Use [docs/MARKETPLACE_PACKAGING.md](docs/MARKETPLACE_PACKAGING.md) and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before publishing.
