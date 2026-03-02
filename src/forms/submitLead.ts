import { createFormAdapter } from './createFormAdapter';
import type { FormResult, LeadPayload } from '../types/forms';
import type { FormProviderConfig } from '../types/preset';

export async function submitLead(
  payload: LeadPayload,
  provider: FormProviderConfig
): Promise<FormResult> {
  const adapter = createFormAdapter(provider);
  const result = await adapter.submitLead(payload);

  if (result.ok && provider.successMessage) {
    return {
      ...result,
      message: provider.successMessage
    };
  }

  if (!result.ok && provider.errorMessage) {
    return {
      ...result,
      message: provider.errorMessage
    };
  }

  return result;
}
