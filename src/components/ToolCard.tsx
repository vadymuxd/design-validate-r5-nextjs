import React, { useState } from 'react';
import Image from 'next/image';
import { ProCon } from './ProCon';
import { Button } from './Button';
import { CircularLogo } from './CircularLogo';
import LeaderboardNumber from './LeaderboardNumber';
import { ToolLeaderboardPosition } from '@/data/types';

export interface VoteResult {
  toolId: string;
  voteStatus: 'VOTE_CREATED' | 'VOTE_UPDATED' | 'VOTE_UNCHANGED' | 'ERROR';
  sentiment: 'UPVOTE' | 'DOWNVOTE';
  message: string;
  variant: 'default' | 'warning';
}

// Helper function to get icons for the actions
const getActionIcon = (variant: 'recommend' | 'dont-recommend' | 'visit-site', isLoading: boolean) => {
  if (isLoading && (variant === 'recommend' || variant === 'dont-recommend')) {
    return (
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  switch (variant) {
    case 'recommend':
      return (
        <div className="w-5 h-5 flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H5.83331M14.1666 5.83334V14.1667"
              stroke="var(--color-green)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case 'dont-recommend':
      return (
        <div className="w-5 h-5 flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M14.1666 5.83334L5.83331 14.1667M5.83331 14.1667H14.1666M5.83331 14.1667V5.83334"
              stroke="var(--color-red)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case 'visit-site':
      return (
        <div className="w-5 h-5 flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667M12.5 2.5H17.5M17.5 2.5V7.5M17.5 2.5L8.33333 11.6667"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
  }
};

const getActionText = (variant: 'recommend' | 'dont-recommend' | 'visit-site') => {
  switch (variant) {
    case 'recommend':
      return 'Recommend';
    case 'dont-recommend':
      return "Don't recommend";
    case 'visit-site':
      return 'Learn more';
  }
};

interface ToolCardProps {
  toolId: string;
  methodId: number;
  name: string;
  description: string | null;
  featureDescription: string | null;
  logo: string | null;
  url: string | null;
  upvotes: number;
  downvotes: number;
  proText: string | null;
  conText: string | null;
  onVote: (result: VoteResult) => void;
  isFirst?: boolean; // For top rounded corners
  isLast?: boolean; // For bottom rounded corners
  leaderboardPositions?: ToolLeaderboardPosition[]; // Optional leaderboard data
}

export function ToolCard({
  toolId,
  methodId,
  name,
  description,
  featureDescription,
  logo,
  url,
  upvotes,
  downvotes,
  proText,
  conText,
  onVote,
  isFirst = false,
  isLast = false,
  leaderboardPositions = [],
}: ToolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  type LoadingState = 'up' | 'down' | 'recommend' | 'dont-recommend' | null;
  const [loadingState, setLoadingState] = useState<LoadingState>(null);

  // Determine which description to display: feature_description if available, otherwise fallback to generic description
  const displayDescription = featureDescription || description;

  const handleVote = async (sentiment: 'UPVOTE' | 'DOWNVOTE', source: LoadingState) => {
    if (loadingState) return;
    setLoadingState(source);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vote_type: 'tool', 
          entity_id: toolId, 
          context_id: methodId, 
          sentiment 
        }),
      });

      const result = await response.json();

      if (response.ok) { // Status 200-299
        onVote({ 
          toolId,
          voteStatus: result.status, // VOTE_CREATED or VOTE_UPDATED
          sentiment, 
          message: result.message || 'Thanks for your feedback!', 
          variant: 'default' 
        });
      } else if (response.status === 409) { // Conflict
        onVote({ 
          toolId,
          voteStatus: 'VOTE_UNCHANGED',
          sentiment, 
          message: result.message || 'You have already voted for this!', 
          variant: 'warning' 
        });
      } else {
        // Other errors
        onVote({ 
          toolId,
          voteStatus: 'ERROR',
          sentiment, 
          message: result.message || 'An error occurred.', 
          variant: 'warning' 
        });
      }
    } catch {
      onVote({ 
        toolId,
        voteStatus: 'ERROR',
        sentiment, 
        message: 'An unexpected error occurred.', 
        variant: 'warning' 
      });
    } finally {
      setLoadingState(null);
    }
  };

  const handleTitleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleVisitSite = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Calculate net score
  const netBalance = upvotes - downvotes;
  const netBalanceDisplay = netBalance > 0 ? `+${netBalance}` : netBalance < 0 ? `${netBalance}` : '0';

  // Filter out "All in" method since it's not a specific method context, but keep the current method
  const filteredLeaderboardPositions = leaderboardPositions
    .filter(position => position.methodSlug !== 'all-in')
    .sort((a, b) => a.rank - b.rank); // Sort by rank ascending (1, 2, 3, ...)

  // Calculate rounded corners based on position
  const getRoundedCorners = () => {
    if (isFirst && isLast) return 'rounded-2xl'; // Single item
    if (isFirst) return 'rounded-t-2xl'; // First item
    if (isLast) return 'rounded-b-2xl'; // Last item
    return ''; // Middle items - no rounded corners
  };

  return (
    <div 
      className={`bg-white ${getRoundedCorners()}`}
      onClick={handleCardClick}
      style={{ cursor: !isExpanded ? 'pointer' : 'default' }}
    >
      <div className="p-6 sm:p-8">
        {/* Desktop Layout */}
        <div className="hidden sm:flex flex-row gap-6 items-start">
          {/* Logo */}
          <div className="shrink-0">
            {logo && (
              <button
                onClick={handleTitleClick}
                className="hover:cursor-pointer"
              >
                <CircularLogo
                  src={logo}
                  alt={`${name} logo`}
                  size={60}
                />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow">
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTitleClick}
                      className="h3 text-[var(--color-black)] hover:cursor-pointer flex items-center gap-2"
                    >
                      {name}
                      <div className="relative w-5 h-5">
                        <Image
                          src={isExpanded ? '/icons/Chevron=Up.svg' : '/icons/Chevron=Down.svg'}
                          alt={isExpanded ? 'Collapse' : 'Expand'}
                          fill
                          sizes="20px"
                        />
                      </div>
                    </button>
                  </div>
                  <div
                    onClick={handleTitleClick}
                    className="body text-[var(--color-black)] hover:cursor-pointer text-left select-text"
                  >
                    {displayDescription}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <>
                  {/* Pro & Con Section */}
                  {(proText || conText) && (
                    <div className="flex flex-row gap-4">
                      {proText && (
                        <div className="flex-1">
                          <ProCon
                            variant="pro"
                            title="Pro"
                            text={proText}
                          />
                        </div>
                      )}
                      {conText && (
                        <div className="flex-1">
                          <ProCon
                            variant="con"
                            title="Con"
                            text={conText}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Leaderboard Positions */}
                  {filteredLeaderboardPositions && filteredLeaderboardPositions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-y-2">
                      {filteredLeaderboardPositions.map((position, index) => (
                        <React.Fragment key={position.methodId}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/tools?method_slug=${position.methodSlug}`;
                            }}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            <LeaderboardNumber 
                              rank={position.rank}
                              methodName={position.methodName}
                            />
                          </button>
                          {index < filteredLeaderboardPositions.length - 1 && (
                            <span className="label-default text-black mr-3">,</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-row gap-3">
                    <Button 
                      variant="filled-black" 
                      onClick={() => handleVote('UPVOTE', 'recommend')} 
                      disabled={loadingState === 'recommend'}
                      className="flex items-center gap-2"
                    >
                      {getActionIcon('recommend', loadingState === 'recommend')}
                      {getActionText('recommend')}
                    </Button>
                    <Button 
                      variant="filled-black" 
                      onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} 
                      disabled={loadingState === 'dont-recommend'}
                      className="flex items-center gap-2"
                    >
                      {getActionIcon('dont-recommend', loadingState === 'dont-recommend')}
                      {getActionText('dont-recommend')}
                    </Button>
                    <Button 
                      variant="ghost-black" 
                      onClick={handleVisitSite}
                      className="flex items-center gap-2"
                    >
                      {getActionIcon('visit-site', false)}
                      {getActionText('visit-site')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Net Score - Desktop */}
          <div className="flex flex-col items-end w-[15px] flex-shrink-0">
            <span className="body text-gray-400 text-lg">{netBalanceDisplay}</span>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex sm:hidden flex-col gap-6">
          {/* Logo */}
          <div className="shrink-0">
            {logo && (
              <button
                onClick={handleTitleClick}
                className="hover:cursor-pointer"
              >
                <CircularLogo
                  src={logo}
                  alt={`${name} logo`}
                  size={60}
                />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleTitleClick}
                    className="h3 text-[var(--color-black)] hover:cursor-pointer flex items-center gap-2"
                  >
                    {name}
                    <div className="relative w-5 h-5">
                      <Image
                        src={isExpanded ? '/icons/Chevron=Up.svg' : '/icons/Chevron=Down.svg'}
                        alt={isExpanded ? 'Collapse' : 'Expand'}
                        fill
                        sizes="20px"
                      />
                    </div>
                  </button>
                  <span className="body text-gray-400 text-lg ml-2">{netBalanceDisplay}</span>
                </div>
                <div
                  onClick={handleTitleClick}
                  className="body text-[var(--color-black)] hover:cursor-pointer text-left select-text"
                >
                  {displayDescription}
                </div>
              </div>
            </div>

            {/* Expanded Content (Conditional Rendering) */}
            {isExpanded && (
              <div className="flex flex-col gap-8">
                {/* Pro & Con Section */}
                {(proText || conText) && (
                  <div className="flex flex-col gap-4">
                    {proText && (
                      <ProCon
                        variant="pro"
                        title="Pro"
                        text={proText}
                      />
                    )}
                    {conText && (
                      <ProCon
                        variant="con"
                        title="Con"
                        text={conText}
                      />
                    )}
                  </div>
                )}

                {/* Leaderboard Positions */}
                {filteredLeaderboardPositions && filteredLeaderboardPositions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm text-gray-600 mb-2 w-full">
                      Also listed in {filteredLeaderboardPositions.length} other method{filteredLeaderboardPositions.length > 1 ? 's' : ''}:
                    </div>
                    {filteredLeaderboardPositions.map((position, index) => (
                      <React.Fragment key={position.methodId}>
                        <LeaderboardNumber 
                          rank={position.rank}
                          methodName={position.methodName}
                        />
                        {index < filteredLeaderboardPositions.length - 1 && (
                          <span className="text-gray-400">,</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content for Mobile - Placed outside the main padding */}
      {isExpanded && (
        <div className="block sm:hidden">
          {/* Divider */}
          <div className="h-px bg-[#F2F2F7] w-full my-4"></div>

          {/* Actions - with its own padding */}
          <div className="px-6 pb-6 flex flex-col gap-3">
            <Button 
              variant="filled-black" 
              onClick={() => handleVote('UPVOTE', 'recommend')} 
              disabled={loadingState === 'recommend'}
              className="flex items-center gap-2 w-full"
            >
              {getActionIcon('recommend', loadingState === 'recommend')}
              {getActionText('recommend')}
            </Button>
            <Button 
              variant="filled-black" 
              onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} 
              disabled={loadingState === 'dont-recommend'}
              className="flex items-center gap-2 w-full"
            >
              {getActionIcon('dont-recommend', loadingState === 'dont-recommend')}
              {getActionText('dont-recommend')}
            </Button>
            <Button 
              variant="ghost-black" 
              onClick={handleVisitSite}
              className="flex items-center gap-2 w-full"
            >
              {getActionIcon('visit-site', false)}
              {getActionText('visit-site')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 