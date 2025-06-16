import React from 'react';
import Image from 'next/image';

interface VoterProps {
  direction: 'up' | 'down';
  count: number;
  onClick?: () => void;
  background?: 'grey' | 'white';
}

export const Voter: React.FC<VoterProps> = ({
  direction,
  count,
  onClick,
  background = 'grey'
}) => {
  const getIcon = () => {
    return direction === 'up' 
      ? '/icons/Arrow=Direction=Arrow up-right.svg'
      : '/icons/Arrow=Direction=Arrow down-left.svg';
  };

  const getBgColor = () => {
    return background === 'grey' ? 'bg-[#F2F2F7]' : 'bg-[#FFFFFF]';
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center sm:justify-start gap-1 px-2 py-1.5 rounded-lg w-full ${getBgColor()}`}
    >
      <div className="relative w-5 h-5">
        <Image
          src={getIcon()}
          alt={direction === 'up' ? 'Upvote' : 'Downvote'}
          fill
          sizes="20px"
        />
      </div>
      <span className="font-['Inter'] font-medium text-base leading-normal text-[#000000]">
        {count}
      </span>
    </button>
  );
}; 