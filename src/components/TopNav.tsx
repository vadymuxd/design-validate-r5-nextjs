"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ChevronIcon = ({ isUp, className }: { isUp: boolean, className?: string }) => {
  const path = isUp ? "M15 14L10 9L5 14" : "M5 11L10 16L15 11";
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} transform -translate-y-px`} 
      width="11" 
      height="11" 
      viewBox="0 0 20 20" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="square" 
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
};

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [isClickOpen, setIsClickOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isClickOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClickOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClickOpen]);

  useEffect(() => {
    if (!isMounted) return;

    const isSpecialPage = pathname === '/about' || pathname === '/community';

    // Set initial visibility based on page type and scroll position
    if (isSpecialPage) {
      setIsVisible(true);
    } else {
      setIsVisible(window.pageYOffset > 150);
    }

    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      setIsClickOpen(false);
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (direction === 'down') {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else { // direction === 'up'
        if (isSpecialPage) {
          setIsVisible(true);
        } else {
          setIsVisible(scrollY > 150);
        }
      }
      
      lastScrollY = scrollY <= 0 ? 0 : scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted, pathname]);

  useEffect(() => {
    if (!isMounted) return;

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isMounted]);

  const dropdownLinks = [
    { href: '/tools', label: 'Tools' },
    { href: '/methods', label: 'Methods' },
    { href: '/measures', label: 'Measures' },
    { href: '/frameworks', label: 'Frameworks' },
    { href: '/cases', label: 'Cases' },
  ];

  const mainLinks = [
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About' },
  ];

  const handleToggleClick = () => {
    setIsClickOpen(prev => !prev);
    setIsHoverOpen(false); 
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-black ${isMenuOpen ? '' : 'border-b border-[var(--color-grey-dark)]'}`}>
        <nav className="px-9 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="relative h-6 w-6">
              <Image
                src="/logo/Vairant=White.svg"
                alt="Design Validate Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsHoverOpen(true)}
              onMouseLeave={() => setIsHoverOpen(false)}
            >
              <button 
                onClick={handleToggleClick}
                className="label-mini text-white hover:text-[var(--color-red)] transition-colors duration-200 flex items-center space-x-1 cursor-pointer group"
              >
                <span>Validate</span>
                <ChevronIcon 
                  isUp={isHoverOpen || isClickOpen}
                  className="transition-colors duration-200 text-white group-hover:text-[var(--color-red)]"
                />
              </button>
              <div 
                className="absolute top-full left-0 pt-2"
                style={{ pointerEvents: (isHoverOpen || isClickOpen) ? 'auto' : 'none' }}
              >
                <div className={`bg-[var(--color-grey-dark)] border border-[var(--color-grey-dark)] rounded-md shadow-lg py-2 z-10 w-40 transform transition-all duration-300 ease-out ${
                  (isHoverOpen || isClickOpen) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 -translate-y-2 scale-95'
                }`}>
                  {dropdownLinks.map(link => (
                    <Link key={link.href} href={link.href}>
                      <span onClick={() => setIsClickOpen(false)} className={`block px-4 py-2 label-mini text-white hover:text-[var(--color-red)] ${pathname === link.href ? 'text-[var(--color-red)]' : ''}`}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {mainLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <span className={`label-mini text-white hover:text-[var(--color-red)] transition-colors duration-200 ${pathname === link.href ? 'text-[var(--color-red)]' : ''}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative z-50 h-8 w-8 text-white focus:outline-none">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45' : '-translate-y-2'
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45' : 'translate-y-2'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </nav>
      </header>
      <div className="h-16"></div> {/* Spacer for the fixed header, always rendered */}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black z-[59] flex flex-col transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="pt-[4.5rem] flex-grow overflow-y-auto">
          <div className="px-9 pb-12">
            <div className="flex flex-col items-start gap-2.5">
              {dropdownLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="h1 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 px-9 py-12 bg-[var(--color-grey-dark)]">
          <div className="flex flex-col items-start gap-2.5">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="h1 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNav; 