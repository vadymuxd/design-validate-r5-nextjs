import React from 'react';

interface MetricLetterCardProps {
  letter: string;
  className?: string;
}

export function MetricLetterCard({
  letter,
  className = '',
}: MetricLetterCardProps) {
  return (
    <div
      className={`
        w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]
        bg-[var(--color-grey-dark)]
        rounded-lg 
        flex flex-col 
        justify-center
        items-center
        ${className}
      `}
    >
      {/* Letter */}
      <span className="h1 text-black font-bold">
        {letter.toUpperCase()}
      </span>
    </div>
  );
}
