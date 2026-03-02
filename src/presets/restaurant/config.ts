import type { PresetConfig } from '../../types/preset';

export const restaurantPreset: PresetConfig = {
  id: 'restaurant',
  businessName: 'Trattoria Bellavista',
  tagline: 'Handmade pasta, wood-fired classics, and warm Italian hospitality.',
  brand: {
    mark: 'TB',
    kicker: 'ITALIAN KITCHEN',
    accentPhrase: 'Seasonal ingredients, old-world technique, modern dining comfort.'
  },
  hero: {
    title: 'A neighborhood Italian table built for long dinners and great conversation.',
    subtitle:
      'From fresh tagliatelle and slow-simmered sugo to crisp Roman-style pinsa, our menu blends regional Italian tradition with local seasonal produce.',
    primaryCta: 'Reserve a table',
    secondaryCta: 'View menu highlights'
  },
  about: {
    headline: 'A trattoria inspired by family recipes from Emilia-Romagna and Tuscany.',
    story:
      'Trattoria Bellavista opened to bring generous Italian dining to the neighborhood, with handmade dough, carefully sourced olive oils, and a wine list focused on small producers.',
    founder: 'Chef Marco Bellini',
    yearsInBusiness: 12,
    values: ['Fresh pasta made daily', 'Regional Italian wine pairings', 'Welcoming service for every table']
  },
  services: [
    {
      name: 'Dinner Reservations',
      blurb: 'Evening seating with full a la carte menu and curated wine pairing suggestions.',
      duration: '90-120 min',
      priceHint: 'Average $42/person'
    },
    {
      name: 'Chef Tasting Menu',
      blurb: 'Five-course seasonal journey featuring antipasti, handmade pasta, and secondi.',
      duration: '120 min',
      priceHint: 'From $78/person'
    },
    {
      name: 'Private Events',
      blurb: 'Birthdays, anniversaries, and small corporate dinners with custom menus.',
      duration: '2-4 hours',
      priceHint: 'Custom quote'
    },
    {
      name: 'Weekend Brunch Italiana',
      blurb: 'House focaccia, ricotta pancakes, espresso cocktails, and rotating specials.',
      duration: '75 min',
      priceHint: 'From $26/person'
    }
  ],
  testimonials: [
    {
      quote: 'The cacio e pepe tastes exactly like what I had in Rome.',
      name: 'Daniela S.',
      role: 'Weekly guest'
    },
    {
      quote: 'Perfect anniversary dinner, incredible pacing, and thoughtful wine guidance.',
      name: 'Ethan M.',
      role: 'Private event host'
    },
    {
      quote: 'Warm service, handmade pasta, and desserts worth planning around.',
      name: 'Priya L.',
      role: 'Neighborhood regular'
    }
  ],
  contact: {
    phone: '(646) 555-1846',
    phoneLink: '+16465551846',
    email: 'reservations@trattoriabellavista.com',
    address: '218 Mulberry Street, New York, NY 10012',
    serviceArea: 'Serving SoHo, Nolita, and Downtown Manhattan',
    hours: ['Mon-Thu: 5:00 PM - 10:00 PM', 'Fri-Sat: 5:00 PM - 11:00 PM', 'Sun brunch: 11:00 AM - 3:00 PM']
  },
  seo: {
    title: 'Trattoria Bellavista | Italian Restaurant Template',
    description:
      'Italian restaurant website template preset optimized for reservations, menu storytelling, and local SEO.',
    keywords: ['italian restaurant', 'trattoria', 'fresh pasta', 'private dining', 'restaurant reservations']
  },
  designTokens: {
    '--color-bg': '#f8f2e6',
    '--color-surface': '#fffdf8',
    '--color-surface-alt': '#f2e8d8',
    '--color-text': '#2f2319',
    '--color-text-muted': '#6a5544',
    '--color-accent': '#b33a2e',
    '--color-accent-strong': '#8f2f26',
    '--color-outline': '#decfb8',
    '--font-display': '"Fraunces", "Times New Roman", serif',
    '--font-body': '"Work Sans", "Segoe UI", sans-serif',
    '--radius-sm': '10px',
    '--radius-md': '18px',
    '--radius-lg': '28px',
    '--shadow-soft': '0 16px 36px rgba(143, 47, 38, 0.16)'
  },
  formProvider: {
    type: 'custom',
    successMessage: 'Reservation request received. We will confirm your table shortly.',
    errorMessage: 'We could not submit your request. Please call us directly for immediate booking.'
  }
};
