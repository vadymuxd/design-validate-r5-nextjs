'use client';

import Link from 'next/link';
import { UpdatedAt } from './UpdatedAt';

export const Footer = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-9 w-full">
      <Link href="/about">
        <span
          className={`font-bold text-[12px] text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          About
        </span>
      </Link>
      <Link href="/community">
        <span
          className={`font-bold text-[12px] text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          Community
        </span>
      </Link>

      <div className="w-2 h-2 bg-[var(--color-red)] rounded-full"></div>

      <UpdatedAt />
    </div>
  );
}; 