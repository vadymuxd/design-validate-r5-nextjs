import React from 'react';

interface PillProps {
  label: string;
  isActive?: boolean;
}

export const Pill: React.FC<PillProps> = ({ label, isActive = false }) => {
  return (
    <div
      className={`
        rounded-[36px] px-4 py-2.5
        ${isActive ? 'bg-white' : 'border border-white'}
      `}
    >
      <span
        className={`
          font-['Inter'] font-semibold text-[12px] leading-normal whitespace-pre
          ${isActive ? 'text-black' : 'text-white'}
        `}
      >
        {label}
      </span>
    </div>
  );
}; 