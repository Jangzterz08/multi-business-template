# Support Playbook

Operational guide for handling buyer support after sale.

## Support scope

Included:

- Installation and startup issues
- Preset switching guidance
- Form adapter setup troubleshooting
- Clarification of documented customization steps

Out of scope by default:

- Custom feature development
- Third-party backend debugging beyond adapter contract
- Hosting account administration

## Intake template

Ask buyer for:

1. Template version
2. Node/npm versions
3. Selected preset (`VITE_PRESET`)
4. Error message and reproduction steps
5. Relevant env setup (without sharing secret values)

## Fast triage flow

1. Reproduce with clean install
2. Confirm issue category:
   - install/tooling
   - content config
   - styling/token edits
   - form integration
3. Provide minimal fix with exact file path
4. Confirm resolution and suggest preventive check

## Known issue patterns

- Buyer is running Node 24+, the preflight guard fails fast, and they need to switch to Node 22 LTS before using Vite/Vitest commands
- GitHub Actions is still pinned to an older Node version, so `.github/workflows/verify-template.yml` or other project workflows need to be aligned to Node 22
- `npm run typecheck` passes but a Vitest file is broken, because the default typecheck now focuses on app files and test files are exercised through `npm run test` / `npm run smoke`
- Missing env values for form adapter
- Invalid preset key
- Broken config typing after field deletion
- Incomplete `pageCopy` overrides after changing business model
- Incomplete `homeExperience` config after adapting an app-style preset
- Kid mode appears stuck because the parent hold-to-exit gate was not completed
- Floating key bubbles, recent-key trails, or streak feedback appear wrong because the shared playground snapshot/output is stale after customization
- Fullscreen exited with `Esc` or a browser shortcut and the parent recovery overlay needs to restore fullscreen before play resumes
- Italian or theme toggles do not match expectations because `locales.<lang>`, `homeExperience.locales`, the header switches, or the shared playground labels were only partially customized
- Locale/theme choices do not stick after refresh because localStorage was blocked, cleared, or customized out of the shared site-preferences layer
- Phone links seem to be missing because that preset intentionally left `contact.phone` / `contact.phoneLink` blank to hide the number on shared contact surfaces
- A buyer still expects a phone field in submissions, but the shared form contract now sends only `name`, `email`, `service`, `message`, and `consent`
- CSS token typo causing visual regressions

## Recommended response SLA

- First response: within 24 hours
- Bug confirmation: within 48 hours
- Patch release target: within 3-5 business days for critical issues

## Escalation

Escalate when:

- Security-related behavior appears
- Build fails on clean baseline with documented steps
- Multiple buyers report same regression

## Buyer-facing diagnostics checklist

- Confirm they ran `npm install`
- Confirm `.env` values from `.env.example`
- Confirm route smoke test passes: `npm run smoke`
- Confirm active preset file compiles cleanly
