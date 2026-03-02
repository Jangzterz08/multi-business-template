import type { FormAdapter, FormResult, LeadPayload } from '../../types/forms';

export class FormspreeAdapter implements FormAdapter {
  constructor(private readonly endpoint?: string) {}

  async submitLead(payload: LeadPayload): Promise<FormResult> {
    if (!this.endpoint) {
      return {
        ok: false,
        message: 'Formspree endpoint is not configured.'
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        return {
          ok: false,
          message: 'Formspree submission failed.'
        };
      }

      return {
        ok: true,
        message: 'Message sent successfully.'
      };
    } catch {
      return {
        ok: false,
        message: 'Network error while contacting Formspree.'
      };
    }
  }
}
