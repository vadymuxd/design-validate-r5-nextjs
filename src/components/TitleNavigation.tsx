'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from './LoadingProvider';

const pages = [
  { href: '/tools', label: 'Tools' },
  { href: '/methods', label: 'Methods' },
  { href: '/measures', label: 'Measures' },
  { href: '/frameworks', label: 'Frameworks' },
  { href: '/cases', label: 'Cases' },
];

export function TitleNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setLoading } = useLoading();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((p) => p.href === pathname);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (href: string) => {
    setIsOpen(false);
    setHoveredItem(null);
    setLoading(true);
    router.push(href);
  };

  const handleMenuItemHover = (href: string) => {
    setHoveredItem(href);
  };

  const handleMenuItemLeave = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    setShowLogo(true);
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
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-90 z-40"></div>}
      
      <div 
        ref={containerRef}
        className="relative flex flex-col items-center gap-4 z-50"
      >
          <div className="w-[60px] h-[60px] flex items-center justify-center">
              {showLogo && (
              <div className="logo-animate w-full h-full">
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
              {currentPage && (
                <span 
                  className={`cursor-pointer ${hoveredItem ? 'text-white' : 'text-[#FF3654]'}`}
                  onClick={handleClick}
                >
                  {isOpen ? currentPage.label : `/ ${currentPage.label}`}
                </span>
              )}
          </h1>

        {isOpen && (
          <div className="absolute top-full flex flex-col items-center z-50 pt-4 pb-8 px-8 w-fit">
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