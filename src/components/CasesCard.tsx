import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Link } from './Link';
import { Button } from './Button';

// Method name mapping (slug -> display name)
const METHOD_NAME_MAP: Record<string, string> = {
  'usability-testing': 'Usability Testing',
  'event-tracking': 'Event Tracking',
  'ab-testing': 'A/B Testing',
  'user-data-intelligence': 'User Data Intelligence',
  'session-replays': 'Session Replays',
  'heat-maps': 'Heatmaps',
  'surveys': 'Surveys',
  'user-feedback': 'In-App Feedback',
  'concept-testing': 'Concept Testing',
  'user-interviews': 'User Interviews',
  'card-sorting': 'Card Sorting',
  'first-click': 'First-Click Testing',
  'tree-testing': 'Tree Testing',
  'form-analytics': 'Form Analytics',
  'funnels': 'Funnels',
  'accessibility-testing': 'Accessibility Testing',
  'field-study': 'Field Study',
  'diary-study': 'Diary Study'
};

// Utility function to render paragraphs from text with line breaks
function renderParagraphs(text: string | null): React.ReactNode {
  if (!text) return null;
  
  const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
  return paragraphs.map((paragraph, index) => (
    <p key={index} className="body text-[var(--color-black)] mb-2 last:mb-0">
      {paragraph.trim()}
    </p>
  ));
}

// Method Tag Component
interface MethodTagProps {
  methodSlug: string;
  onClick: () => void;
}

function MethodTag({ methodSlug, onClick }: MethodTagProps) {
  const displayName = METHOD_NAME_MAP[methodSlug] || methodSlug;
  
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        backgroundColor: 'var(--color-grey-light)',
        color: 'var(--color-grey-dark)',
      }}
    >
      {displayName}
    </button>
  );
}

export interface CaseVoteResult {
  caseId: number;
  voteStatus: 'VOTE_CREATED' | 'VOTE_UPDATED' | 'VOTE_UNCHANGED' | 'ERROR';
  sentiment: 'UPVOTE' | 'DOWNVOTE';
  message: string;
  variant: 'default' | 'warning';
}

interface CasesCardProps {
  caseId: number;
  name: string;
  description: string | null;
  picture: string | null;
  url: string | null;
  releaseDate: string;
  methods: string[];
  upvotes: number;
  downvotes: number;
  onVote: (result: CaseVoteResult) => void;
}

export function CasesCard({
  caseId,
  name,
  description,
  picture,
  url,
  releaseDate,
  methods,
  upvotes,
  downvotes,
  onVote,
}: CasesCardProps) {
  type LoadingState = 'recommend' | 'dont-recommend' | null;
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const router = useRouter();

  const handleVote = async (sentiment: 'UPVOTE' | 'DOWNVOTE', source: LoadingState) => {
    if (loadingState) return;
    setLoadingState(source);
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          vote_type: 'case', 
          entity_id: caseId.toString(), 
          sentiment 
        }),
      });

      const result = await response.json();

      if (response.ok) { // Status 200-299
        onVote({ 
          caseId,
          voteStatus: result.status, // VOTE_CREATED or VOTE_UPDATED
          sentiment, 
          message: result.message || 'Thanks for your feedback!', 
          variant: 'default' 
        });
      } else if (response.status === 409) { // Conflict
        onVote({ 
          caseId,
          voteStatus: 'VOTE_UNCHANGED',
          sentiment, 
          message: result.message || 'You have already voted for this!', 
          variant: 'warning' 
        });
      } else {
        // Other errors
        onVote({ 
          caseId,
          voteStatus: 'ERROR',
          sentiment, 
          message: result.message || 'An error occurred.', 
          variant: 'warning' 
        });
      }
    } catch {
      onVote({ 
        caseId,
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
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTitleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMethodClick = (method: string) => {
    router.push(`/methods?expanded=${method}#${method}`);
  };

  const netBalance = upvotes - downvotes;
  const netBalanceDisplay = netBalance > 0 ? `+${netBalance}` : netBalance < 0 ? `${netBalance}` : '0';

  // Format release date for display (assuming ISO format input)
  const formatReleaseDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString; // fallback to original string
    }
  };

  return (
    <div className="bg-white overflow-hidden w-full max-w-[520px] h-auto min-h-[700px] flex flex-col">
      {/* Picture - Top section (clickable) */}
      <div 
        className="w-full h-[280px] flex-shrink-0 cursor-pointer"
        onClick={handleTitleClick}
      >
        {picture ? (
          <Image
            src={picture}
            alt={`${name} case study`}
            width={520}
            height={280}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header with Title and Net Score (clickable title) */}
        <div className="flex flex-row items-start justify-between mb-6">
          <h3 
            className="h3 text-[var(--color-black)] m-0 flex-1 mr-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleTitleClick}
          >
            {name}
          </h3>
          <span className="body text-gray-400 text-lg flex-shrink-0">{netBalanceDisplay}</span>
        </div>

        {/* Methods Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {methods.map((methodSlug, index) => (
            <MethodTag
              key={index}
              methodSlug={methodSlug}
              onClick={() => handleMethodClick(methodSlug)}
            />
          ))}
        </div>

        {/* Description */}
        <div className="mb-6 overflow-hidden">
          <div className="body text-[var(--color-black)]">
            {renderParagraphs(description)}
          </div>
        </div>

        {/* Release Date */}
        <div className="mb-6">
          <div className="body text-[var(--color-black)]">
            {formatReleaseDate(releaseDate)}
          </div>
        </div>

        {/* Mobile separator line */}
        <div className="md:hidden mb-6 border-t border-[var(--color-grey-light)]"></div>

        {/* Actions - Bottom section */}
        <div className="flex flex-col gap-4 mt-auto">
          {/* Desktop: All buttons in one row */}
          <div className="hidden md:flex flex-row gap-6">
            <Link 
              variant="recommend" 
              onClick={() => handleVote('UPVOTE', 'recommend')} 
              isLoading={loadingState === 'recommend'} 
            />
            <Link 
              variant="dont-recommend" 
              onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} 
              isLoading={loadingState === 'dont-recommend'} 
            />
            {url && <Link variant="view-case" onClick={handleVisitSite} />}
          </div>

          {/* Mobile: Vote buttons in one row */}
          <div className="flex md:hidden flex-row gap-6">
            <Link 
              variant="recommend" 
              onClick={() => handleVote('UPVOTE', 'recommend')} 
              isLoading={loadingState === 'recommend'} 
            />
            <Link 
              variant="dont-recommend" 
              onClick={() => handleVote('DOWNVOTE', 'dont-recommend')} 
              isLoading={loadingState === 'dont-recommend'} 
            />
          </div>

          {/* Mobile: View case button full width */}
          {url && (
            <div className="flex md:hidden">
              <Button 
                variant="filled-black" 
                onClick={handleVisitSite}
                className="w-full"
              >
                View case
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
