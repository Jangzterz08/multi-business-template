# Marketplace Packaging Guide

Use this guide before listing on theme/template marketplaces and direct sales channels.

## Recommended release artifact

Create a ZIP containing:

- Source code
- `README.md`
- `docs/` folder
- `.env.example`
- License file (if used)

Exclude:

- `node_modules/`
- `dist/`
- local `.env`
- OS/system files

## Suggested ZIP structure

- `template/`
- `template/src/`
- `template/docs/`
- `template/package.json`
- `template/README.md`
- `template/.env.example`

## Marketplace-ready expectations

- Clear install steps
- Clear Node 22 LTS requirement in the package docs and setup flow
- Included GitHub Actions verification workflow that uses Node 22 and runs the same release gates on pull requests / main
- Fast preview run (`npm install` + `npm run dev`)
- Release scripts should use the repo's direct local tool entrypoints so typecheck/lint/test/build do not depend on slower npm bin shims
- Reusable components, no hard-coded one-off logic
- Presets that cover both service businesses and product/app use cases
- Interactive presets verified for click, touch, and keyboard input
- Parent-gated exits and fullscreen-friendly kid modes verified where included
- Interactive toy/app presets show stateful feedback clearly, including floating key bubbles, recent actions, or streak indicators where applicable
- Full-keyboard presets keep normal keys musical and move admin controls behind on-screen parent actions
- Fullscreen toy/app presets fit within one viewport without child scrolling and can ship multiple language/theme options where advertised
- If a preset advertises multiple languages, verify the header locale switch updates the whole shared site, not only the interactive section
- If a preset advertises saved preferences, verify locale/theme choices persist across a full reload and any visible form fields match the actual submission contract
- Form integration instructions without shipping private keys
- Responsive behavior verified on mobile and desktop

## Placeholder policy

- Use only text and generated icon placeholders you have rights to distribute
- Do not include copyrighted stock photos unless license permits resale
- Document where buyers should replace media assets

## Licensing notes

- Verify all dependencies are marketplace-safe
- Declare license type in listing and package
- Clarify support scope and update policy

## Pre-publish checklist

1. Confirm the clean-machine install uses Node 22 LTS (`node -v`)
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. `npm run smoke`
6. Verify all presets render correctly
7. Verify form adapter docs are accurate
8. Verify no secrets in source or docs
9. Build final ZIP and test unpack/install on clean machine

GitHub Actions:

- `.github/workflows/verify-template.yml` is the default CI gate for this template
- `.github/workflows/ai-news-content.yml` is optional and only for the bundled AI-news sheet sync workflow

## Own-site sales adjustments

- Add your purchase/support links in docs
- Include changelog and semantic version number
- Provide a support contact SLA in `docs/SUPPORT_PLAYBOOK.md`
