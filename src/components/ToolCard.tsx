import React from 'react';
import { Voter } from './Voter';

interface ToolCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  upvotes: number;
  downvotes: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  logo,
  url,
  upvotes,
  downvotes,
  onUpvote,
  onDownvote
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 flex items-center gap-6">
      <div className="w-20 h-20 shrink-0">
        <img src={logo} alt={`${name} logo`} className="w-full h-full object-contain" />
      </div>
      
      <div className="flex-grow">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-['Inter'] font-bold text-2xl leading-normal text-black hover:underline"
        >
          {name}
        </a>
        <p className="font-['Inter'] font-medium text-base leading-[1.4] text-black mt-2">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <Voter
          direction="up"
          count={upvotes}
          onClick={onUpvote}
        />
        <Voter
          direction="down"
          count={downvotes}
          onClick={onDownvote}
        />
      </div>
    </div>
  );
}; 