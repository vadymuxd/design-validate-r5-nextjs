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
        rounded-[36px] px-3 py-2 transition-all cursor-pointer label-mini
        ${
          isActive
            ? 'bg-white text-[var(--color-black)] hover:opacity-80'
            : 'bg-transparent text-[var(--color-white)] outline outline-1 outline-white hover:bg-white hover:text-[var(--color-black)]'
        }
      `}
    >
      {label}
    </button>
  );
} 