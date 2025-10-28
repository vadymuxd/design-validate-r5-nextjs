import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking';

interface CollectionCardProps {
  title: string;
  href: string;
  count?: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  href,
  count,
}) => {
  const { trackCollectionCard } = useAnalyticsTracking();
  
  // Check if count data is available
  const isCountLoaded = count !== undefined && count !== null;
  
  // Determine which SVG to use based on title and screen size
  const getSvgPath = (title: string, isMobile: boolean = false) => {
    const screen = isMobile ? 'Mobile' : 'Desktop';
    return `/images/Collections/Type=${title}, Screen=${screen}.svg`;
  };

  // Map title to valid analytics value
  const getAnalyticsValue = (title: string) => {
    const titleLower = title.toLowerCase();
    if (['methods', 'metrics', 'tools', 'frameworks', 'cases'].includes(titleLower)) {
      return titleLower as 'methods' | 'metrics' | 'tools' | 'frameworks' | 'cases';
    }
    return 'methods'; // fallback
  };

  const handleClick = async (e: React.MouseEvent) => {
    // Track the analytics event
    const analyticsValue = getAnalyticsValue(title);
    await trackCollectionCard(analyticsValue);
    
    // Let the Link component handle the navigation
  };

  return (
    <Link
      href={href}
      className="group w-full"
      onClick={handleClick}
    >
      {/* Desktop Layout - 1 column design */}
      <div 
        className="hidden sm:flex flex-col w-[200px] h-auto overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #41444D 0%, #172129 100%)',
          paddingTop: '1px',
          paddingRight: '0px',
          paddingBottom: '1px',
          paddingLeft: '1px'
        }}
      >
        <div className="w-full h-full bg-[var(--color-black-lighter)] flex flex-col transition-all duration-200 hover:bg-[var(--color-grey-darkest)]">
          {/* Top: Counter */}
          <div className="pt-12 text-center">
            <div className="w-[20px] mx-auto flex justify-center">
              {/* Fixed-height wrapper to prevent layout shift while loading */}
              <div className="h-[22px] flex items-center justify-center">
                {isCountLoaded ? (
                  <span 
                    className="label-default text-[var(--color-grey-dark)] animate-fadeIn"
                  >
                    {count.toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Middle: SVG Image */}
          <div className="flex justify-center">
            <Image
              src={getSvgPath(title, false)}
              alt={title}
              width={160}
              height={160}
              className="w-[160px] h-[160px] object-contain"
            />
          </div>
          
          {/* Bottom: Collection Name */}
          <div className="pb-12 text-center">
            <h3 className="h3 text-white">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile Layout - 1 line design */}
      <div 
        className="flex sm:hidden flex-row items-center w-full h-[80px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #41444D 0%, #172129 100%)',
          paddingTop: '1px',
          paddingRight: '1px',
          paddingBottom: '0px',
          paddingLeft: '1px'
        }}
      >
        <div className="w-full h-full bg-[var(--color-black-lighter)] flex flex-row items-center transition-all duration-200 hover:bg-[var(--color-grey-darkest)]">
          {/* Left: Counter */}
          <div className="flex items-center justify-center px-4 flex-shrink-0">
            <div className="w-[20px] flex justify-center">
              {/* Fixed-height wrapper to prevent layout shift while loading */}
              <div className="h-[22px] flex items-center justify-center">
                {isCountLoaded ? (
                  <span 
                    className="label-default text-[var(--color-grey-dark)] animate-fadeIn"
                  >
                    {count.toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Middle: SVG Image */}
          <div className="flex items-center justify-center px-4 flex-shrink-0">
            <Image
              src={getSvgPath(title, true)}
              alt={title}
              width={80}
              height={80}
              className="w-[80px] h-[80px] object-contain"
            />
          </div>
          
          {/* Right: Collection Name */}
          <div className="flex-grow flex items-center px-4">
            <h3 className="h3 text-white">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard; 