/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'pt', 'tr'],
    localeDetection: false, // We'll handle this manually based on currency
  },
  // Language-country mapping
  languageMap: {
    en: ['USA', 'UK', 'Canada', 'Australia'],
    ar: ['UAE'],
    pt: ['Portugal'],
    tr: ['Turkey'],
  },
  // Currency-language mapping
  currencyLanguageMap: {
    USD: 'en',
    GBP: 'en',
    CAD: 'en',
    AUD: 'en',
    AED: 'ar',
    EUR: 'pt', 
    TRY: 'tr',
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
