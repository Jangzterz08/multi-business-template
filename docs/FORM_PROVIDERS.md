# Form Providers

Contact form submissions run through a provider adapter selected in each preset config.

Field labels, placeholders, and submit button text can be customized from `preset.pageCopy.form`.

## Supported adapters

- `formspree`
- `emailjs`
- `custom`

Selection is configured in `preset.formProvider`.

## 1) Formspree

Preset example:

```ts
formProvider: {
  type: 'formspree'
}
```

Environment:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

## 2) EmailJS

Preset example:

```ts
formProvider: {
  type: 'emailjs'
}
```

Environment:

```env
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=public_xxx
```

## 3) Custom endpoint

Preset example:

```ts
formProvider: {
  type: 'custom'
}
```

Environment:

```env
VITE_CUSTOM_FORM_ENDPOINT=https://api.example.com/leads
```

Optional preset headers:

```ts
formProvider: {
  type: 'custom',
  headers: {
    'x-api-key': 'replace-at-build-time'
  }
}
```

## Validation behavior

Frontend validation checks:

- Name
- Email format
- Phone format
- Option selection
- Message length
- Consent checkbox

## Submission result handling

All adapters return normalized `FormResult`:

- `ok`: `true | false`
- `message`: user-facing status message
- `fieldErrors` (optional)

Preset-level `successMessage` / `errorMessage` can override adapter defaults.

## Manual test checklist

1. Fill valid form and submit
2. Confirm success message renders
3. Submit invalid input and confirm field errors
4. Disable endpoint/keys and verify graceful error copy
5. Check keyboard navigation/focus behavior

## Troubleshooting

- `not configured` errors: missing endpoint or API credentials
- network errors: endpoint unreachable or CORS misconfiguration
- provider rejects request: verify IDs, template fields, and environment values
