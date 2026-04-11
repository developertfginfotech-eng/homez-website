"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText, translateObject, translateArray } from '@/utils/translator';

/**
 * Custom hook for translations
 * Handles both UI translations (i18n) and dynamic content (API data)
 */
export function useTranslate() {
  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguage();

  return {
    // Translate UI labels (from translation files)
    t,

    // Translate dynamic text (from API)
    translateText: (text) => translateText(text, currentLanguage),

    // Translate object fields
    translateObject: (obj, fields) => translateObject(obj, fields, currentLanguage),

    // Translate array of objects
    translateArray: (array, fields) => translateArray(array, fields, currentLanguage),

    // Current language
    currentLanguage,
  };
}

/**
 * Hook to automatically translate API data
 * @param {Object|Array} data - Data to translate
 * @param {Array<string>} fields - Fields to translate
 * @returns {Object} { data: translatedData, isTranslating: boolean }
 */
export function useAutoTranslate(data, fields = []) {
  const { currentLanguage } = useLanguage();
  // Start with original data immediately to avoid blank screen
  const [translatedData, setTranslatedData] = useState(data);
  const [isTranslating, setIsTranslating] = useState(false);

  // Create stable references for dependencies
  const dataString = useMemo(() => JSON.stringify(data), [data]);
  const fieldsString = useMemo(() => JSON.stringify(fields), [fields]);

  useEffect(() => {
    async function translate() {
      // Skip translation if no data or language is English
      if (!data || data.length === 0 || currentLanguage === 'en') {
        setTranslatedData(data);
        setIsTranslating(false);
        return;
      }

      // Set original data immediately so UI shows content
      setTranslatedData(data);
      setIsTranslating(true);

      try {
        let result;
        if (Array.isArray(data)) {
          result = await translateArray(data, fields, currentLanguage);
        } else {
          result = await translateObject(data, fields, currentLanguage);
        }
        setTranslatedData(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedData(data); // Fallback to original data
      } finally {
        setIsTranslating(false);
      }
    }

    translate();
  }, [dataString, currentLanguage, fieldsString]); // Use stringified versions

  return { data: translatedData, isTranslating };
}
