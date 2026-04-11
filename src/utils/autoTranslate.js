/**
 * Auto Translation Utility for API Data
 * Translates dynamic content from API based on selected language
 */

// Translation cache to avoid repeated API calls
const translationCache = new Map();

/**
 * Get translation using Google Translate API (or any translation service)
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (ar, pt, tr, en)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang = 'en') {
  // If target language is English or text is empty, return as is
  if (!text || targetLang === 'en') {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // Using LibreTranslate (free, self-hosted option)
    // You can replace this with Google Translate API or any other service
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    });

    const data = await response.json();
    const translatedText = data.translatedText || text;

    // Cache the translation
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate property object fields
 * @param {Object} property - Property object from API
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} Translated property object
 */
export async function translateProperty(property, targetLang = 'en') {
  if (!property || targetLang === 'en') {
    return property;
  }

  try {
    const fieldsToTranslate = [
      'title',
      'name',
      'description',
      'address',
      'city',
      'features',
      'amenities',
    ];

    const translatedProperty = { ...property };

    // Translate each field
    for (const field of fieldsToTranslate) {
      if (property[field]) {
        if (Array.isArray(property[field])) {
          // Translate array of strings
          translatedProperty[field] = await Promise.all(
            property[field].map(item => translateText(item, targetLang))
          );
        } else if (typeof property[field] === 'string') {
          // Translate string
          translatedProperty[field] = await translateText(property[field], targetLang);
        }
      }
    }

    return translatedProperty;
  } catch (error) {
    console.error('Error translating property:', error);
    return property;
  }
}

/**
 * Translate array of properties
 * @param {Array} properties - Array of property objects
 * @param {string} targetLang - Target language code
 * @returns {Promise<Array>} Translated properties array
 */
export async function translateProperties(properties, targetLang = 'en') {
  if (!properties || !Array.isArray(properties) || targetLang === 'en') {
    return properties;
  }

  try {
    return await Promise.all(
      properties.map(property => translateProperty(property, targetLang))
    );
  } catch (error) {
    console.error('Error translating properties:', error);
    return properties;
  }
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}

/**
 * Alternative: Using Google Translate API (requires API key)
 * Uncomment and use this if you have Google Cloud Translation API key
 */
/*
export async function translateTextGoogle(text, targetLang = 'en') {
  if (!text || targetLang === 'en') return text;

  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    });

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
*/
