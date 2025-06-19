import React, { useState } from 'react';
import Image from 'next/image';
import { Voter } from './Voter';
import { ProCon } from './ProCon';
import { Link } from './Link';

export interface VoteResult {
  toolId: string;
  voteStatus: 'VOTE_CREATED' | 'VOTE_UPDATED' | 'VOTE_UNCHANGED' | 'ERROR';
  sentiment: 'UPVOTE' | 'DOWNVOTE';
  message: string;
  variant: 'default' | 'warning';
}

interface ToolCardProps {
  toolId: string;
  categoryId: number;
  name: string;
  description: string | null;
  logo: string | null;
  url: string | null;
  upvotes: number;
  downvotes: number;
  proText: string | null;
  conText: string | null;
  onVote: (result: VoteResult) => void;
}

export function ToolCard({
  toolId,
  categoryId,
  name,
  description,
  logo,
  url,
  upvotes,
  downvotes,
  proText,
  conText,
  onVote,
}: ToolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  type LoadingState = 'up' | 'down' | 'recommend' | 'dont-recommend' | null;
  const [loadingState, setLoadingState] = useState<LoadingState>(null);

  const handleVote = async (sentiment: 'UPVOTE' | 'DOWNVOTE', source: LoadingState) => {
    if (loadingState) return;
    setLoadingState(source);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: toolId, category_id: categoryId, sentiment }),
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

  const handleVisitSite = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8">
      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row gap-6 items-start">
        {/* Logo */}
        <div className="relative w-20 h-20 shrink-0">
          {logo && (
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              sizes="80px"
              className="rounded-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-2">
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
                <p className="body text-[var(--color-black)]">{description}</p>
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

        {/* Votes - Desktop */}
        <div className="flex flex-col gap-2 w-[75px] flex-shrink-0">
          <Voter
            direction="up"
            count={upvotes}
            onClick={() => handleVote('UPVOTE', 'up')}
            background={isExpanded ? 'white' : 'grey'}
            isLoading={loadingState === 'up'}
          />
          <Voter
            direction="down"
            count={downvotes}
            onClick={() => handleVote('DOWNVOTE', 'down')}
            background={isExpanded ? 'white' : 'grey'}
            isLoading={loadingState === 'down'}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex sm:hidden flex-col gap-6">
        {/* Logo */}
        <div className="relative w-20 h-20 shrink-0">
          {logo && (
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              sizes="80px"
              className="rounded-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <div className="flex flex-col gap-2">
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
              <p className="body text-[var(--color-black)]">{description}</p>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <>
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

              {/* Divider */}
              <div className="h-px bg-[#F2F2F7] w-full"></div>

              {/* Actions */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-6">
                  <Link variant="recommend" onClick={() => handleVote('UPVOTE', 'recommend')} isLoading={loadingState === 'recommend'} />
                  <Link variant="dont-recommend" onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} isLoading={loadingState === 'dont-recommend'} />
                </div>
                <Link variant="visit-site" onClick={handleVisitSite} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Votes - Mobile */}
      <div className="flex sm:hidden flex-row gap-2 w-full justify-end mt-4">
        <div className="flex flex-row gap-2">
          <Voter
            direction="up"
            count={upvotes}
            onClick={() => handleVote('UPVOTE', 'up')}
            background={isExpanded ? 'white' : 'grey'}
            isLoading={loadingState === 'up'}
          />
          <Voter
            direction="down"
            count={downvotes}
            onClick={() => handleVote('DOWNVOTE', 'down')}
            background={isExpanded ? 'white' : 'grey'}
            isLoading={loadingState === 'down'}
          />
        </div>
      </div>
    </div>
  );
} 