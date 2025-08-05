import React from 'react';

interface ContentCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: 'dark' | 'light';
  size?: 'medium' | 'small';
  className?: string;
  onClick?: () => void;
}

export function ContentCard({
  icon,
  title,
  children,
  variant = 'dark',
  size = 'medium',
  className = '',
  onClick,
}: ContentCardProps) {
  const baseClasses = 'rounded-2xl flex flex-col gap-6';
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : '';

  const variantClasses = {
    dark: 'bg-black border border-[var(--color-grey-darkest)] text-white',
    light: 'bg-[var(--color-grey-light)] border border-transparent text-black',
  };

  const sizeClasses = {
    medium: 'p-9',
    small: 'p-6 sm:p-9',
  };

  const titleClasses = {
    dark: 'text-[var(--color-red)]',
    light: 'text-black',
  };

  const titleSizeClasses = {
    medium: 'h3',
    small: 'label-bold',
  };
  
  const bodyClasses = {
    dark: 'text-white',
    light: 'text-[var(--color-grey-dark)]'
  }

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {icon && <div className="w-6 h-6">{icon}</div>}
      <h3 className={`${titleSizeClasses[size]} ${titleClasses[variant]}`}>
        {title}
      </h3>
      <div className={`annotation ${bodyClasses[variant]}`}>{children}</div>
    </div>
  );
} 