import React from 'react';
import Image from 'next/image';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled-black' | 'filled-white' | 'ghost-white' | 'ghost-black';
  icon?: string;
}

export function Button({ children, variant = 'filled-black', icon, className, ...props }: ButtonProps) {
  const baseClasses =
    'px-6 py-3 rounded label-default transition-all duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer w-fit';

  const variantClasses = {
    'filled-black': 'bg-black text-white hover:bg-gray-800',
    'filled-white': 'bg-white text-black border border-gray-200 hover:bg-gray-50',
    'ghost-white': 'bg-transparent text-white border border-white',
    'ghost-black': 'bg-transparent text-black border border-[var(--color-grey-light)]',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {icon && <Image src={icon} alt="" width={16} height={16} />}
      {children}
    </button>
  );
} 