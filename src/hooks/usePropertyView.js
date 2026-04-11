import { useEffect } from 'react';
import { propertiesAPI } from '@/services/api';

/**
 * Custom hook to track property views
 * Call this hook in any property detail page component
 * @param {string} propertyId - The ID of the property being viewed
 */
export const usePropertyView = (propertyId) => {
  useEffect(() => {
    if (!propertyId) return;

    const trackView = async () => {
      try {
        await propertiesAPI.trackView(propertyId);
        console.log(`✅ Property view tracked for ID: ${propertyId}`);
      } catch (error) {
        console.error('Failed to track property view:', error);
        // Fail silently - view tracking shouldn't disrupt user experience
      }
    };

    // Track view after a short delay to ensure it's a real view
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [propertyId]);
};
