import type {
  FormProviderConfig,
  HomeExperienceLocale,
  PresetConfig,
  PresetLocalization,
  PresetPageCopy
} from '../types/preset';

function mergePageCopy(base?: PresetPageCopy, localized?: PresetPageCopy): PresetPageCopy | undefined {
  if (!base && !localized) {
    return undefined;
  }

  return {
    ...base,
    ...localized,
    navigation: {
      ...base?.navigation,
      ...localized?.navigation
    },
    home: {
      ...base?.home,
      ...localized?.home
    },
    services: {
      ...base?.services,
      ...localized?.services
    },
    about: {
      ...base?.about,
      ...localized?.about
    },
    contact: {
      ...base?.contact,
      ...localized?.contact
    },
    form: {
      ...base?.form,
      ...localized?.form
    }
  };
}

function mergeFormProvider(
  base: FormProviderConfig,
  localized?: PresetLocalization['formProvider']
): FormProviderConfig {
  if (!localized) {
    return base;
  }

  return {
    ...base,
    ...localized
  };
}

export function resolveLocalizedPreset(
  preset: PresetConfig,
  locale: HomeExperienceLocale
): PresetConfig {
  if (locale === 'en' || !preset.locales?.[locale]) {
    return preset;
  }

  const localized = preset.locales[locale];

  return {
    ...preset,
    businessName: localized.businessName ?? preset.businessName,
    tagline: localized.tagline ?? preset.tagline,
    brand: {
      ...preset.brand,
      ...localized.brand
    },
    hero: {
      ...preset.hero,
      ...localized.hero
    },
    about: {
      ...preset.about,
      ...localized.about
    },
    services: localized.services ?? preset.services,
    testimonials: localized.testimonials ?? preset.testimonials,
    contact: {
      ...preset.contact,
      ...localized.contact
    },
    formProvider: mergeFormProvider(preset.formProvider, localized.formProvider),
    pageCopy: mergePageCopy(preset.pageCopy, localized.pageCopy)
  };
}
