import type { LeadFieldErrors, LeadPayload } from '../types/forms';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,}$/;

export function validateLead(payload: LeadPayload): LeadFieldErrors {
  const errors: LeadFieldErrors = {};

  if (payload.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }

  if (!emailPattern.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!phonePattern.test(payload.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (payload.service.trim().length < 2) {
    errors.service = 'Select an option.';
  }

  if (payload.message.trim().length < 12) {
    errors.message = 'Add a short message so we know how to help.';
  }

  if (!payload.consent) {
    errors.consent = 'Please confirm consent to be contacted.';
  }

  return errors;
}

export function hasLeadErrors(errors: LeadFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
