import React from 'react';

interface VoterProps {
  direction: 'up' | 'down';
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const Voter: React.FC<VoterProps> = ({
  direction,
  count,
  isActive = false,
  onClick
}) => {
  const color = direction === 'up' ? '#77DB95' : '#FF3654';
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 bg-[#F2F2F7] px-2 py-1.5 rounded-lg"
    >
      <div className={`${direction === 'down' ? 'rotate-180' : ''}`}>
        <svg
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 0L13.9282 12H0.0717969L7 0Z"
            fill={isActive ? color : '#8E8E93'}
          />
        </svg>
      </div>
      <span className="font-['Inter'] font-medium text-base leading-normal text-[#000000]">
        {count}
      </span>
    </button>
  );
}; 