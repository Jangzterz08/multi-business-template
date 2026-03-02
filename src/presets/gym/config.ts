import type { PresetConfig } from '../../types/preset';

export const gymPreset: PresetConfig = {
  id: 'gym',
  businessName: 'Forge District Athletics',
  tagline: 'Structured coaching for stronger daily performance.',
  brand: {
    mark: 'FD',
    kicker: 'PERFORMANCE CLUB',
    accentPhrase: 'Small-group coaching with measurable progress.'
  },
  hero: {
    title: 'Train with clear programming, coaching, and accountability.',
    subtitle:
      'Our hybrid strength and conditioning tracks balance performance goals with mobility, recovery, and sustainable scheduling.',
    primaryCta: 'Start your trial week',
    secondaryCta: 'See coaching tracks'
  },
  about: {
    headline: 'Data-aware coaching for members at every level.',
    story:
      'Forge District blends expert coaching and performance tracking to help members build strength, endurance, and resilience with weekly momentum.',
    founder: 'Coach Marcus Hale',
    yearsInBusiness: 11,
    values: ['Technique before intensity', 'Progress tracked weekly', 'Community accountability']
  },
  services: [
    {
      name: 'Small Group Training',
      blurb: 'Coach-led blocks for strength, conditioning, and form quality.',
      duration: '60 min',
      priceHint: 'From $139/mo'
    },
    {
      name: '1:1 Performance Coaching',
      blurb: 'Personalized periodization and movement assessment.',
      duration: '50 min',
      priceHint: 'From $95/session'
    },
    {
      name: 'Mobility Lab',
      blurb: 'Joint prep, flexibility, and recovery sessions for durability.',
      duration: '45 min',
      priceHint: 'From $45'
    },
    {
      name: 'Nutrition Framework',
      blurb: 'Practical nutrition coaching aligned to your training block.',
      duration: '30 min',
      priceHint: 'Add-on program'
    }
  ],
  testimonials: [
    {
      quote: 'The coaching is technical but practical. I can feel weekly progress.',
      name: 'Luis G.',
      role: 'Member, 2 years'
    },
    {
      quote: 'I joined as a beginner and still felt supported from day one.',
      name: 'Priya K.',
      role: 'Member, 6 months'
    },
    {
      quote: 'Programming is smart, not random. Every session has a purpose.',
      name: 'Derek W.',
      role: 'Competitive athlete'
    }
  ],
  contact: {
    phone: '(512) 555-3008',
    phoneLink: '+15125553008',
    email: 'coaching@forgedistrict.com',
    address: '73 Riverbend St, Austin, TX 78741',
    serviceArea: 'Serving Austin athletes and everyday professionals',
    hours: ['Mon-Fri: 5:30 AM - 8:00 PM', 'Sat: 7:00 AM - 2:00 PM', 'Sun: Recovery sessions only']
  },
  seo: {
    title: 'Forge District Athletics | Strength & Conditioning Gym',
    description:
      'High-converting gym template preset with scalable service sections and coaching-first messaging.',
    keywords: ['gym', 'strength training', 'fitness coaching', 'athletic performance']
  },
  designTokens: {
    '--color-bg': '#f4f7fa',
    '--color-surface': '#ffffff',
    '--color-surface-alt': '#eaf1f8',
    '--color-text': '#102033',
    '--color-text-muted': '#425a72',
    '--color-accent': '#ff6b35',
    '--color-accent-strong': '#df4f1f',
    '--color-outline': '#d4dfeb',
    '--font-display': '"Bricolage Grotesque", "Arial Narrow", sans-serif',
    '--font-body': '"IBM Plex Sans", "Segoe UI", sans-serif',
    '--radius-sm': '8px',
    '--radius-md': '16px',
    '--radius-lg': '24px',
    '--shadow-soft': '0 18px 38px rgba(16, 32, 51, 0.15)'
  },
  formProvider: {
    type: 'emailjs',
    successMessage: 'Request received. A coach will contact you within 24 hours.',
    errorMessage: 'Unable to submit right now. Email us directly to reserve your trial.'
  }
};
