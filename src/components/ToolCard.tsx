import React, { useState } from 'react';
import Image from 'next/image';
import { ProCon } from './ProCon';
import { Link } from './Link';
import { CircularLogo } from './CircularLogo';

export interface VoteResult {
  toolId: string;
  voteStatus: 'VOTE_CREATED' | 'VOTE_UPDATED' | 'VOTE_UNCHANGED' | 'ERROR';
  sentiment: 'UPVOTE' | 'DOWNVOTE';
  message: string;
  variant: 'default' | 'warning';
}

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
            <div className="flex flex-col gap-4">
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
                  <button
                    onClick={handleTitleClick}
                    className="body text-[var(--color-black)] hover:cursor-pointer text-left"
                  >
                    {displayDescription}
                  </button>
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

                  {/* Actions */}
                  <div className="flex flex-row gap-6">
                    <Link variant="recommend" onClick={() => handleVote('UPVOTE', 'recommend')} isLoading={loadingState === 'recommend'} />
                    <Link variant="dont-recommend" onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} isLoading={loadingState === 'dont-recommend'} />
                    <Link variant="visit-site" onClick={handleVisitSite} />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Net Score - Desktop */}
          <div className="flex flex-col items-end w-[75px] flex-shrink-0">
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
                <button
                  onClick={handleTitleClick}
                  className="body text-[var(--color-black)] hover:cursor-pointer text-left"
                >
                  {displayDescription}
                </button>
              </div>
            </div>

            {/* Expanded Content (Conditional Rendering) */}
            {isExpanded && (
              <div className="flex flex-col gap-4">
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
          <div className="px-6 pb-6 flex flex-col gap-4">
            <Link variant="recommend" onClick={() => handleVote('UPVOTE', 'recommend')} isLoading={loadingState === 'recommend'} />
            <Link variant="dont-recommend" onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} isLoading={loadingState === 'dont-recommend'} />
            <Link variant="visit-site" onClick={handleVisitSite} />
          </div>
        </div>
      )}
    </div>
  );
} 