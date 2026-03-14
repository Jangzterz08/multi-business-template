export type RoutePath = '/' | '/services' | '/about' | '/contact';

export type DesignTokenKey =
  | '--color-bg'
  | '--color-surface'
  | '--color-surface-alt'
  | '--color-text'
  | '--color-text-muted'
  | '--color-accent'
  | '--color-accent-strong'
  | '--color-outline'
  | '--font-display'
  | '--font-body'
  | '--radius-sm'
  | '--radius-md'
  | '--radius-lg'
  | '--shadow-soft';

export type DesignTokens = Record<DesignTokenKey, string>;

export interface ServiceItem {
  name: string;
  blurb: string;
  duration: string;
  priceHint: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface ContactInfo {
  phone: string;
  phoneLink: string;
  email: string;
  address: string;
  hours: string[];
  serviceArea: string;
}

export interface BrandInfo {
  mark: string;
  kicker: string;
  accentPhrase: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface HeroMetric {
  value: string;
  label: string;
}

export interface AboutContent {
  headline: string;
  story: string;
  founder: string;
  yearsInBusiness: number;
  values: string[];
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: string[];
}

export interface HomePageCopy {
  metrics?: HeroMetric[];
  featuredTitle?: string;
  featuredDescription?: string;
  featuredCtaLabel?: string;
  testimonialsTitle?: string;
  testimonialsDescription?: string;
}

export interface ServicesPageCopy {
  badge?: string;
  title?: string;
  intro?: string;
  journeyTitle?: string;
  journeySteps?: string[];
  ctaLabel?: string;
}

export interface AboutPageCopy {
  badge?: string;
  featureTitle?: string;
  featureParagraphs?: string[];
  valuesTitle?: string;
  serviceAreaTitle?: string;
}

export interface ContactPageCopy {
  badge?: string;
  title?: string;
  intro?: string;
  formTitle?: string;
  formDescription?: string;
  directTitle?: string;
  hoursTitle?: string;
}

export interface FormCopy {
  nameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  serviceLabel?: string;
  servicePlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  consentLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
}

export interface PresetPageCopy {
  home?: HomePageCopy;
  services?: ServicesPageCopy;
  about?: AboutPageCopy;
  contact?: ContactPageCopy;
  form?: FormCopy;
}

export interface SharedFormProviderFields {
  successMessage?: string;
  errorMessage?: string;
}

export type FormProviderConfig =
  | ({
      type: 'formspree';
      endpoint?: string;
    } & SharedFormProviderFields)
  | ({
      type: 'emailjs';
      serviceId?: string;
      templateId?: string;
      publicKey?: string;
    } & SharedFormProviderFields)
  | ({
      type: 'custom';
      endpoint?: string;
      headers?: Record<string, string>;
    } & SharedFormProviderFields);

export interface PresetConfig {
  id: string;
  businessName: string;
  tagline: string;
  brand: BrandInfo;
  hero: HeroContent;
  about: AboutContent;
  services: ServiceItem[];
  testimonials: Testimonial[];
  contact: ContactInfo;
  seo: SeoContent;
  designTokens: DesignTokens;
  formProvider: FormProviderConfig;
  pageCopy?: PresetPageCopy;
}
