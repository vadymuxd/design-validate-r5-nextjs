'use client';

import React, { useState, useEffect } from 'react';
import LottieAnimation from './LottieAnimation';
import animationData from '../../public/gifs/cube-2.json';

interface PageLoaderProps {
  children: React.ReactNode;
  titleNavigation: React.ReactNode;
  className?: string;
}

export function PageLoader({
  children,
  titleNavigation,
  className = 'bg-black',
}: PageLoaderProps) {
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    const handleContentLoad = () => {
      // Small delay for smoother transition
      const timer = setTimeout(() => setIsContentLoaded(true), 300);
      return () => clearTimeout(timer);
    };

    // Check if the page is already loaded
    if (document.readyState === 'complete') {
      handleContentLoad();
    } else {
      // Wait for all content to load
      window.addEventListener('load', handleContentLoad);
      return () => {
        window.removeEventListener('load', handleContentLoad);
      };
    }
  }, []);

  return (
    <main
      className={`flex flex-col ${className} ${
        !isContentLoaded ? 'min-h-screen' : ''
      }`}
    >
      <div className="flex flex-col items-center py-12 px-4 sm:px-8 gap-8 flex-1">
        {/* TitleNavigation is always visible */}
        {titleNavigation}

        {/* Preloader or Content */}
        {!isContentLoaded ? (
          <div className="flex justify-center items-center h-64">
            <LottieAnimation
              animationData={animationData}
              className="w-full h-auto max-w-[200px]"
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8 animate-fadeIn">
            {children}
          </div>
        )}
      </div>
    </main>
  );
} 