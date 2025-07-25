'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const pages = [
  { href: '/methods', label: 'Methods' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/tools', label: 'Tools' },
  { href: '/frameworks', label: 'Frameworks' },
  { href: '/cases', label: 'Cases' },
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

  // Helper function to get SVG path based on current page
  const getSvgPath = () => {
    if (!currentPage) return null; // Homepage doesn't have an SVG
    return `/images/Collections/Type=${currentPage.label}, Screen=Desktop.svg`;
  };

  // Helper function to get container size
  const getContainerSize = () => {
    return pathname === '/' ? 60 : 150; // 60px for homepage, 150px for other pages
  };

  // Helper function to check if we should show SVG (not on homepage)
  const shouldShowSvg = () => {
    return pathname !== '/' && currentPage;
  };

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
        className={`relative flex flex-col items-center z-50 ${pathname === '/' ? 'gap-4' : 'gap-0'}`}
      >
        <div 
          className={`flex items-center justify-center cursor-pointer`}
          style={{ width: `${getContainerSize()}px`, height: `${getContainerSize()}px` }}
          onClick={handleLogoClick}
          title={contentLoaded ? 'Go to homepage' : undefined}
        >
          {showLogo && (
            <div className="w-full h-full">
              {shouldShowSvg() ? (
                <Image
                  src={getSvgPath()!}
                  alt={currentPage?.label || ''}
                  width={150}
                  height={150}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-[60px] h-[30px] overflow-hidden">
                    {/* Red "D" layer (bottom) - animated from bottom */}
                    <div className={`absolute inset-0 z-10 ${contentLoaded ? 'logo-animate' : ''}`}>
                      <Image
                        src="/logo/Logo-p2-red-d.svg"
                        alt="Design Validate Logo Red D"
                        width={60}
                        height={60}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    {/* Black "V" layer (top) - static */}
                    <div className="absolute inset-0 z-20">
                      <Image
                        src="/logo/Logo-p1-black-v.svg"
                        alt="Design Validate Logo Black V"
                        width={60}
                        height={60}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <h1 className="font-['Bai_Jamjuree'] font-bold text-[40px] text-center flex flex-wrap items-center justify-center gap-x-2">
            {!isOpen && (
              <span className="text-white">
                {pathname === '/' ? 'Design. Validate' : 'Validate'}
              </span>
            )}
            {showNav && currentPage && (
              <span 
                className={`cursor-pointer ${hoveredItem ? 'text-white' : 'text-[#FF3654]'} font-['Bai_Jamjuree']`}
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
              className={`font-['Bai_Jamjuree'] font-bold text-[40px] py-1 whitespace-nowrap cursor-pointer ${
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