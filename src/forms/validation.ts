import type { LeadFieldErrors, LeadPayload } from '../types/forms';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(payload: LeadPayload, messages: LeadFieldErrors = {}): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (payload.name.trim().length < 2) {
    errors.name = messages.name ?? 'Please enter your name.';
  }

  if (!emailPattern.test(payload.email.trim())) {
    errors.email = messages.email ?? 'Enter a valid email address.';
  }

  if (payload.service.trim().length < 2) {
    errors.service = messages.service ?? 'Select an option.';
  }

  if (payload.message.trim().length < 12) {
    errors.message = messages.message ?? 'Add a short message so we know how to help.';
  }

  if (!payload.consent) {
    errors.consent = messages.consent ?? 'Please confirm consent to be contacted.';
  }

  return errors;
}

export function hasLeadErrors(errors: LeadFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
