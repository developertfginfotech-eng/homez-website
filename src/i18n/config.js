import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from '../../public/locales/en/common.json';
import arCommon from '../../public/locales/ar/common.json';
import ptCommon from '../../public/locales/pt/common.json';
import trCommon from '../../public/locales/tr/common.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
      },
      ar: {
        common: arCommon,
      },
      pt: {
        common: ptCommon,
      },
      tr: {
        common: trCommon,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Currency to language mapping
export const currencyLanguageMap = {
  USD: 'en',
  GBP: 'en',
  CAD: 'en',
  AUD: 'en',
  AED: 'ar',
  EUR: 'pt',
  TRY: 'tr',
  PHP: 'en',
  MYR: 'en',
  HUF: 'en',
};

// Country to language mapping
export const countryLanguageMap = {
  USA: 'en',
  UK: 'en',
  Canada: 'en',
  Australia: 'en',
  UAE: 'ar',
  Portugal: 'pt',
  Turkey: 'tr',
  Philippines: 'en',
  Malaysia: 'en',
  Hungary: 'en',
  Latvia: 'en',
  Cyprus: 'en',
  Malta: 'en',
};
