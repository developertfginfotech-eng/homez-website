"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { currencyLanguageMap, countryLanguageMap } from '../i18n/config';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr'); // ltr or rtl for Arabic
  const [isInitialized, setIsInitialized] = useState(false);
  const [userPreferredLanguage, setUserPreferredLanguage] = useState(null); // Track if user manually selected language

  useEffect(() => {
    // Initialize language from localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') || 'en';
      const userPreferred = localStorage.getItem('userPreferredLanguage') === 'true';
      setUserPreferredLanguage(userPreferred);
      changeLanguage(savedLanguage, false); // Don't mark as user preference on init
      setIsInitialized(true);
    }
  }, []);

  const changeLanguage = async (newLanguage, isUserAction = true) => {
    if (!newLanguage || newLanguage === currentLanguage) return;

    try {
      // Change i18n language
      await i18nInstance.changeLanguage(newLanguage);

      setCurrentLanguage(newLanguage);

      // Keep LTR direction for ALL languages (including Arabic)
      const newDirection = 'ltr';
      setDirection(newDirection);

      if (typeof document !== 'undefined') {
        document.documentElement.dir = newDirection;
        document.documentElement.lang = newLanguage;
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLanguage);

        // If user manually changed language, remember their preference
        if (isUserAction) {
          setUserPreferredLanguage(true);
          localStorage.setItem('userPreferredLanguage', 'true');
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const changeLanguageByCurrency = (currency) => {
    // Only auto-switch language if user hasn't manually selected a language
    if (userPreferredLanguage) {
      console.log('User has preferred language, not auto-switching');
      return;
    }

    const language = currencyLanguageMap[currency] || 'en';
    changeLanguage(language, false); // Don't mark as user action
  };

  const changeLanguageByCountry = (country) => {
    // Only auto-switch language if user hasn't manually selected a language
    if (userPreferredLanguage) {
      return;
    }

    const language = countryLanguageMap[country] || 'en';
    changeLanguage(language, false); // Don't mark as user action
  };

  const resetLanguagePreference = () => {
    setUserPreferredLanguage(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userPreferredLanguage');
    }
  };

  const value = {
    currentLanguage,
    direction,
    changeLanguage,
    changeLanguageByCurrency,
    changeLanguageByCountry,
    resetLanguagePreference,
    isRTL: direction === 'rtl',
    isInitialized,
    hasUserPreference: userPreferredLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { currencyLanguageMap, countryLanguageMap };
