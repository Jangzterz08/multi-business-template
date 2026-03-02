import type { FormAdapter, FormResult, LeadPayload } from '../../types/forms';

interface CustomAdapterOptions {
  endpoint?: string;
  headers?: Record<string, string>;
}

export class CustomEndpointAdapter implements FormAdapter {
  constructor(private readonly options: CustomAdapterOptions) {}

  async submitLead(payload: LeadPayload): Promise<FormResult> {
    if (!this.options.endpoint) {
      return {
        ok: false,
        message: 'Custom form endpoint is not configured.'
      };
    }

    try {
      const response = await fetch(this.options.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.options.headers ?? {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        return {
          ok: false,
          message: 'Custom endpoint returned an error.'
        };
      }

      return {
        ok: true,
        message: 'Message sent successfully.'
      };
    } catch {
      return {
        ok: false,
        message: 'Network error while contacting your endpoint.'
      };
    }
  }
}
