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

- Missing env values for form adapter
- Invalid preset key
- Broken config typing after field deletion
- Incomplete `pageCopy` overrides after changing business model
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
