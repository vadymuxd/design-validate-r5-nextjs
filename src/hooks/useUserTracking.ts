'use client';

import { useEffect, useRef } from 'react';

interface UserTrackingResult {
  success: boolean;
  userId?: number;
  isNewUser?: boolean;
  message?: string;
  error?: string;
}

interface UseUserTrackingOptions {
  enabled?: boolean; // Allow disabling the tracking
  debug?: boolean; // Enable debug logging
}

export function useUserTracking(options: UseUserTrackingOptions = {}) {
  const { enabled = true, debug = false } = options;
  const hasTracked = useRef(false);
  const isTracking = useRef(false);

  useEffect(() => {
    // Only track once per session and if enabled
    if (!enabled || hasTracked.current || isTracking.current) {
      return;
    }

    // Set tracking flag to prevent multiple simultaneous calls
    isTracking.current = true;

    const trackUser = async () => {
      try {
        if (debug) {
          console.log('🔍 Starting user tracking...');
        }

        const response = await fetch('/api/user-tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: UserTrackingResult = await response.json();

        if (response.ok) {
          if (debug) {
            console.log('✅ User tracking successful:', result);
          }
          
          // Mark as tracked successfully
          hasTracked.current = true;
          
          // Optional: Store user info in localStorage for debugging
          if (debug && result.userId) {
            localStorage.setItem('dv_user_id', result.userId.toString());
            localStorage.setItem('dv_is_new_user', result.isNewUser?.toString() || 'false');
          }
        } else {
          if (debug) {
            console.error('❌ User tracking failed:', result.error);
          }
        }
      } catch (error) {
        if (debug) {
          console.error('❌ User tracking error:', error);
        }
      } finally {
        // Reset tracking flag
        isTracking.current = false;
      }
    };

    // Track user after a small delay to ensure the page has loaded
    const timeoutId = setTimeout(trackUser, 1000);

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
      isTracking.current = false;
    };
  }, [enabled, debug]);

  return {
    hasTracked: hasTracked.current,
    isTracking: isTracking.current,
  };
}

// Alternative hook that provides more control and returns tracking result
export function useUserTrackingWithResult(options: UseUserTrackingOptions = {}) {
  const { enabled = true, debug = false } = options;
  const hasTracked = useRef(false);
  const isTracking = useRef(false);

  const trackUser = async (): Promise<UserTrackingResult | null> => {
    if (!enabled || hasTracked.current || isTracking.current) {
      return null;
    }

    isTracking.current = true;

    try {
      if (debug) {
        console.log('🔍 Starting manual user tracking...');
      }

      const response = await fetch('/api/user-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: UserTrackingResult = await response.json();

      if (response.ok) {
        if (debug) {
          console.log('✅ Manual user tracking successful:', result);
        }
        
        hasTracked.current = true;
        
        if (debug && result.userId) {
          localStorage.setItem('dv_user_id', result.userId.toString());
          localStorage.setItem('dv_is_new_user', result.isNewUser?.toString() || 'false');
        }
      } else {
        if (debug) {
          console.error('❌ Manual user tracking failed:', result.error);
        }
      }

      return result;
    } catch (error) {
      if (debug) {
        console.error('❌ Manual user tracking error:', error);
      }
      return {
        success: false,
        error: 'Network error'
      };
    } finally {
      isTracking.current = false;
    }
  };

  return {
    trackUser,
    hasTracked: hasTracked.current,
    isTracking: isTracking.current,
  };
}
