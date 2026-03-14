import type { PresetConfig } from '../../types/preset';

export const educationPreset: PresetConfig = {
  id: 'education',
  businessName: 'BrightBee Academy',
  tagline: 'Playful early-learning games for letters, numbers, shapes, colors, and more.',
  brand: {
    mark: 'BB',
    kicker: 'AGES 3-7',
    accentPhrase: 'Short game-based lessons, cheerful rewards, and parent-ready progress updates in one kid-safe app.'
  },
  hero: {
    title: 'A colorful learning game where kids build real skills through tap-friendly play.',
    subtitle:
      'BrightBee Academy helps preschool and early elementary learners explore alphabets, numbers, shapes, colors, patterns, and early problem-solving through guided mini-games.',
    primaryCta: 'Request a demo',
    secondaryCta: 'Explore learning worlds'
  },
  about: {
    headline: 'An educational gaming app designed for short attention spans and big curiosity.',
    story:
      'BrightBee Academy was created with teachers, curriculum designers, and parents who wanted screen time to feel active, joyful, and measurable. Each lesson world uses repetition, audio prompts, and visual rewards to keep kids engaged while reinforcing core early-learning concepts.',
    founder: 'Maya Torres',
    yearsInBusiness: 6,
    values: ['Play before pressure', 'Clear progress for adults', 'Inclusive visuals, audio, and pacing']
  },
  services: [
    {
      name: 'Alphabet Adventure',
      blurb: 'Letter tracing, phonics prompts, matching games, and word-picture challenges that make A to Z feel like a quest.',
      duration: 'Ages 3-5',
      priceHint: '26 letter quests'
    },
    {
      name: 'Number Lab',
      blurb: 'Counting, sequencing, number recognition, and first-addition games built around quick wins and repeatable practice.',
      duration: 'Ages 4-6',
      priceHint: '20 math mini-games'
    },
    {
      name: 'Shape Studio',
      blurb: 'Drag, match, sort, and build with circles, triangles, squares, and complex shapes in interactive puzzle scenes.',
      duration: 'Ages 3-6',
      priceHint: '15 puzzle challenges'
    },
    {
      name: 'Color Carnival',
      blurb: 'Color naming, mixing basics, visual discrimination, and object matching in bright celebration-style game boards.',
      duration: 'Ages 3-5',
      priceHint: '18 color play sessions'
    },
    {
      name: 'Pattern Playground',
      blurb: 'Logic and observation activities that help kids predict, sort, and complete visual patterns with confidence.',
      duration: 'Ages 5-7',
      priceHint: '12 unlockable levels'
    }
  ],
  testimonials: [
    {
      quote: 'My daughter asks for the letter game every morning, and now she points out sounds on street signs.',
      name: 'Alicia R.',
      role: 'Parent of a preschooler'
    },
    {
      quote: 'The number and shape stations work well during centers because the kids can navigate them independently.',
      name: 'Mr. Nolan P.',
      role: 'Kindergarten teacher'
    },
    {
      quote: 'We needed one app that felt fun enough for home and structured enough for school. This finally does both.',
      name: 'Dana L.',
      role: 'After-school program director'
    }
  ],
  contact: {
    phone: '(415) 555-0148',
    phoneLink: '+14155550148',
    email: 'hello@brightbeeacademy.com',
    address: '125 Harbor Way, San Francisco, CA 94124',
    serviceArea: 'Used at home, in classrooms, and in after-school programs across the U.S.',
    hours: [
      'Family support: Mon-Fri, 8:00 AM - 6:00 PM PT',
      'School demos: Tue-Thu, 9:00 AM - 4:00 PM PT',
      'New lesson drops: released monthly'
    ]
  },
  seo: {
    title: 'BrightBee Academy | Kids Educational Gaming App Template',
    description:
      'Education app preset for a kids learning game focused on alphabets, numbers, shapes, colors, and early skill-building.',
    keywords: ['kids learning app', 'educational game', 'alphabet game', 'number game', 'preschool app']
  },
  designTokens: {
    '--color-bg': '#fff7e8',
    '--color-surface': '#ffffff',
    '--color-surface-alt': '#eef8ff',
    '--color-text': '#21335b',
    '--color-text-muted': '#5e709b',
    '--color-accent': '#ff9f45',
    '--color-accent-strong': '#ff6b57',
    '--color-outline': '#d6e3f7',
    '--font-display': '"Bricolage Grotesque", "Trebuchet MS", sans-serif',
    '--font-body': '"Manrope", "Segoe UI", sans-serif',
    '--radius-sm': '16px',
    '--radius-md': '24px',
    '--radius-lg': '34px',
    '--shadow-soft': '0 20px 48px rgba(65, 110, 186, 0.16)'
  },
  formProvider: {
    type: 'custom',
    successMessage: 'Thanks. We received your request and will send the best next steps shortly.',
    errorMessage: 'We could not submit your request right now. Please email our team directly.'
  },
  pageCopy: {
    home: {
      metrics: [
        { value: '120+ mini-games', label: 'Across letters, math, shapes, colors, and logic' },
        { value: '5 learning worlds', label: 'Built for home practice, centers, and free play' },
        { value: 'Ages 3-7', label: 'Designed for preschool and early elementary learners' }
      ],
      featuredTitle: 'Learning worlds kids can jump into today',
      featuredDescription:
        'Each world combines animation, voice prompts, and bite-size wins so young learners stay engaged without getting overwhelmed.',
      featuredCtaLabel: 'See all learning worlds',
      testimonialsTitle: 'Loved by parents and teachers',
      testimonialsDescription:
        'Families use BrightBee at home, and educators use it for independent practice, learning stations, and intervention blocks.'
    },
    services: {
      badge: 'Learning Worlds',
      title: 'Choose a learning world',
      intro:
        'Start with alphabets, numbers, shapes, or colors, then unlock richer challenges as kids build confidence and attention span.',
      journeyTitle: 'How kids learn inside the app',
      journeySteps: [
        'Pick a learning world based on age, skill level, or classroom goal.',
        'Kids play short guided rounds with audio cues, hints, and celebration moments.',
        'Adults track progress and see which skills are ready for the next challenge.'
      ],
      ctaLabel: 'Request a family or school demo'
    },
    about: {
      badge: 'Our Story',
      featureTitle: 'Why BrightBee works for early learners',
      featureParagraphs: [
        'Our team blends child-centered game design with early-learning fundamentals so every tap, drag, and reward supports a real skill.',
        'The result is a calm, colorful experience that keeps children moving forward while giving adults clear visibility into what is clicking.'
      ],
      valuesTitle: 'Learning principles',
      serviceAreaTitle: 'Where families use it'
    },
    contact: {
      badge: 'Get Started',
      title: 'Talk with the BrightBee team',
      intro:
        'Tell us whether you are a parent, teacher, or school leader and we will guide you to the best setup for your learners.',
      formTitle: 'Request a demo or pricing guide',
      formDescription:
        'We reply with platform details, age-fit recommendations, classroom options, and the fastest way to get started.',
      directTitle: 'Reach the team',
      hoursTitle: 'Support windows'
    },
    form: {
      nameLabel: 'Parent, teacher, or school name',
      serviceLabel: 'Learning world of interest',
      servicePlaceholder: 'Select a learning world',
      messageLabel: 'What are you looking for?',
      messagePlaceholder: 'Share learner ages, class size, goals, and preferred devices.',
      consentLabel: 'I consent to being contacted about BrightBee demos, pricing, and setup help.',
      submitLabel: 'Request details',
      submittingLabel: 'Sending...'
    }
  }
};
