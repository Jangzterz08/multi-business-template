# Release Checklist

Use this checklist for every version.

## Versioning

- [ ] Update version in `package.json`
- [ ] Update changelog (if present)
- [ ] Confirm release date and summary notes
- [ ] Confirm the release shell is using Node 22 LTS (`node -v`)

## Code quality gates

- [ ] GitHub Actions `Verify Template` workflow passes on Node 22
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run smoke`

`npm run typecheck` covers app files. Test files are exercised through `npm run test` and `npm run smoke`.

## Preset QA matrix

For each preset (`education`, `restaurant`, `dental`, `salon`, `gym`):

- [ ] Home page loads and CTA links are correct
- [ ] Interactive home section works for presets that define `homeExperience`
- [ ] Kid mode / parent exit flow works for presets that enable immersive play behavior
- [ ] Interactive feedback, floating key bubbles, and recent-action trails match visible behavior for app-style presets
- [ ] Fullscreen loss in kid mode shows the parent recovery lock instead of exposing the app shell
- [ ] Fullscreen play fits within a single viewport with no child scrolling and the selected locale/theme stays active
- [ ] Any advertised locale switch updates nav labels, route headings, cards, form copy, and submission/validation messaging across the whole site
- [ ] Locale/theme choices persist after a full page reload where that behavior is advertised
- [ ] Services page cards match config
- [ ] About page content and values list render
- [ ] Contact page form and contact details render
- [ ] Theme colors/fonts/radii update from design tokens

## Form adapter QA

- [ ] Positive submit path for active adapter
- [ ] Validation errors shown for invalid inputs
- [ ] Validation expectations match the current shared fields (`name`, `email`, `service`, `message`, `consent`)
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
