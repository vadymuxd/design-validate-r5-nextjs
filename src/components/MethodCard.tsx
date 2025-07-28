import React, { useState } from 'react';
import { Link } from './Link';
import { Button } from './Button';

interface VoteResult {
  status: string;
  message: string;
  method_id: number;
  sentiment: string;
}

interface MethodCardProps {
  methodId: number;
  name: string;
  slug: string;
  description: string;
  voteCount: number;
  onVote?: (methodId: number, sentiment: 'UPVOTE' | 'DOWNVOTE') => Promise<VoteResult>;
  hideDivider?: boolean;
}

export function MethodCard({
  methodId,
  name,
  slug,
  description,
  voteCount,
  onVote,
  hideDivider = false,
}: MethodCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTitleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewTools = () => {
    // Navigate to tools page with method preselected
    window.location.href = `/tools?method_slug=${slug}`;
  };

  const handleRecommendClick = async () => {
    if (onVote) {
      await onVote(methodId, 'UPVOTE');
    }
  };

  const handleDontRecommendClick = async () => {
    if (onVote) {
      await onVote(methodId, 'DOWNVOTE');
    }
  };

  return (
    <div className={hideDivider ? "" : "border-b border-[var(--color-grey-darkest)] last:border-b-0"}>
      <div className="py-4">
        {/* Collapsed Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleTitleClick}
            className="flex items-center gap-2 hover:cursor-pointer group flex-1 text-left"
          >
            <span className="text-[var(--color-red)] text-[14px] font-black">
              /
            </span>
            <span className="label-default text-white font-medium group-hover:text-[var(--color-red)] transition-colors">
              {name}
            </span>
          </button>
          
          {/* Vote Count */}
          <div className="text-white annotation">
            +{voteCount}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6">
            {/* Description */}
            <div className="mb-6">
              <p className="annotation text-white leading-relaxed">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {/* Recommend/Don't Recommend Links */}
              <div className="flex gap-6">
                <div className="[&_button]:!text-white [&_svg]:text-[var(--color-green)]">
                  <Link 
                    variant="recommend" 
                    onClick={handleRecommendClick}
                  />
                </div>
                <div className="[&_button]:!text-white [&_svg]:text-[var(--color-red)]">
                  <Link 
                    variant="dont-recommend" 
                    onClick={handleDontRecommendClick}
                  />
                </div>
              </div>

              {/* View Tools Button */}
              <div className="w-full [&_button]:w-full [&_button]:bg-white [&_button]:text-black [&_button]:hover:!bg-white [&_button]:hover:opacity-90 [&_button]:border-none">
                <Button
                  variant="primary"
                  onClick={handleViewTools}
                >
                  View tools
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 