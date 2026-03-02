import type { PresetConfig } from '../../types/preset';

export const dentalPreset: PresetConfig = {
  id: 'dental',
  businessName: 'North Harbor Dental',
  tagline: 'Modern family care with calm appointments.',
  brand: {
    mark: 'NH',
    kicker: 'DENTAL STUDIO',
    accentPhrase: 'Gentle, transparent, and on-time care.'
  },
  hero: {
    title: 'Confident smiles start with clear, comfortable care.',
    subtitle:
      'From preventive cleanings to cosmetic restorations, we combine modern imaging and patient-first service to keep every visit smooth.',
    primaryCta: 'Book a consultation',
    secondaryCta: 'Explore treatments'
  },
  about: {
    headline: 'Neighborhood-first dentistry built around trust.',
    story:
      'North Harbor Dental blends digital diagnostics with chair-side clarity so patients always understand options, costs, and recovery timelines before treatment begins.',
    founder: 'Dr. Lena Ortiz',
    yearsInBusiness: 14,
    values: ['No surprise billing', 'Comfort-focused procedures', 'Evidence-based treatment plans']
  },
  services: [
    {
      name: 'Preventive Care',
      blurb: 'Routine exams, digital x-rays, and biofilm-guided cleanings.',
      duration: '45 min',
      priceHint: 'From $120'
    },
    {
      name: 'Whitening & Aesthetics',
      blurb: 'In-office and take-home systems tailored to enamel sensitivity.',
      duration: '60 min',
      priceHint: 'From $260'
    },
    {
      name: 'Restorative Dentistry',
      blurb: 'Tooth-colored fillings, crowns, and implant restoration pathways.',
      duration: '75 min',
      priceHint: 'Custom plan'
    },
    {
      name: 'Emergency Visits',
      blurb: 'Same-day triage for pain, fractures, and urgent infections.',
      duration: '30 min',
      priceHint: 'Call for priority'
    }
  ],
  testimonials: [
    {
      quote: 'They explain every option clearly and never rush me into decisions.',
      name: 'Mina R.',
      role: 'Long-term patient'
    },
    {
      quote: 'My emergency appointment was same-day and the pain relief was immediate.',
      name: 'Jordan T.',
      role: 'New patient'
    },
    {
      quote: 'The whole team is calm, organized, and genuinely kind.',
      name: 'Elena B.',
      role: 'Parent of two'
    }
  ],
  contact: {
    phone: '(312) 555-1042',
    phoneLink: '+13125551042',
    email: 'hello@northharbordental.com',
    address: '124 Harborview Ave, Chicago, IL 60613',
    serviceArea: 'Serving North Side Chicago neighborhoods',
    hours: ['Mon-Thu: 8:00 AM - 6:00 PM', 'Fri: 8:00 AM - 2:00 PM', 'Sat: 9:00 AM - 1:00 PM']
  },
  seo: {
    title: 'North Harbor Dental | Family & Cosmetic Dentistry',
    description:
      'Premium local dental template preset with service-first messaging and conversion-ready contact flow.',
    keywords: ['dental clinic', 'family dentistry', 'cosmetic dentist', 'local dental services']
  },
  designTokens: {
    '--color-bg': '#f7f3ea',
    '--color-surface': '#ffffff',
    '--color-surface-alt': '#eef6f5',
    '--color-text': '#132528',
    '--color-text-muted': '#466065',
    '--color-accent': '#1f8a83',
    '--color-accent-strong': '#156d68',
    '--color-outline': '#cddbd9',
    '--font-display': '"Fraunces", "Times New Roman", serif',
    '--font-body': '"Work Sans", "Segoe UI", sans-serif',
    '--radius-sm': '10px',
    '--radius-md': '18px',
    '--radius-lg': '28px',
    '--shadow-soft': '0 16px 40px rgba(31, 138, 131, 0.16)'
  },
  formProvider: {
    type: 'formspree',
    successMessage: 'Thanks. We will call you within one business day.',
    errorMessage: 'We could not submit your request. Please call us directly if urgent.'
  }
};
