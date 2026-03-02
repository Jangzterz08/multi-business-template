import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { submitLead } from '../forms/submitLead';
import { hasLeadErrors, validateLead } from '../forms/validation';
import type { LeadFieldErrors, LeadPayload } from '../types/forms';
import type { PresetConfig } from '../types/preset';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  preset: PresetConfig;
}

type Notice =
  | { tone: 'idle'; text: '' }
  | { tone: 'success'; text: string }
  | { tone: 'error'; text: string };

const initialForm: LeadPayload = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  consent: false
};

export function ContactForm({ preset }: ContactFormProps) {
  const [form, setForm] = useState<LeadPayload>(initialForm);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [notice, setNotice] = useState<Notice>({ tone: 'idle', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const serviceOptions = useMemo(() => preset.services.map((service) => service.name), [preset.services]);

  function updateField<K extends keyof LeadPayload>(field: K, value: LeadPayload[K]) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = event.target;

    if (target.name === 'consent' && target instanceof HTMLInputElement) {
      updateField('consent', target.checked);
      return;
    }

    if (target.name === 'name' || target.name === 'email' || target.name === 'phone' || target.name === 'service' || target.name === 'message') {
      updateField(target.name, target.value);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice({ tone: 'idle', text: '' });

    const validation = validateLead(form);
    if (hasLeadErrors(validation)) {
      setErrors(validation);
      setNotice({ tone: 'error', text: 'Please fix the highlighted fields.' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    const result = await submitLead(form, preset.formProvider);

    setSubmitting(false);
    setNotice({ tone: result.ok ? 'success' : 'error', text: result.message });

    if (result.ok) {
      setForm(initialForm);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} autoComplete="name" />
          {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
          {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
        </label>

        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
          {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
        </label>

        <label>
          Service interest
          <select name="service" value={form.service} onChange={handleChange}>
            <option value="">Select a service</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.service ? <span className={styles.error}>{errors.service}</span> : null}
        </label>

        <label className={styles.fullWidth}>
          Message
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us your goals, schedule, and preferred contact method."
          />
          {errors.message ? <span className={styles.error}>{errors.message}</span> : null}
        </label>
      </div>

      <label className={styles.checkbox}>
        <input name="consent" type="checkbox" checked={form.consent} onChange={handleChange} />
        <span>I consent to being contacted about this request.</span>
      </label>
      {errors.consent ? <span className={styles.error}>{errors.consent}</span> : null}

      <button className="button buttonPrimary" type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Send request'}
      </button>

      {notice.tone !== 'idle' ? (
        <p className={notice.tone === 'success' ? styles.success : styles.errorBlock}>{notice.text}</p>
      ) : null}
    </form>
  );
}
