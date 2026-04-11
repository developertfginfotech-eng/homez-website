"use client";

import { useEffect } from 'react';
import { propertiesAPI } from '@/services/api';

/**
 * Component to track property views
 * Add this component to any property detail page to track views
 */
const ViewTracker = ({ propertyId }) => {
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

  // This component doesn't render anything visible
  return null;
};

export default ViewTracker;
