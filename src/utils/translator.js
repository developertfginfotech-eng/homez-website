/**
 * Auto-translate text content for property data
 * This utility handles translation of dynamic content (property names, descriptions, etc.)
 */

// Configuration
const ENABLE_AUTO_TRANSLATION = true; // Set to false to disable API-based auto-translation

// MyMemory API email for higher rate limit (50,000 chars/day vs 5,000 anonymous)
const MYMEMORY_EMAIL = process.env.NEXT_PUBLIC_MYMEMORY_EMAIL || '';

// Persistent cache using localStorage
const CACHE_KEY = 'translation_cache';
const CACHE_VERSION = 'v1';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Load cache from localStorage
function loadCache() {
  if (typeof window === 'undefined') return new Map();

  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const { version, data, timestamp } = JSON.parse(stored);
      if (version === CACHE_VERSION && Date.now() - timestamp < CACHE_EXPIRY) {
        return new Map(Object.entries(data));
      }
    }
  } catch (error) {
    console.warn('Failed to load translation cache:', error);
  }
  return new Map();
}

// Save cache to localStorage
function saveCache(cache) {
  if (typeof window === 'undefined') return;

  try {
    const data = Object.fromEntries(cache);
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      version: CACHE_VERSION,
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to save translation cache:', error);
  }
}

const translationCache = loadCache();

// Rate limiting: Track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // Reduced to 100ms for better performance

// Helper function to add delay for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Translate text using a translation service
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (ar, pt, tr)
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang, sourceLang = 'en') {
  // Return original text if auto-translation is disabled
  if (!ENABLE_AUTO_TRANSLATION) {
    return text;
  }

  // Return original text if target is English or same as source
  if (!text || targetLang === 'en' || targetLang === sourceLang) {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // Rate limiting: Ensure minimum interval between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();

  try {
    // Build API URL with email parameter for higher rate limit (50,000 chars/day)
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    if (MYMEMORY_EMAIL) {
      apiUrl += `&de=${encodeURIComponent(MYMEMORY_EMAIL)}`;
    }

    // Using MyMemory Translation API (Free, no API key required)
    // With email: 50,000 chars/day | Anonymous: 5,000 chars/day
    const response = await fetch(apiUrl, {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      console.warn('Translation API returned non-OK status:', response.status);
      // Return original text instead of throwing error
      return text;
    }

    const data = await response.json();

    // Check if translation was successful
    if (data.responseStatus !== 200 && data.responseStatus !== '200') {
      console.warn('Translation service error:', data.responseMessage);
      return text;
    }

    const translatedText = data.responseData.translatedText;

    // Cache the translation in memory and localStorage
    translationCache.set(cacheKey, translatedText);
    saveCache(translationCache);

    return translatedText;
  } catch (error) {
    // Silently fail and return original text
    console.warn('Translation failed, using original text:', error.message);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Batch translate multiple texts in one API call
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code
 * @returns {Promise<Array<string>>} Array of translated texts
 */
async function batchTranslateTexts(texts, targetLang, sourceLang = 'en') {
  if (!texts || texts.length === 0 || targetLang === 'en') {
    return texts;
  }

  // Filter out empty texts and track their indices
  const nonEmptyTexts = [];
  const indices = [];
  texts.forEach((text, index) => {
    if (text) {
      nonEmptyTexts.push(text);
      indices.push(index);
    }
  });

  if (nonEmptyTexts.length === 0) {
    return texts;
  }

  // Check cache first
  const cachedResults = [];
  const textsToTranslate = [];
  const translateIndices = [];

  nonEmptyTexts.forEach((text, i) => {
    const cacheKey = `${text}_${sourceLang}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
      cachedResults[i] = translationCache.get(cacheKey);
    } else {
      textsToTranslate.push(text);
      translateIndices.push(i);
    }
  });

  // If all cached, return immediately
  if (textsToTranslate.length === 0) {
    const result = [...texts];
    nonEmptyTexts.forEach((text, i) => {
      result[indices[i]] = cachedResults[i];
    });
    return result;
  }

  // Translate uncached texts one by one (MyMemory doesn't support batch)
  const translatedTexts = await Promise.all(
    textsToTranslate.map(text => translateText(text, targetLang, sourceLang))
  );

  // Combine cached and newly translated results
  const finalResults = [...texts];
  translateIndices.forEach((cacheIndex, i) => {
    const originalIndex = indices[cacheIndex];
    finalResults[originalIndex] = translatedTexts[i];
  });

  Object.keys(cachedResults).forEach((key) => {
    const cacheIndex = parseInt(key);
    const originalIndex = indices[cacheIndex];
    finalResults[originalIndex] = cachedResults[cacheIndex];
  });

  return finalResults;
}

/**
 * Translate an object's string properties
 * @param {Object} obj - Object with properties to translate
 * @param {Array<string>} fields - Array of field names to translate
 * @param {string} targetLang - Target language
 * @returns {Promise<Object>} Object with translated fields
 */
export async function translateObject(obj, fields, targetLang) {
  if (!obj || targetLang === 'en') {
    return obj;
  }

  const translatedObj = { ...obj };

  // Collect all texts to translate
  const textsToTranslate = fields.map(field => obj[field] || '');

  // Batch translate all texts
  const translatedTexts = await batchTranslateTexts(textsToTranslate, targetLang);

  // Map results back to fields
  fields.forEach((field, index) => {
    if (obj[field]) {
      translatedObj[field] = translatedTexts[index];
    }
  });

  return translatedObj;
}

/**
 * Translate an array of objects
 * @param {Array} array - Array of objects to translate
 * @param {Array<string>} fields - Fields to translate in each object
 * @param {string} targetLang - Target language
 * @returns {Promise<Array>} Array with translated objects
 */
export async function translateArray(array, fields, targetLang) {
  if (!array || !array.length || targetLang === 'en') {
    return array;
  }

  return Promise.all(
    array.map((item) => translateObject(item, fields, targetLang))
  );
}

/**
 * Clear translation cache (both memory and localStorage)
 */
export function clearTranslationCache() {
  translationCache.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CACHE_KEY);
  }
}
