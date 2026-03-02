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
- Fast preview run (`npm install` + `npm run dev`)
- Reusable components, no hard-coded one-off logic
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

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm run smoke`
5. Verify all presets render correctly
6. Verify form adapter docs are accurate
7. Verify no secrets in source or docs
8. Build final ZIP and test unpack/install on clean machine

## Own-site sales adjustments

- Add your purchase/support links in docs
- Include changelog and semantic version number
- Provide a support contact SLA in `docs/SUPPORT_PLAYBOOK.md`
