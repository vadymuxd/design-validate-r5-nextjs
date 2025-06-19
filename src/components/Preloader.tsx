'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PreloaderContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within a Preloader');
  }
  return context;
}

export function Preloader({ children }: { children: React.ReactNode }) {
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
    <PreloaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </PreloaderContext.Provider>
  );
} 