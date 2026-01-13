'use client';

import { useState, useEffect } from 'react';

/**
 * Custom React hook to fetch KYC requirements for a specific country and account type
 * @param {string} country - Country code/name (e.g., 'UAE', 'USA')
 * @param {string} accountType - Account type (e.g., 'property_owner', 'real_estate_agent')
 * @returns {object} { requirements, loading, error }
 */
export const useKYCRequirements = (country, accountType) => {
  const [requirements, setRequirements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if country or accountType not provided
    if (!country || !accountType) {
      setRequirements(null);
      setError(null);
      return;
    }

    const fetchRequirements = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
        const response = await fetch(
          `${API_URL}/kyc/requirements?country=${encodeURIComponent(country)}&accountType=${encodeURIComponent(accountType)}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch requirements (status: ${response.status})`);
        }

        const data = await response.json();
        setRequirements(data.requirements || null);
      } catch (err) {
        console.error('Error fetching KYC requirements:', err);
        setError(err.message || 'Failed to load requirements');
        setRequirements(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [country, accountType]);

  return { requirements, loading, error };
};

export default useKYCRequirements;
