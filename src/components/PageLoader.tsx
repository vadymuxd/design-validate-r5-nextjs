'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PageLoaderProps {
  children: React.ReactNode;
  titleNavigation: React.ReactNode;
}

export function PageLoader({ children, titleNavigation }: PageLoaderProps) {
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
    <main className="min-h-screen flex flex-col bg-black">
      <div className="flex flex-col items-center py-12 px-4 sm:px-8 gap-8 flex-1">
        {/* TitleNavigation is always visible */}
        {titleNavigation}

        {/* Preloader or Content */}
        {!isContentLoaded ? (
          <div className="flex justify-center items-center h-64">
            <Image
              src="/gifs/Pi-Slices.gif"
              alt="Loading..."
              width={200}
              height={200}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '200px',
              }}
              unoptimized
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