'use client';

import { Category } from '@/data/types';

interface PillProps {
  id: Category;
  label: string;
  isActive: boolean;
  onClick: (id: Category) => void;
}

export function Pill({ id, label, isActive, onClick }: PillProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        rounded-[36px] px-3 py-2 transition-all cursor-pointer font-['Inter'] font-semibold text-[12px] leading-none
        ${
          isActive
            ? 'bg-white text-black hover:opacity-80'
            : 'bg-transparent text-white border border-white hover:bg-white hover:text-black'
        }
      `}
    >
      {label}
    </button>
  );
} 