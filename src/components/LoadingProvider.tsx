'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoader } from './PageLoader';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show loader for navigation, not initial page load
    if (pathname) {
      setIsLoading(true);
      
      // Hide loader after a short delay to allow page to render
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Reduced from 500ms to 300ms

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Also add an effect to ensure loader is hidden after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      <PageLoader />
    </LoadingContext.Provider>
  );
} 