import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CollectionCardProps {
  title: string;
  href: string;
  count?: number;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  href,
  count = 0,
}) => {
  // Determine which SVG to use based on title and screen size
  const getSvgPath = (title: string, isMobile: boolean = false) => {
    const screen = isMobile ? 'Mobile' : 'Desktop';
    return `/images/Collections/Type=${title}, Screen=${screen}.svg`;
  };

  return (
    <Link
      href={href}
      className="group w-full"
    >
      {/* Desktop Layout - 1 column design */}
      <div className="hidden sm:flex flex-col w-[200px] h-auto bg-[var(--color-black-lighter)] border border-[var(--color-grey-dark)] overflow-hidden transition-all duration-200 hover:bg-[var(--color-grey-darkest)]">
        {/* Top: Counter */}
        <div className="pt-12 text-center">
          <div className="w-[20px] mx-auto flex justify-center">
            <span className="label-default text-[var(--color-grey-dark)]">
              {count.toLocaleString()}
            </span>
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

      {/* Mobile Layout - 1 line design */}
      <div className="flex sm:hidden flex-row items-center w-full h-[80px] bg-[var(--color-black-lighter)] border border-[var(--color-grey-dark)] overflow-hidden transition-all duration-200 hover:bg-[var(--color-grey-darkest)]">
        {/* Left: Counter */}
        <div className="flex items-center justify-center px-4 flex-shrink-0">
          <div className="w-[20px] flex justify-center">
            <span className="label-default text-[var(--color-grey-dark)]">
              {count.toLocaleString()}
            </span>
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
    </Link>
  );
};

export default CollectionCard; 