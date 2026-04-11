/**
 * Currency Helper Utilities
 * Maps currencies to countries and provides filtering functions
 */

// Currency to country mapping
export const currencyToCountries = {
  AED: ['UAE'],
  USD: ['USA'],
  EUR: ['Portugal', 'Cyprus', 'Malta', 'Latvia'],
  CAD: ['Canada'],
  AUD: ['Australia'],
  TRY: ['Turkey'],
  HUF: ['Hungary'],
  PHP: ['Philippines'],
  MYR: ['Malaysia'],
};

// Country to currency mapping
export const countryToCurrency = {
  UAE: 'AED',
  USA: 'USD',
  Portugal: 'EUR',
  Canada: 'CAD',
  Australia: 'AUD',
  Turkey: 'TRY',
  Cyprus: 'EUR',
  Malta: 'EUR',
  Hungary: 'HUF',
  Latvia: 'EUR',
  Philippines: 'PHP',
  Malaysia: 'MYR',
};

/**
 * Get currency symbol based on user's selected preference or property's country
 * @param {string} country - Country name (optional, will use selected currency if available)
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (country) => {
  // Check if user has selected a specific currency preference
  const selectedCurrency = typeof window !== 'undefined' ? localStorage.getItem('selectedCurrency') : null;

  // Define currency symbols map
  const currencySymbols = {
    AED: 'AED',
    USD: '$',
    EUR: '€',
    CAD: 'CAD',
    AUD: 'AUD',
    TRY: '₺',
    HUF: 'Ft',
    PHP: '₱',
    MYR: 'RM',
  };

  // Country to currency mapping
  const countryCurrencyMap = {
    UAE: 'AED',
    USA: 'USD',
    Portugal: 'EUR',
    Canada: 'CAD',
    Australia: 'AUD',
    Turkey: 'TRY',
    Cyprus: 'EUR',
    Malta: 'EUR',
    Hungary: 'HUF',
    Latvia: 'EUR',
    Philippines: 'PHP',
    Malaysia: 'MYR',
  };

  // If user selected a specific currency (not ALL), use that
  if (selectedCurrency && selectedCurrency !== 'ALL') {
    return currencySymbols[selectedCurrency] || '$';
  }

  // Otherwise, use property's country currency
  // First get the currency code for the country, then get its symbol
  const currencyCode = countryCurrencyMap[country];
  if (currencyCode) {
    return currencySymbols[currencyCode] || currencyCode;
  }

  // Default fallback
  return '$';
};

/**
 * Filter properties by selected currency
 * @param {Array} properties - Array of property objects
 * @param {string} currencyCode - Selected currency code (e.g., 'AED', 'USD', 'ALL')
 * @returns {Array} Filtered properties
 */
export const filterPropertiesByCurrency = (properties, currencyCode) => {
  // If "ALL" is selected, return all properties
  if (!currencyCode || currencyCode === 'ALL') {
    return properties;
  }

  // Get countries that use this currency
  const countries = currencyToCountries[currencyCode] || [];

  // Filter properties by country
  return properties.filter((property) => {
    return countries.includes(property.country);
  });
};

/**
 * Get selected currency from localStorage
 * @returns {string} Currency code
 */
export const getSelectedCurrency = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedCurrency') || 'ALL';
  }
  return 'ALL';
};

/**
 * Set selected currency in localStorage
 * @param {string} currencyCode - Currency code to save
 */
export const setSelectedCurrency = (currencyCode) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedCurrency', currencyCode);
  }
};
