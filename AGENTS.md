# AGENTS Guide

Project-level instructions for future AI-assisted edits.

## Goal

Maintain this repository as a sellable multi-business template with predictable behavior across presets.

## Architecture rules

- Keep one shared component/page system for all presets.
- Do not fork component logic per business unless absolutely required.
- Route contract is fixed: `/`, `/services`, `/about`, `/contact`.
- Preset-specific differences should come from `src/presets/*/config.ts` and `designTokens`.

## Required typing contracts

- `PresetConfig`: `src/types/preset.ts`
- Form contracts: `src/types/forms.ts`
- Adapter factory: `src/forms/createFormAdapter.ts`

If changing these interfaces, update all docs and smoke tests in the same change.

## Styling conventions

- Use CSS Modules for component/page styles.
- Keep global variables in `src/theme/tokens.css`.
- Prefer token usage over hard-coded colors/spacing.
- Preserve reduced-motion behavior.

## Form behavior rules

- Validation belongs in `src/forms/validation.ts`.
- Submission transport must stay adapter-based.
- Never commit real API secrets.
- Keep adapter error messages user-readable.

## Testing gates

Minimum required before release:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run build`
5. `npm run smoke`

## Adding a preset

1. Add `src/presets/<new>/config.ts`
2. Register in `src/presets/index.ts`
3. Ensure all required `PresetConfig` fields are present
4. Verify all route smoke tests pass for the new preset
5. Update docs where preset keys are listed

## Documentation sync policy

When code behavior changes, update relevant docs in same commit:

- `README.md`
- `docs/CUSTOMIZATION.md`
- `docs/FORM_PROVIDERS.md`
- `docs/MARKETPLACE_PACKAGING.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/SUPPORT_PLAYBOOK.md`

## Do not

- Do not introduce one-off hardcoded copy in shared components.
- Do not add backend server code in this template repository.
- Do not remove route smoke tests.
- Do not store customer/client secrets in source control.
