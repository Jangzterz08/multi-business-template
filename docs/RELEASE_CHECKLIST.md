# Release Checklist

Use this checklist for every version.

## Versioning

- [ ] Update version in `package.json`
- [ ] Update changelog (if present)
- [ ] Confirm release date and summary notes

## Code quality gates

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run smoke`

## Preset QA matrix

For each preset (`education`, `restaurant`, `dental`, `salon`, `gym`):

- [ ] Home page loads and CTA links are correct
- [ ] Services page cards match config
- [ ] About page content and values list render
- [ ] Contact page form and contact details render
- [ ] Theme colors/fonts/radii update from design tokens

## Form adapter QA

- [ ] Positive submit path for active adapter
- [ ] Validation errors shown for invalid inputs
- [ ] Unconfigured provider shows graceful error message

## Accessibility and responsiveness

- [ ] Heading order is logical
- [ ] Focus styles visible on interactive controls
- [ ] Color contrast is acceptable
- [ ] Mobile layout tested (small phones)
- [ ] Tablet and desktop layout tested

## Documentation sync

- [ ] `README.md` scripts and setup commands are current
- [ ] `docs/CUSTOMIZATION.md` matches current config shape
- [ ] `docs/FORM_PROVIDERS.md` matches current adapter behavior
- [ ] `docs/MARKETPLACE_PACKAGING.md` reflects packaging flow
- [ ] `AGENTS.md` reflects current project conventions

## Artifact checks

- [ ] ZIP package excludes secrets and build artifacts
- [ ] `.env.example` is complete and safe
- [ ] No private credentials in Git history/diff
