'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const pages = [
  { href: '/tools', label: 'Tools' },
  { href: '/methods', label: 'Methods' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/frameworks', label: 'Frameworks' },
  { href: '/cases', label: 'Cases' },
  { href: '/articles', label: 'Articles' },
];

export function TitleNavigation({ showNav = true }: { showNav?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((p) => p.href === pathname);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (href: string) => {
    setIsOpen(false);
    setHoveredItem(null);
    router.push(href);
  };

  const handleMenuItemHover = (href: string) => {
    setHoveredItem(href);
  };

  const handleMenuItemLeave = () => {
    setHoveredItem(null);
  };

  // Add a click handler for the logo
  const handleLogoClick = () => {
    if (contentLoaded) {
      router.push('/');
    }
  };

  useEffect(() => {
    setShowLogo(true);
  }, []);

  useEffect(() => {
    const handleContentLoad = () => {
      setContentLoaded(true);
    };

    // Check if the page is already loaded
    if (document.readyState === 'complete') {
      setContentLoaded(true);
    } else {
      // Wait for all content to load
      window.addEventListener('load', handleContentLoad);
      return () => {
        window.removeEventListener('load', handleContentLoad);
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredItem(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] z-40"></div>}
      
      <div 
        ref={containerRef}
        className="relative flex flex-col items-center gap-4 z-50"
      >
        <div 
          className="w-[60px] h-[60px] flex items-center justify-center cursor-pointer"
          onClick={handleLogoClick}
          title={contentLoaded ? 'Go to homepage' : undefined}
        >
          {showLogo && (
            <div className={`w-full h-full ${contentLoaded ? 'logo-animate' : ''}`}> 
              <svg
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle cx="30" cy="30" r="30" fill="url(#gradient)" />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="30"
                    y1="0"
                    x2="30"
                    y2="60"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF3654" />
                    <stop offset="1" stopColor="#FF3654" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
        
        <h1 className="font-['Inter'] font-bold text-[40px] text-center flex flex-wrap items-center justify-center gap-x-2">
            {!isOpen && <span className="text-white">Design. Validate</span>}
            {showNav && currentPage && (
              <span 
                className={`cursor-pointer ${hoveredItem ? 'text-white' : 'text-[#FF3654]'}`}
                onClick={handleClick}
              >
                {isOpen ? currentPage.label : `/ ${currentPage.label}`}
              </span>
            )}
        </h1>

      {showNav && (
      <div
        className={`absolute top-full flex flex-col items-center z-50 pt-2 pb-8 px-8 w-fit transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {pages
          .filter((p) => p.href !== pathname)
          .map((page) => (
            <button
              key={page.href} 
              className={`font-['Inter'] font-bold text-[40px] py-1 whitespace-nowrap cursor-pointer ${
                hoveredItem === page.href ? 'text-[#FF3654]' : 'text-white'
              }`}
              onClick={() => handleMenuItemClick(page.href)}
              onMouseEnter={() => handleMenuItemHover(page.href)}
              onMouseLeave={handleMenuItemLeave}
            >
              {page.label}
            </button>
          ))}
      </div>
      )}
    </div>
  </>
);
} 