import { useCallback } from 'react';

interface TrackAnalyticsParams {
  component: 'CollectionCard' | 'TitleNavigation' | 'TopNav';
  value: 'methods' | 'metrics' | 'tools' | 'frameworks' | 'cases';
  url?: string;
}

interface AnalyticsResponse {
  success: boolean;
  error?: string;
}

export const useAnalyticsTracking = () => {
  const trackEvent = useCallback(async ({ 
    component, 
    value, 
    url 
  }: TrackAnalyticsParams): Promise<AnalyticsResponse> => {
    try {
      // Use current URL if not provided
      const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
      
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component,
          value,
          url: currentUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Analytics tracking failed:', errorData);
        return {
          success: false,
          error: errorData.error || 'Failed to track event'
        };
      }

      const data = await response.json();
      console.log('Analytics event tracked:', data);
      
      return {
        success: true
      };

    } catch (error) {
      console.error('Analytics tracking error:', error);
      return {
        success: false,
        error: 'Network error while tracking event'
      };
    }
  }, []);

  // Helper functions for specific components
  const trackCollectionCard = useCallback((value: TrackAnalyticsParams['value'], url?: string) => {
    return trackEvent({ component: 'CollectionCard', value, url });
  }, [trackEvent]);

  const trackTitleNavigation = useCallback((value: TrackAnalyticsParams['value'], url?: string) => {
    return trackEvent({ component: 'TitleNavigation', value, url });
  }, [trackEvent]);

  const trackTopNav = useCallback((value: TrackAnalyticsParams['value'], url?: string) => {
    return trackEvent({ component: 'TopNav', value, url });
  }, [trackEvent]);

  return {
    trackEvent,
    trackCollectionCard,
    trackTitleNavigation,
    trackTopNav,
  };
};