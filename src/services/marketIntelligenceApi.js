/**
 * Market Intelligence API Service
 * Handles all market intelligence and analytics API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const marketIntelligenceAPI = {
  /**
   * Get market overview statistics
   */
  getMarketOverview: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);

    const response = await fetch(`${API_URL}/market-intelligence/overview?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // No data for this location — return empty overview instead of crashing
      if (error.message && (
        error.message.includes('No properties found') ||
        error.message.includes('No data') ||
        error.message.includes('not found')
      )) {
        return {
          success: true,
          data: {
            totalListings: 0,
            newListings30Days: 0,
            avgPrice: 0,
            medianPrice: 0,
            minPrice: 0,
            maxPrice: 0,
            avgPricePerSqft: 0,
            distribution: { propertyTypes: {}, adTypes: { rent: 0, resale: 0 } },
            growth: { priceGrowth: 0, listingGrowth: 0 },
          },
        };
      }
      throw new Error(error.message || 'Failed to fetch market overview');
    }

    return response.json();
  },

  /**
   * Get price trends over time
   */
  getPriceTrends: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.months) params.append('months', filters.months);

    const response = await fetch(`${API_URL}/market-intelligence/price-trends?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // If no properties found, return empty data instead of throwing error
      if (error.message && error.message.includes('No properties found')) {
        return {
          success: true,
          data: {
            trends: [],
            summary: {
              direction: 'stable',
              changePercent: 0,
              totalListings: 0,
              period: 'No data available'
            }
          }
        };
      }
      throw new Error(error.message || 'Failed to fetch price trends');
    }

    return response.json();
  },

  /**
   * Get hot investment areas
   */
  getHotAreas: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`${API_URL}/market-intelligence/hot-areas?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // If no properties found, return empty data instead of throwing error
      if (error.message && error.message.includes('No properties found')) {
        return {
          success: true,
          data: {
            hotAreas: []
          }
        };
      }
      throw new Error(error.message || 'Failed to fetch hot areas');
    }

    return response.json();
  },

  /**
   * Compare multiple cities
   */
  compareCities: async (cities) => {
    const response = await fetch(`${API_URL}/market-intelligence/compare-cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cities }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to compare cities');
    }

    return response.json();
  },

  /**
   * Get investment hotspots with AI analysis
   */
  getInvestmentHotspots: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.budget) params.append('budget', filters.budget);

    const response = await fetch(`${API_URL}/market-intelligence/investment-hotspots?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // If no properties found, return empty data instead of throwing error
      if (error.message && error.message.includes('No properties found')) {
        return {
          success: true,
          data: {
            hotspots: [],
            summary: {
              totalAreas: 0,
              avgROI: 0
            }
          }
        };
      }
      throw new Error(error.message || 'Failed to fetch investment hotspots');
    }

    return response.json();
  },

  /**
   * Get market forecast with AI predictions
   */
  getMarketForecast: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.state) params.append('state', filters.state);
    if (filters.city) params.append('city', filters.city);
    if (filters.months) params.append('months', filters.months);

    const response = await fetch(`${API_URL}/market-intelligence/forecast?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // If no properties found, return empty data instead of throwing error
      if (error.message && error.message.includes('No properties found')) {
        return {
          success: true,
          data: {
            forecasts: [],
            summary: {
              predictedTrend: 'stable',
              confidence: 0
            }
          }
        };
      }
      throw new Error(error.message || 'Failed to fetch market forecast');
    }

    return response.json();
  },
};

export default marketIntelligenceAPI;
