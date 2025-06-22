'use client';

interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function Pill({ label, isActive, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-[36px] px-4 py-2.5 transition-all cursor-pointer label-mini
        ${
          isActive
            ? 'bg-white text-[var(--color-black)] hover:opacity-80'
            : 'bg-[var(--color-grey-dark)] text-[var(--color-grey-light)] hover:bg-white hover:text-[var(--color-black)]'
        }
      `}
    >
      {label}
    </button>
  );
} 