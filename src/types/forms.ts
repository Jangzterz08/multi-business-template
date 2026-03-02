export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
}

export interface LeadFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  consent?: string;
}

export interface FormResult {
  ok: boolean;
  message: string;
  fieldErrors?: LeadFieldErrors;
}

export interface FormAdapter {
  submitLead(payload: LeadPayload): Promise<FormResult>;
}
