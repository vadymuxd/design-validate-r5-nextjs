import React from 'react';
import Image from 'next/image';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: string;
}

export function Button({ children, variant = 'primary', icon, ...props }: ButtonProps) {
  const baseClasses =
    'px-9 py-3 rounded-lg label-default transition-all duration-300 ease-in-out flex items-center justify-center gap-2 cursor-pointer w-fit';

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-[var(--color-red)]',
    secondary: 'bg-white text-black border border-gray-200 hover:bg-gray-100',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon && <Image src={icon} alt="" width={16} height={16} />}
      {children}
    </button>
  );
} 