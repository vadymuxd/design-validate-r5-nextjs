import React from 'react';

interface SubNavigationProps {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
  className?: string;
}

export function SubNavigation({
  items,
  activeItem,
  onItemClick,
  className = '',
}: SubNavigationProps) {
  return (
    <div className={`${className}`}>
      {/* Mobile version */}
      <div className="flex flex-wrap justify-center gap-6 sm:hidden">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onItemClick(item)}
            className={`
              annotation
              transition-colors duration-200
              cursor-pointer
              hover:text-[var(--color-red)]
              ${
                activeItem === item 
                  ? 'text-[var(--color-red)]' 
                  : 'text-[var(--color-grey-dark)]'
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
      
      {/* Desktop version */}
      <div className="hidden sm:flex justify-center gap-9">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onItemClick(item)}
            className={`
              h3
              transition-colors duration-200
              cursor-pointer
              hover:text-white
              ${
                activeItem === item 
                  ? 'text-white' 
                  : 'text-[var(--color-grey-dark)]'
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
