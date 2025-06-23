'use client';

import Link from 'next/link';
import { UpdatedAt } from './UpdatedAt';

export const Footer = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-9 w-full">
      <Link href="/about#contact-form">
        <span
          className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          Contact
        </span>
      </Link>
      <Link href="/about">
        <span
          className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          About
        </span>
      </Link>
      <Link href="/community">
        <span
          className={`label-mini text-[var(--color-grey-light)] hover:text-[var(--color-red)] transition-colors duration-200`}
        >
          Community
        </span>
      </Link>

      <div className="w-2 h-2 bg-[var(--color-red)] rounded-full"></div>

      <UpdatedAt />
    </div>
  );
}; 