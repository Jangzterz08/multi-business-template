import type { FormAdapter, FormResult, LeadPayload } from '../../types/forms';

interface EmailjsCredentials {
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
}

export class EmailjsAdapter implements FormAdapter {
  constructor(private readonly credentials: EmailjsCredentials) {}

  async submitLead(payload: LeadPayload): Promise<FormResult> {
    const { serviceId, templateId, publicKey } = this.credentials;

    if (!serviceId || !templateId || !publicKey) {
      return {
        ok: false,
        message: 'EmailJS credentials are not fully configured.'
      };
    }

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: payload.name,
            reply_to: payload.email,
            service: payload.service,
            message: payload.message,
            consent: payload.consent ? 'Yes' : 'No'
          }
        })
      });

      if (!response.ok) {
        return {
          ok: false,
          message: 'EmailJS rejected the request.'
        };
      }

      return {
        ok: true,
        message: 'Message sent successfully.'
      };
    } catch {
      return {
        ok: false,
        message: 'Network error while contacting EmailJS.'
      };
    }
  }
}
