import { CustomEndpointAdapter } from './adapters/CustomEndpointAdapter';
import { EmailjsAdapter } from './adapters/EmailjsAdapter';
import { FormspreeAdapter } from './adapters/FormspreeAdapter';
import type { FormAdapter } from '../types/forms';
import type { FormProviderConfig } from '../types/preset';

function readEnv(name: string): string | undefined {
  const raw = import.meta.env[name];
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : undefined;
}

export function createFormAdapter(provider: FormProviderConfig): FormAdapter {
  switch (provider.type) {
    case 'formspree': {
      const endpoint = provider.endpoint ?? readEnv('VITE_FORMSPREE_ENDPOINT');
      return new FormspreeAdapter(endpoint);
    }
    case 'emailjs': {
      return new EmailjsAdapter({
        serviceId: provider.serviceId ?? readEnv('VITE_EMAILJS_SERVICE_ID'),
        templateId: provider.templateId ?? readEnv('VITE_EMAILJS_TEMPLATE_ID'),
        publicKey: provider.publicKey ?? readEnv('VITE_EMAILJS_PUBLIC_KEY')
      });
    }
    case 'custom': {
      const endpoint = provider.endpoint ?? readEnv('VITE_CUSTOM_FORM_ENDPOINT');
      return new CustomEndpointAdapter({ endpoint, headers: provider.headers });
    }
  }
}
