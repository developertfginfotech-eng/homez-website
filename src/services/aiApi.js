/**
 * AI Features API Service
 * Handles all AI-powered features API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const handleError = async (response, fallback) => {
  const error = await response.json().catch(() => ({}));
  const msg = error.message || '';
  if (response.status === 429 || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('429')) {
    throw new Error('AI is temporarily busy. Please wait a moment and try again.');
  }
  throw new Error(msg || fallback);
};

export const aiAPI = {
  generateDescription: async (propertyData) => {
    const response = await fetch(`${API_URL}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) return handleError(response, 'Failed to generate description');
    return response.json();
  },

  autoUpdateDescription: async (propertyId, token) => {
    const response = await fetch(`${API_URL}/ai/auto-update-description/${propertyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) return handleError(response, 'Failed to update description');
    return response.json();
  },

  getRecommendations: async (preferences = {}) => {
    const params = new URLSearchParams();
    if (preferences.minBudget) params.append('minBudget', preferences.minBudget);
    if (preferences.maxBudget) params.append('maxBudget', preferences.maxBudget);
    if (preferences.locations?.length) params.append('locations', preferences.locations.join(','));
    if (preferences.propertyTypes?.length) params.append('propertyTypes', preferences.propertyTypes.join(','));

    const url = `${API_URL}/ai/recommendations${params.toString() ? '?' + params.toString() : ''}`;
    const headers = { 'Content-Type': 'application/json' };
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { headers });
    if (!response.ok) return handleError(response, 'Failed to get recommendations');
    return response.json();
  },

  matchAgents: async (buyerProfile) => {
    const response = await fetch(`${API_URL}/ai/match-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyerProfile),
    });
    if (!response.ok) return handleError(response, 'Failed to match agents');
    return response.json();
  },

  generateAutoResponse: async (inquiryData) => {
    const response = await fetch(`${API_URL}/ai/auto-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    if (!response.ok) return handleError(response, 'Failed to generate response');
    return response.json();
  },

  batchGenerateDescriptions: async (propertyIds, token) => {
    const response = await fetch(`${API_URL}/ai/batch-generate-descriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ propertyIds }),
    });
    if (!response.ok) return handleError(response, 'Failed to batch generate descriptions');
    return response.json();
  },

  getPropertyValuation: async (propertyId) => {
    const response = await fetch(`${API_URL}/ai/property-valuation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });
    if (!response.ok) return handleError(response, 'Failed to get property valuation');
    return response.json();
  },

  getInvestmentScore: async (propertyId) => {
    const response = await fetch(`${API_URL}/ai/investment-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });
    if (!response.ok) return handleError(response, 'Failed to get investment score');
    return response.json();
  },

  enhanceImage: async (imageBase64, enhancement = 'enhance') => {
    const response = await fetch(`${API_URL}/ai/enhance-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, enhancement }),
    });
    if (!response.ok) return handleError(response, 'Failed to enhance image');
    return response.json();
  },

  enhanceImageMulti: async (imageBase64, types = ['enhance', 'improve', 'sky', 'declutter']) => {
    const response = await fetch(`${API_URL}/ai/enhance-image-multi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, types }),
    });
    if (!response.ok) return handleError(response, 'Failed to generate enhancements');
    return response.json();
  },

  getCrossCountryMatches: async (propertyId, limitPerCountry = 3) => {
    const response = await fetch(`${API_URL}/ai/cross-country-match/${propertyId}?limit=${limitPerCountry}`);
    if (!response.ok) return handleError(response, 'Failed to get cross-country matches');
    return response.json();
  },

  transcribeVoice: async (audioBase64, mimeType = 'audio/webm') => {
    const response = await fetch(`${API_URL}/ai/transcribe-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType }),
    });
    if (!response.ok) return handleError(response, 'Failed to transcribe voice');
    return response.json();
  },

  // AI Negotiation Strategy — returns recommended offer, walk-away price, leverage points, opening script
  getNegotiationStrategy: async ({ propertyId, buyerBudget, initialOffer, role = 'buyer' }) => {
    const response = await fetch(`${API_URL}/ai/negotiation-strategy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, buyerBudget, initialOffer, role }),
    });
    if (!response.ok) return handleError(response, 'Failed to generate negotiation strategy');
    return response.json();
  },

  // AI Fraud Detection — detects duplicate images and listing anomalies
  detectFraud: async ({ images = [], propertyName, propertyType, city, price, agentId }, token) => {
    const response = await fetch(`${API_URL}/ai/detect-fraud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ images, propertyName, propertyType, city, price, agentId }),
    });
    if (!response.ok) return handleError(response, 'Failed to run fraud detection');
    return response.json();
  },
};

export default aiAPI;
