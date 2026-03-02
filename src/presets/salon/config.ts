import type { PresetConfig } from '../../types/preset';

export const salonPreset: PresetConfig = {
  id: 'salon',
  businessName: 'Atelier Bloom Salon',
  tagline: 'Editorial styling, tailored for everyday confidence.',
  brand: {
    mark: 'AB',
    kicker: 'STYLE HOUSE',
    accentPhrase: 'Color artistry and precision cuts with a relaxed vibe.'
  },
  hero: {
    title: 'Personalized color and cuts designed around your routine.',
    subtitle:
      'We map face shape, hair health, and maintenance goals to create looks that grow out beautifully between appointments.',
    primaryCta: 'Reserve your chair',
    secondaryCta: 'View service menu'
  },
  about: {
    headline: 'A craft-first salon with studio-level consultation.',
    story:
      'Atelier Bloom combines trend fluency with practical styling plans, so guests leave with a look that works on weekdays, events, and everything in between.',
    founder: 'Nora Sinclair',
    yearsInBusiness: 9,
    values: ['Consultation before scissors', 'Scalp and strand integrity', 'Custom styling education']
  },
  services: [
    {
      name: 'Precision Cut',
      blurb: 'Shape-forward cuts with maintenance and styling walkthrough.',
      duration: '60 min',
      priceHint: 'From $90'
    },
    {
      name: 'Signature Color',
      blurb: 'Dimensional color blending with gloss and tonal balancing.',
      duration: '120 min',
      priceHint: 'From $180'
    },
    {
      name: 'Blowout & Finish',
      blurb: 'Event-ready finishing with texture-aware product plan.',
      duration: '45 min',
      priceHint: 'From $55'
    },
    {
      name: 'Repair Ritual',
      blurb: 'Bond-building and hydration treatment for stressed strands.',
      duration: '40 min',
      priceHint: 'From $65'
    }
  ],
  testimonials: [
    {
      quote: 'My color still looks rich weeks later and styling is easier than ever.',
      name: 'Cassie P.',
      role: 'Repeat guest'
    },
    {
      quote: 'Consultation was detailed and the cut matches my daily routine perfectly.',
      name: 'Hannah D.',
      role: 'New client'
    },
    {
      quote: 'A premium result without the intimidating salon vibe.',
      name: 'Rae M.',
      role: 'Monthly member'
    }
  ],
  contact: {
    phone: '(404) 555-9921',
    phoneLink: '+14045559921',
    email: 'bookings@atelierbloom.com',
    address: '908 Glenwood Ave, Atlanta, GA 30316',
    serviceArea: 'Serving East Atlanta and nearby neighborhoods',
    hours: ['Tue-Fri: 10:00 AM - 8:00 PM', 'Sat: 9:00 AM - 6:00 PM', 'Sun: 10:00 AM - 4:00 PM']
  },
  seo: {
    title: 'Atelier Bloom Salon | Color, Cut, and Styling',
    description:
      'Premium salon template preset focused on bookings, service clarity, and high-conversion local pages.',
    keywords: ['salon', 'hair color', 'haircut', 'styling studio']
  },
  designTokens: {
    '--color-bg': '#fef6f1',
    '--color-surface': '#ffffff',
    '--color-surface-alt': '#fff0e6',
    '--color-text': '#301b1a',
    '--color-text-muted': '#6f4b49',
    '--color-accent': '#e56b6f',
    '--color-accent-strong': '#c44d52',
    '--color-outline': '#f0d8cf',
    '--font-display': '"Sora", "Gill Sans", sans-serif',
    '--font-body': '"Manrope", "Segoe UI", sans-serif',
    '--radius-sm': '12px',
    '--radius-md': '20px',
    '--radius-lg': '32px',
    '--shadow-soft': '0 18px 44px rgba(229, 107, 111, 0.18)'
  },
  formProvider: {
    type: 'custom',
    successMessage: 'Your request is in. We will confirm your slot shortly.',
    errorMessage: 'Submission failed. Call the studio and we will secure your appointment.'
  }
};
