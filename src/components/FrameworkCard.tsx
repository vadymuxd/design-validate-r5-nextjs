import React, { useState } from 'react';
import Image from 'next/image';
import { Voter } from './Voter';
import { Link } from './Link';

// Utility function to render paragraphs from text with line breaks
function renderParagraphs(text: string | null, isDesktop: boolean = false): React.ReactNode {
  if (!text) return null;
  
  if (isDesktop) {
    // For desktop: single div with line-clamp for better truncation
    const formattedText = text.split('\n\n').filter(p => p.trim() !== '').join('\n\n');
    return (
      <div className="whitespace-pre-line">
        {formattedText}
      </div>
    );
  }
  
  // For mobile: separate paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
  return paragraphs.map((paragraph, index) => (
    <p key={index} className="body text-[var(--color-black)] mb-2 last:mb-0">
      {paragraph.trim()}
    </p>
  ));
}

export interface VoteResult {
  frameworkId: number;
  voteStatus: 'VOTE_CREATED' | 'VOTE_UPDATED' | 'VOTE_UNCHANGED' | 'ERROR';
  sentiment: 'UPVOTE' | 'DOWNVOTE';
  message: string;
  variant: 'default' | 'warning';
}

interface FrameworkCardProps {
  frameworkId: number;
  name: string;
  description: string | null;
  picture: string | null;
  link: string | null;
  upvotes: number;
  downvotes: number;
  onVote: (result: VoteResult) => void;
}

export function FrameworkCard({
  frameworkId,
  name,
  description,
  picture,
  link,
  upvotes,
  downvotes,
  onVote,
}: FrameworkCardProps) {
  type LoadingState = 'up' | 'down' | 'recommend' | 'dont-recommend' | null;
  const [loadingState, setLoadingState] = useState<LoadingState>(null);

  const handleVote = async (sentiment: 'UPVOTE' | 'DOWNVOTE', source: LoadingState) => {
    if (loadingState) return;
    setLoadingState(source);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vote_type: 'framework', 
          entity_id: frameworkId.toString(), 
          sentiment 
        }),
      });

      const result = await response.json();

      if (response.ok) { // Status 200-299
        onVote({ 
          frameworkId,
          voteStatus: result.status, // VOTE_CREATED or VOTE_UPDATED
          sentiment, 
          message: result.message || 'Thanks for your feedback!', 
          variant: 'default' 
        });
      } else if (response.status === 409) { // Conflict
        onVote({ 
          frameworkId,
          voteStatus: 'VOTE_UNCHANGED',
          sentiment, 
          message: result.message || 'You have already voted for this!', 
          variant: 'warning' 
        });
      } else {
        // Other errors
        onVote({ 
          frameworkId,
          voteStatus: 'ERROR',
          sentiment, 
          message: result.message || 'An error occurred.', 
          variant: 'warning' 
        });
      }
    } catch {
      onVote({ 
        frameworkId,
        voteStatus: 'ERROR',
        sentiment, 
        message: 'An unexpected error occurred.', 
        variant: 'warning' 
      });
    } finally {
      setLoadingState(null);
    }
  };

  const handleVisitSite = () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row h-[360px]">
        {/* Picture - Fixed 360x360 - First main column */}
        <div className="w-[360px] h-[360px] flex-shrink-0">
          {picture ? (
            <Image
              src={picture}
              alt={`${name} framework`}
              width={360}
              height={360}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Content Area - Second main column with padding */}
        <div className="flex-1 p-6 sm:p-8 flex flex-row gap-6">
          {/* Content - First sub-column */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div>
              <h3 className="h3 text-[var(--color-black)] mb-3">{name}</h3>
              {/* Desktop: Fixed height container with text truncation */}
              <div 
                className="h-[210px] overflow-hidden relative"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 12,
                  WebkitBoxOrient: 'vertical' as const,
                  textOverflow: 'ellipsis'
                }}
              >
                <div className="body text-[var(--color-black)]">
                  {renderParagraphs(description, true)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-6">
              <Link variant="recommend" onClick={() => handleVote('UPVOTE', 'recommend')} isLoading={loadingState === 'recommend'} />
              <Link variant="dont-recommend" onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} isLoading={loadingState === 'dont-recommend'} />
              {link && <Link variant="visit-site" onClick={handleVisitSite} />}
            </div>
          </div>

          {/* Votes - Second sub-column */}
          <div className="flex flex-col gap-2 w-[75px] flex-shrink-0">
            <Voter
              direction="up"
              count={upvotes}
              onClick={() => handleVote('UPVOTE', 'up')}
              background="grey"
              isLoading={loadingState === 'up'}
            />
            <Voter
              direction="down"
              count={downvotes}
              onClick={() => handleVote('DOWNVOTE', 'down')}
              background="grey"
              isLoading={loadingState === 'down'}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex sm:hidden flex-col">
        {/* Picture - Full width on mobile, use _m version if available */}
        <div className="w-full h-[240px]">
          {picture ? (
            <Image
              src={picture.replace(/(\.[a-zA-Z0-9]+)$/, '_m$1')}
              alt={`${name} framework`}
              width={360}
              height={240}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h3 className="h3 text-[var(--color-black)] mb-3">{name}</h3>
            <div>{renderParagraphs(description)}</div>
          </div>

          {/* Actions - Mobile: Only show Learn more, hide recommend/don't recommend */}
          <div className="flex flex-col gap-4">
            {link && <Link variant="visit-site" onClick={handleVisitSite} />}
          </div>

          {/* Votes - Mobile: Place after Learn more */}
          <div className="flex flex-row gap-2 justify-start">
            <Voter
              direction="up"
              count={upvotes}
              onClick={() => handleVote('UPVOTE', 'up')}
              background="grey"
              isLoading={loadingState === 'up'}
            />
            <Voter
              direction="down"
              count={downvotes}
              onClick={() => handleVote('DOWNVOTE', 'down')}
              background="grey"
              isLoading={loadingState === 'down'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
