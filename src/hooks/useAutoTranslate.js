/**
 * Custom Hook for Auto-Translation of API Data
 * Use this hook to automatically translate dynamic content from APIs
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText, translateProperty, translateProperties } from '@/utils/autoTranslate';

/**
 * Hook to auto-translate text based on current language
 * @param {string} text - Text to translate
 * @returns {string} Translated text
 */
export function useAutoTranslateText(text) {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!text) return;

    const translate = async () => {
      setIsTranslating(true);
      try {
        const result = await translateText(text, currentLanguage);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [text, currentLanguage]);

  return { translatedText, isTranslating };
}

/**
 * Hook to auto-translate a property object
 * @param {Object} property - Property object to translate
 * @returns {Object} Translated property object
 */
export function useAutoTranslateProperty(property) {
  const { currentLanguage } = useLanguage();
  const [translatedProperty, setTranslatedProperty] = useState(property);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!property) return;

    const translate = async () => {
      setIsTranslating(true);
      try {
        const result = await translateProperty(property, currentLanguage);
        setTranslatedProperty(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedProperty(property);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [property, currentLanguage]);

  return { translatedProperty, isTranslating };
}

/**
 * Hook to auto-translate array of properties
 * @param {Array} properties - Array of properties to translate
 * @returns {Array} Translated properties array
 */
export function useAutoTranslateProperties(properties) {
  const { currentLanguage } = useLanguage();
  const [translatedProperties, setTranslatedProperties] = useState(properties);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!properties || !Array.isArray(properties)) return;

    const translate = async () => {
      setIsTranslating(true);
      try {
        const result = await translateProperties(properties, currentLanguage);
        setTranslatedProperties(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedProperties(properties);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [properties, currentLanguage]);

  return { translatedProperties, isTranslating };
}
